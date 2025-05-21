/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { URI } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ICommandDetectionCapability, ITerminalCapabilityStore, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ILspTerminalModelContentProvider, PYTHON_LANGUAGE_ID } from '../../../../browser/lspTerminalCapability.js';
import { IMarkerService } from '../../../../../platform/markers/common/markers.js';
import { GeneralShellType, TerminalShellType } from '../../../../../platform/terminal/common/terminal.js';

export const VSCODE_LSP_TERMINAL_PROMPT_TRACKER = 'vscode_lsp_terminal_prompt_tracker= {}\n';

export class LspTerminalModelContentProvider extends Disposable implements ILspTerminalModelContentProvider, ITextModelContentProvider {
	static readonly scheme = Schemas.vscodeTerminal;
	private _commandDetection: ICommandDetectionCapability | undefined;
	private _capabilitiesStore: ITerminalCapabilityStore;
	private readonly _virtualTerminalDocumentUri: URI;
	private readonly _markerFilterDisposable: IDisposable;
	private _shellType: TerminalShellType | undefined;
	private readonly _onCommandFinishedListener = this._register(new MutableDisposable());

	constructor(
		capabilityStore: ITerminalCapabilityStore,
		terminalId: number,
		virtualTerminalDocument: URI,
		shellType: TerminalShellType | undefined,
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IMarkerService private readonly _markerService: IMarkerService,

	) {
		super();
		this._register(textModelService.registerTextModelContentProvider(LspTerminalModelContentProvider.scheme, this));
		this._capabilitiesStore = capabilityStore;
		this._commandDetection = this._capabilitiesStore.get(TerminalCapability.CommandDetection);
		this._registerTerminalCommandFinishedListener();
		this._virtualTerminalDocumentUri = virtualTerminalDocument;

		// Suppress diagnostics for REPL virtual document, similar to agentic mode.
		this._markerFilterDisposable = this._markerService.installResourceFilter(
			this._virtualTerminalDocumentUri,
			'Diagnostics for Terminal LSP REPL is stopped.'
		);
		this._register(this._markerFilterDisposable); // Ensure the filter is disposed when this provider is disposed
		this._shellType = shellType;
	}

	// Listens to onDidChangeShellType event from `terminal.suggest.contribution.ts`
	shellTypeChanged(shellType: TerminalShellType | undefined): void {
		this._shellType = shellType;
	}

	/**
	 * Sets or updates content for a terminal virtual document.
	 * This is when user has executed succesful command in terminal.
	 * Transfer the content to virtual document, and relocate delimiter to get terminal prompt ready for next prompt.
	 */
	setContent(content: string): void {
		const model = this._modelService.getModel(this._virtualTerminalDocumentUri);
		// Trailing coming from Python itself shouldn't be included in the REPL.
		if (content !== 'exit()' && this._shellType === GeneralShellType.Python) {
			if (model) {
				const existingContent = model.getValue();
				if (existingContent === '') {
					model.setValue(VSCODE_LSP_TERMINAL_PROMPT_TRACKER);
				} else {
					// If we are appending to existing content, remove delimiter, attach new content, and re-add delimiter
					const delimiterIndex = existingContent.lastIndexOf(VSCODE_LSP_TERMINAL_PROMPT_TRACKER);
					const sanitizedExistingContent = delimiterIndex !== -1 ?
						existingContent.substring(0, delimiterIndex) :
						existingContent;

					const newContent = sanitizedExistingContent + '\n' + content + '\n' + VSCODE_LSP_TERMINAL_PROMPT_TRACKER;
					model.setValue(newContent);
				}
			}
		}
	}

	/**
	 * Real-time conversion of terminal input to virtual document happens here.
	 * This is when user types in terminal, and we want to track the input.
	 * We want to track the input and update the virtual document.
	 * Note: This is for non-executed command.
	*/
	trackPromptInputToVirtualFile(content: string): void {
		this._commandDetection = this._capabilitiesStore.get(TerminalCapability.CommandDetection);
		const model = this._modelService.getModel(this._virtualTerminalDocumentUri);
		if (content !== 'exit()' && this._shellType === GeneralShellType.Python) {
			if (model) {
				const existingContent = model.getValue();
				const delimiterIndex = existingContent.lastIndexOf(VSCODE_LSP_TERMINAL_PROMPT_TRACKER);

				// Keep content only up to delimiter
				const sanitizedExistingContent = delimiterIndex !== -1 ?
					existingContent.substring(0, delimiterIndex) :
					existingContent;

				// Combine base content with new content
				const newContent = sanitizedExistingContent + VSCODE_LSP_TERMINAL_PROMPT_TRACKER + content;

				model.setValue(newContent);
			}
		}
	}

	private _registerTerminalCommandFinishedListener(): void {
		const attachListener = () => {
			if (this._onCommandFinishedListener.value) {
				return;
			}

			// Inconsistent repro: Covering case where commandDetection is available but onCommandFinished becomes available later
			if (this._commandDetection && this._commandDetection.onCommandFinished) {
				this._onCommandFinishedListener.value = this._register(this._commandDetection.onCommandFinished((e) => {
					if (e.exitCode === 0 && this._shellType === GeneralShellType.Python) {
						this.setContent(e.command);
					}

				}));
			}
		};
		attachListener();

		// Listen to onDidAddCapabilityType because command detection is not available until later
		this._register(this._capabilitiesStore.onDidAddCapabilityType(e => {
			if (e === TerminalCapability.CommandDetection) {
				this._commandDetection = this._capabilitiesStore.get(TerminalCapability.CommandDetection);
				attachListener();
			}
		}));

	}

	// TODO: Adapt to support non-python virtual document for non-python REPLs.
	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);

		if (existing && !existing.isDisposed()) {
			return existing;
		}

		const extension = resource.path.split('.').pop();
		let languageId: string | undefined | null = undefined;
		if (extension) {
			languageId = this._languageService.getLanguageIdByLanguageName(extension);

			if (!languageId) {
				switch (extension) {
					case 'py': languageId = PYTHON_LANGUAGE_ID; break;
					// case 'ps1': languageId = 'powershell'; break;
					// case 'js': languageId = 'javascript'; break;
					// case 'ts': languageId = 'typescript'; break; etc...
				}
			}
		}

		const languageSelection = languageId ?
			this._languageService.createById(languageId) :
			this._languageService.createById('plaintext');

		return this._modelService.createModel('', languageSelection, resource, false);
	}

}

/**
 * Creates a terminal language virtual URI.
 */
// TODO: Make sure path is correct for Windows when we start supporting LSP completions in Windows. (Both Python, Non-Python)
export function createTerminalLanguageVirtualUri(terminalId: number, languageExtension: string): URI {
	return URI.from({
		scheme: Schemas.vscodeTerminal,
		path: `/terminal${terminalId}.${languageExtension}`,
	});
}
