/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { renderLabelWithIcons } from '../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IAction } from '../../../../../base/common/actions.js';
import { Event } from '../../../../../base/common/event.js';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { ActionWidgetDropdownActionViewItem } from '../../../../../platform/actions/browser/actionWidgetDropdownActionViewItem.js';
import { MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { IActionWidgetService } from '../../../../../platform/actionWidget/browser/actionWidget.js';
import { IActionWidgetDropdownActionProvider, IActionWidgetDropdownOptions } from '../../../../../platform/actionWidget/browser/actionWidgetDropdown.js';
import { IChatAgentService } from '../../common/chatAgents.js';
import { ChatMode } from '../../common/constants.js';
import { IToggleChatModeArgs } from '../actions/chatExecuteActions.js';

export interface IModePickerDelegate {
	onDidChangeMode: Event<void>;
	getMode(): ChatMode;
}

export class ModePickerActionItem extends ActionWidgetDropdownActionViewItem {
	constructor(
		action: MenuItemAction,
		private readonly delegate: IModePickerDelegate,
		@IActionWidgetService actionWidgetService: IActionWidgetService,
		@IChatAgentService chatAgentService: IChatAgentService,
	) {
		const makeAction = (mode: ChatMode): IAction => ({
			...action,
			id: mode,
			label: this.modeToString(mode),
			class: undefined,
			enabled: true,
			checked: delegate.getMode() === mode,
			run: async () => {
				const result = await action.run({ mode } satisfies IToggleChatModeArgs);
				this.renderLabel(this.element!);
				return result;
			}
		});

		const actionProvider: IActionWidgetDropdownActionProvider = {
			getActions: () => {
				const agentStateActions = [
					makeAction(ChatMode.Edit),
				];
				if (chatAgentService.hasToolsAgent) {
					agentStateActions.push(makeAction(ChatMode.Agent));
				}

				agentStateActions.unshift(makeAction(ChatMode.Ask));
				return agentStateActions;
			}
		};

		const modelPickerActionWidgetOptions: Omit<IActionWidgetDropdownOptions, 'label' | 'labelRenderer'> = {
			actionProvider,
		};

		super(action, modelPickerActionWidgetOptions, actionWidgetService);

		this._register(delegate.onDidChangeMode(() => this.renderLabel(this.element!)));
	}

	private modeToString(mode: ChatMode) {
		switch (mode) {
			case ChatMode.Agent:
				return localize('chat.agentMode', "Agent");
			case ChatMode.Edit:
				return localize('chat.normalMode', "Edit");
			case ChatMode.Ask:
			default:
				return localize('chat.askMode', "Ask");
		}
	}

	protected override renderLabel(element: HTMLElement): IDisposable | null {
		this.setAriaLabelAttributes(element);
		const state = this.modeToString(this.delegate.getMode());
		dom.reset(element, dom.$('span.chat-model-label', undefined, state), ...renderLabelWithIcons(`$(chevron-down)`));
		return null;
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('chat-modelPicker-item');
	}
}
