/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, getActiveElement, setVisibility } from '../../../../base/browser/dom.js';
import { ButtonWithDropdown } from '../../../../base/browser/ui/button/button.js';
import { renderIcon } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { toAction, WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../base/common/actions.js';
import { timeout } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { combinedDisposable, Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { equalsIgnoreCase } from '../../../../base/common/strings.js';
import { isObject } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { MarkdownRenderer } from '../../../../editor/browser/widget/markdownRenderer/browser/markdownRenderer.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ICustomDialogHTMLElement, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import product from '../../../../platform/product/common/product.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITelemetryService, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { defaultButtonStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IViewDescriptorService, ViewContainerLocation } from '../../../common/views.js';
import { IActivityService, ProgressBadge } from '../../../services/activity/common/activity.js';
import { AuthenticationSession, IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { ExtensionUrlHandlerOverrideRegistry } from '../../../services/extensions/browser/extensionUrlHandler.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IStatusbarService } from '../../../services/statusbar/browser/statusbar.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { ChatAgentLocation, IChatAgentImplementation, IChatAgentRequest, IChatAgentResult, IChatAgentService, IChatWelcomeMessageContent } from '../common/chatAgents.js';
import { ChatContextKeys } from '../common/chatContextKeys.js';
import { ChatEntitlement, ChatEntitlementService, ChatSetupContext, ChatSetupRequests, IChatEntitlementService } from '../common/chatEntitlementService.js';
import { IChatProgress, IChatProgressMessage, IChatWarningMessage } from '../common/chatService.js';
import { CHAT_CATEGORY, CHAT_SETUP_ACTION_ID } from './actions/chatActions.js';
import { ChatViewId, EditsViewId, ensureSideBarChatViewSize, preferCopilotEditsView, showCopilotView } from './chat.js';
import { CHAT_EDITING_SIDEBAR_PANEL_ID, CHAT_SIDEBAR_PANEL_ID } from './chatViewPane.js';
import './media/chatViewSetup.css';
import { ChatViewsWelcomeExtensions, IChatViewsWelcomeContributionRegistry } from './viewsWelcome/chatViewsWelcome.js';

const defaultChat = {
	extensionId: product.defaultChatAgent?.extensionId ?? '',
	chatExtensionId: product.defaultChatAgent?.chatExtensionId ?? '',
	documentationUrl: product.defaultChatAgent?.documentationUrl ?? '',
	termsStatementUrl: product.defaultChatAgent?.termsStatementUrl ?? '',
	privacyStatementUrl: product.defaultChatAgent?.privacyStatementUrl ?? '',
	skusDocumentationUrl: product.defaultChatAgent?.skusDocumentationUrl ?? '',
	publicCodeMatchesUrl: product.defaultChatAgent?.publicCodeMatchesUrl ?? '',
	upgradePlanUrl: product.defaultChatAgent?.upgradePlanUrl ?? '',
	providerName: product.defaultChatAgent?.providerName ?? '',
	enterpriseProviderId: product.defaultChatAgent?.enterpriseProviderId ?? '',
	enterpriseProviderName: product.defaultChatAgent?.enterpriseProviderName ?? '',
	providerUriSetting: product.defaultChatAgent?.providerUriSetting ?? '',
	providerScopes: product.defaultChatAgent?.providerScopes ?? [[]],
	manageSettingsUrl: product.defaultChatAgent?.manageSettingsUrl ?? '',
	completionsAdvancedSetting: product.defaultChatAgent?.completionsAdvancedSetting ?? '',
	walkthroughCommand: product.defaultChatAgent?.walkthroughCommand ?? '',
	completionsRefreshTokenCommand: product.defaultChatAgent?.completionsRefreshTokenCommand ?? '',
	chatRefreshTokenCommand: product.defaultChatAgent?.chatRefreshTokenCommand ?? '',
};

//#region Contribution

class SetupChatAgentImplementation implements IChatAgentImplementation {

	static register(instantiationService: IInstantiationService, location: ChatAgentLocation, context: ChatSetupContext, controller: Lazy<ChatSetupController>): IDisposable {
		return instantiationService.invokeFunction(accessor => {
			const chatAgentService = accessor.get(IChatAgentService);

			// TODO@bpasero: expand this to more cases (installed, not signed in / not signed up)
			const setupChatAgentContext = ContextKeyExpr.and(
				ChatContextKeys.Setup.hidden.negate(),
				ChatContextKeys.Setup.installed.negate(),
				ChatContextKeys.Setup.fromDialog
			);

			const id = location === ChatAgentLocation.Panel ? 'setup.chat' : 'setup.edits';

			const welcomeMessageContent: IChatWelcomeMessageContent = location === ChatAgentLocation.Panel ?
				{
					title: localize('chatTitle', "Ask Copilot"),
					message: new MarkdownString(localize('chatMessage', "Copilot is powered by AI, so mistakes are possible. Review output carefully before use.")),
					icon: Codicon.copilotLarge
				} :
				{
					title: localize('editsTitle', "Edit with Copilot"),
					message: new MarkdownString(localize('editsMessage', "Start your editing session by defining a set of files that you want to work with. Then ask Copilot for the changes you want to make.")),
					icon: Codicon.copilotLarge
				};

			return combinedDisposable(
				chatAgentService.registerAgent(id, {
					id,
					name: `${defaultChat.providerName} Copilot`,
					isDefault: true,
					when: setupChatAgentContext?.serialize(),
					slashCommands: [],
					disambiguation: [],
					locations: [location],
					metadata: {
						welcomeMessageContent
					},
					description: location === ChatAgentLocation.Panel ? localize('chatDescription', "Ask Copilot") : localize('editsDescription', "Edit files in your workspace"),
					extensionId: nullExtensionDescription.identifier,
					extensionDisplayName: nullExtensionDescription.name,
					extensionPublisherId: nullExtensionDescription.publisher
				}),
				chatAgentService.registerAgentImplementation(id, instantiationService.createInstance(SetupChatAgentImplementation, context, controller))
			);
		});
	}

	constructor(
		private readonly context: ChatSetupContext,
		private readonly controller: Lazy<ChatSetupController>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) { }

	async invoke(request: IChatAgentRequest, progress: (part: IChatProgress) => void): Promise<IChatAgentResult> {
		this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'chat' });

		const dialog = this.instantiationService.createInstance(ChatSetupDialog, this.context);
		const result = await dialog.show();

		// Proceed with setting up Copilot
		if (result) {
			const listener = this.controller.value.onDidChange(e => {
				switch (this.controller.value.step) {
					case ChatSetupStep.SigningIn:
						progress({
							kind: 'progressMessage',
							content: new MarkdownString(localize('setupChatSignIn2', "Signing in to {0}...", ChatSetupRequests.providerId(this.configurationService) === defaultChat.enterpriseProviderId ? defaultChat.enterpriseProviderName : defaultChat.providerName)),
						} satisfies IChatProgressMessage);
						break;
					case ChatSetupStep.Installing:
						progress({
							kind: 'progressMessage',
							content: new MarkdownString(localize('installingCopilot', "Getting Copilot Ready...")),
						} satisfies IChatProgressMessage);
						break;
				}
			});

			let success = false;
			try {
				success = await this.controller.value.setup();
			} catch (error) {
				this.logService.error(localize('setupError', "Error during setup: {0}", toErrorMessage(error)));
			} finally {
				listener.dispose();
			}

			if (success) {
				progress({
					kind: 'progressMessage',
					content: new MarkdownString(localize('copilotReady', "Copilot is ready to use.")),
				} satisfies IChatProgressMessage);
			}
			else {
				progress({
					kind: 'warning',
					content: new MarkdownString(localize('copilotSetupError', "Copilot setup failed. [Try again]({0} \"Retry\").", `command:${CHAT_SETUP_ACTION_ID}`), { isTrusted: true }),
				} satisfies IChatWarningMessage);
			}
		}

		// User has cancelled the setup
		else {
			progress({
				kind: 'warning',
				content: new MarkdownString(localize('settingUpCopilotWarning', "You need to [set up Copilot]({0} \"Set up Copilot\") to use Chat.", `command:${CHAT_SETUP_ACTION_ID}`), { isTrusted: true }),
			} satisfies IChatWarningMessage);
		}

		return {};
	}
}

class ChatSetupDialog {

	constructor(
		private readonly context: ChatSetupContext,
		@IDialogService private readonly dialogService: IDialogService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) { }

	async show(): Promise<boolean> {
		const res = await this.dialogService.prompt<boolean>({
			type: 'none',
			message: localize('copilotFree', "Use AI Features with Copilot for Free"),
			cancelButton: {
				label: localize('cancel', "Cancel"),
				run: () => false
			},
			buttons: [
				{
					label: this.getPrimaryButton(),
					run: () => true
				},
			],
			custom: {
				icon: Codicon.copilotLarge,
				htmlDetails: [this.create()]
			}
		});

		return res.result;
	}

	private getPrimaryButton(): string {
		switch (this.context.state.entitlement) {
			case ChatEntitlement.Unknown:
				return this.context.state.registered ? localize('signUp', "Sign in to Use Copilot") : localize('signUpFree', "Sign in to Use Copilot for Free");
			case ChatEntitlement.Unresolved:
				return this.context.state.registered ? localize('startUp', "Use Copilot") : localize('startUpLimited', "Use Copilot for Free");
			case ChatEntitlement.Available:
			case ChatEntitlement.Limited:
				return localize('startUpLimited', "Use Copilot for Free");
			case ChatEntitlement.Pro:
			case ChatEntitlement.Unavailable:
				return localize('startUp', "Use Copilot");
		}
	}

	private create(): ICustomDialogHTMLElement {
		const disposables = new DisposableStore();
		const element = $('.chat-setup-view');

		const markdown = this.instantiationService.createInstance(MarkdownRenderer, {});

		// Header
		const header = localize({ key: 'header', comment: ['{Locked="[Copilot]({0})"}'] }, "[Copilot]({0}) is your AI pair programmer.", defaultChat.documentationUrl);
		element.appendChild($('p', undefined, disposables.add(markdown.render(new MarkdownString(header, { isTrusted: true }))).element));
		element.appendChild(
			$('div.chat-features-container', undefined,
				$('div', undefined,
					$('div.chat-feature-container', undefined,
						renderIcon(Codicon.code),
						$('span', undefined, localize('featureChat', "Code faster with Completions"))
					),
					$('div.chat-feature-container', undefined,
						renderIcon(Codicon.editSession),
						$('span', undefined, localize('featureEdits', "Build features with Copilot Edits"))
					),
					$('div.chat-feature-container', undefined,
						renderIcon(Codicon.commentDiscussion),
						$('span', undefined, localize('featureExplore', "Explore your codebase with Chat"))
					)
				)
			)
		);

		// Terms
		const terms = localize({ key: 'terms', comment: ['{Locked="["}', '{Locked="]({0})"}', '{Locked="]({1})"}'] }, "By continuing, you agree to the [Terms]({0}) and [Privacy Policy]({1}).", defaultChat.termsStatementUrl, defaultChat.privacyStatementUrl);
		element.appendChild($('p.legal', undefined, disposables.add(markdown.render(new MarkdownString(terms, { isTrusted: true }))).element));

		// SKU Settings
		if (this.telemetryService.telemetryLevel !== TelemetryLevel.NONE) {
			const settings = localize({ key: 'settings', comment: ['{Locked="["}', '{Locked="]({0})"}', '{Locked="]({1})"}'] }, "Copilot Free and Pro may show [public code]({0}) suggestions and we may use your data for product improvement. You can change these [settings]({1}) at any time.", defaultChat.publicCodeMatchesUrl, defaultChat.manageSettingsUrl);
			element.appendChild($('p.legal', undefined, disposables.add(markdown.render(new MarkdownString(settings, { isTrusted: true }))).element));
		}

		return { element, dispose: () => disposables.dispose() };
	}
}

export class ChatSetupContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.chat.setup';

	constructor(
		@IProductService private readonly productService: IProductService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ICommandService private readonly commandService: ICommandService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IChatEntitlementService chatEntitlementService: ChatEntitlementService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		const context = chatEntitlementService.context?.value;
		const requests = chatEntitlementService.requests?.value;
		if (!context || !requests) {
			return; // disabled
		}

		const controller = new Lazy(() => this._register(this.instantiationService.createInstance(ChatSetupController, context, requests)));

		this.registerSetupAgents(context, controller);
		this.registerChatWelcome(context, controller);
		this.registerActions(context, requests, controller);
		this.registerUrlLinkHandler();
	}

	private registerSetupAgents(context: ChatSetupContext, controller: Lazy<ChatSetupController>): void {
		const registration = this._register(new MutableDisposable());

		const updateRegistration = () => {
			const disabled = context.state.installed || context.state.hidden || !this.configurationService.getValue('chat.experimental.setupFromDialog');
			if (!disabled && !registration.value) {
				registration.value = combinedDisposable(
					SetupChatAgentImplementation.register(this.instantiationService, ChatAgentLocation.Panel, context, controller),
					SetupChatAgentImplementation.register(this.instantiationService, ChatAgentLocation.EditingSession, context, controller)
				);
			} else if (disabled && registration.value) {
				registration.clear();
			}
		};

		this._register(Event.runAndSubscribe(Event.any(
			context.onDidChange,
			Event.filter(this.configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('chat.experimental.setupFromDialog'))
		), () => updateRegistration()));
	}

	private registerChatWelcome(context: ChatSetupContext, controller: Lazy<ChatSetupController>): void {
		Registry.as<IChatViewsWelcomeContributionRegistry>(ChatViewsWelcomeExtensions.ChatViewsWelcomeRegistry).register({
			title: localize('welcomeChat', "Welcome to Copilot"),
			when: ChatContextKeys.SetupViewCondition,
			icon: Codicon.copilotLarge,
			content: disposables => disposables.add(this.instantiationService.createInstance(ChatSetupWelcomeContent, controller.value, context)).element,
		});
	}

	private registerActions(context: ChatSetupContext, requests: ChatSetupRequests, controller: Lazy<ChatSetupController>): void {
		const chatSetupTriggerContext = ContextKeyExpr.or(
			ChatContextKeys.Setup.installed.negate(),
			ChatContextKeys.Setup.canSignUp
		);

		const CHAT_SETUP_ACTION_LABEL = localize2('triggerChatSetup', "Use AI Features with Copilot for Free...");

		class ChatSetupTriggerAction extends Action2 {

			constructor() {
				super({
					id: CHAT_SETUP_ACTION_ID,
					title: CHAT_SETUP_ACTION_LABEL,
					category: CHAT_CATEGORY,
					f1: true,
					precondition: chatSetupTriggerContext,
					menu: {
						id: MenuId.ChatTitleBarMenu,
						group: 'a_last',
						order: 1,
						when: chatSetupTriggerContext
					}
				});
			}

			override async run(accessor: ServicesAccessor): Promise<void> {
				const viewsService = accessor.get(IViewsService);
				const viewDescriptorService = accessor.get(IViewDescriptorService);
				const configurationService = accessor.get(IConfigurationService);
				const layoutService = accessor.get(IWorkbenchLayoutService);
				const statusbarService = accessor.get(IStatusbarService);
				const instantiationService = accessor.get(IInstantiationService);
				const logService = accessor.get(ILogService);
				const dialogService = accessor.get(IDialogService);
				const commandService = accessor.get(ICommandService);

				await context.update({ hidden: false });

				const setupFromDialog = configurationService.getValue('chat.experimental.setupFromDialog');
				if (!setupFromDialog) {
					showCopilotView(viewsService, layoutService);
					ensureSideBarChatViewSize(viewDescriptorService, layoutService, viewsService);
				}

				statusbarService.updateEntryVisibility('chat.statusBarEntry', true);
				configurationService.updateValue('chat.commandCenter.enabled', true);

				if (setupFromDialog) {
					const dialog = instantiationService.createInstance(ChatSetupDialog, context);
					const result = await dialog.show();
					if (result) {
						let success = false;
						try {
							success = await controller.value.setup({ notificationProgress: true });

							if (success) {
								showCopilotView(viewsService, layoutService);
							}
						} catch (error) {
							logService.error(localize('setupError', "Error during setup: {0}", toErrorMessage(error)));
						}

						if (!success) {
							const { confirmed } = await dialogService.confirm({
								type: Severity.Error,
								message: localize('setupErrorDialog', "Copilot setup failed. Would you like to try again?"),
								primaryButton: localize('retry', "Retry"),
							});

							if (confirmed) {
								commandService.executeCommand(CHAT_SETUP_ACTION_ID);
							}
						}
					}
				}
			}
		}

		class ChatSetupHideAction extends Action2 {

			static readonly ID = 'workbench.action.chat.hideSetup';
			static readonly TITLE = localize2('hideChatSetup', "Hide Copilot");

			constructor() {
				super({
					id: ChatSetupHideAction.ID,
					title: ChatSetupHideAction.TITLE,
					f1: true,
					category: CHAT_CATEGORY,
					precondition: ContextKeyExpr.and(ChatContextKeys.Setup.installed.negate(), ChatContextKeys.Setup.hidden.negate()),
					menu: {
						id: MenuId.ChatTitleBarMenu,
						group: 'z_hide',
						order: 1,
						when: ChatContextKeys.Setup.installed.negate()
					}
				});
			}

			override async run(accessor: ServicesAccessor): Promise<void> {
				const viewsDescriptorService = accessor.get(IViewDescriptorService);
				const layoutService = accessor.get(IWorkbenchLayoutService);
				const configurationService = accessor.get(IConfigurationService);
				const dialogService = accessor.get(IDialogService);
				const statusbarService = accessor.get(IStatusbarService);

				const { confirmed } = await dialogService.confirm({
					message: localize('hideChatSetupConfirm', "Are you sure you want to hide Copilot?"),
					detail: localize('hideChatSetupDetail', "You can restore Copilot by running the '{0}' command.", CHAT_SETUP_ACTION_LABEL.value),
					primaryButton: localize('hideChatSetupButton', "Hide Copilot")
				});

				if (!confirmed) {
					return;
				}

				const location = viewsDescriptorService.getViewLocationById(ChatViewId);

				await context.update({ hidden: true });

				if (location === ViewContainerLocation.AuxiliaryBar) {
					const activeContainers = viewsDescriptorService.getViewContainersByLocation(location).filter(container => viewsDescriptorService.getViewContainerModel(container).activeViewDescriptors.length > 0);
					if (activeContainers.length === 0) {
						layoutService.setPartHidden(true, Parts.AUXILIARYBAR_PART); // hide if there are no views in the secondary sidebar
					}
				}

				statusbarService.updateEntryVisibility('chat.statusBarEntry', false);
				configurationService.updateValue('chat.commandCenter.enabled', false);
			}
		}

		const windowFocusListener = this._register(new MutableDisposable());
		class UpgradePlanAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.chat.upgradePlan',
					title: localize2('managePlan', "Upgrade to Copilot Pro"),
					category: localize2('chat.category', 'Chat'),
					f1: true,
					precondition: ContextKeyExpr.or(
						ChatContextKeys.Setup.canSignUp,
						ChatContextKeys.Setup.limited,
					),
					menu: {
						id: MenuId.ChatTitleBarMenu,
						group: 'a_first',
						order: 1,
						when: ContextKeyExpr.or(
							ChatContextKeys.chatQuotaExceeded,
							ChatContextKeys.completionsQuotaExceeded
						)
					}
				});
			}

			override async run(accessor: ServicesAccessor, from?: string): Promise<void> {
				const openerService = accessor.get(IOpenerService);
				const telemetryService = accessor.get(ITelemetryService);
				const hostService = accessor.get(IHostService);
				const commandService = accessor.get(ICommandService);

				telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: this.desc.id, from: from ?? 'chat' });

				openerService.open(URI.parse(defaultChat.upgradePlanUrl));

				const entitlement = context.state.entitlement;
				if (entitlement !== ChatEntitlement.Pro) {
					// If the user is not yet Pro, we listen to window focus to refresh the token
					// when the user has come back to the window assuming the user signed up.
					windowFocusListener.value = hostService.onDidChangeFocus(focus => this.onWindowFocus(focus, commandService));
				}
			}

			private async onWindowFocus(focus: boolean, commandService: ICommandService): Promise<void> {
				if (focus) {
					windowFocusListener.clear();

					const entitlements = await requests.forceResolveEntitlement(undefined);
					if (entitlements?.entitlement === ChatEntitlement.Pro) {
						refreshTokens(commandService);
					}
				}
			}
		}

		registerAction2(ChatSetupTriggerAction);
		registerAction2(ChatSetupHideAction);
		registerAction2(UpgradePlanAction);
	}

	private registerUrlLinkHandler(): void {
		this._register(ExtensionUrlHandlerOverrideRegistry.registerHandler({
			canHandleURL: url => {
				return url.scheme === this.productService.urlProtocol && equalsIgnoreCase(url.authority, defaultChat.chatExtensionId);
			},
			handleURL: async url => {
				const params = new URLSearchParams(url.query);
				this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: CHAT_SETUP_ACTION_ID, from: 'url', detail: params.get('referrer') ?? undefined });

				await this.commandService.executeCommand(CHAT_SETUP_ACTION_ID);

				return true;
			}
		}));
	}
}

//#endregion

//#region Setup Rendering

type InstallChatClassification = {
	owner: 'bpasero';
	comment: 'Provides insight into chat installation.';
	installResult: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the extension was installed successfully, cancelled or failed to install.' };
	installDuration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The duration it took to install the extension.' };
	signUpErrorCode: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The error code in case of an error signing up.' };
	setupFromDialog: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether the setup was triggered from the dialog or not.' };
};
type InstallChatEvent = {
	installResult: 'installed' | 'cancelled' | 'failedInstall' | 'failedNotSignedIn' | 'failedSignUp' | 'failedNotTrusted' | 'failedNoSession';
	installDuration: number;
	signUpErrorCode: number | undefined;
	setupFromDialog: boolean;
};

enum ChatSetupStep {
	Initial = 1,
	SigningIn,
	Installing
}

class ChatSetupController extends Disposable {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private _step = ChatSetupStep.Initial;
	get step(): ChatSetupStep { return this._step; }

	private willShutdown = false;

	constructor(
		private readonly context: ChatSetupContext,
		private readonly requests: ChatSetupRequests,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IViewsService private readonly viewsService: IViewsService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IProductService private readonly productService: IProductService,
		@ILogService private readonly logService: ILogService,
		@IProgressService private readonly progressService: IProgressService,
		@IChatAgentService private readonly chatAgentService: IChatAgentService,
		@IActivityService private readonly activityService: IActivityService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IDialogService private readonly dialogService: IDialogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.context.onDidChange(() => this._onDidChange.fire()));
		this._register(this.lifecycleService.onWillShutdown(() => this.willShutdown = true));
	}

	private setStep(step: ChatSetupStep): void {
		if (this._step === step) {
			return;
		}

		this._step = step;
		this._onDidChange.fire();
	}

	async setup(options?: { forceSignIn?: boolean; notificationProgress?: boolean }): Promise<boolean> {
		const watch = new StopWatch(false);
		const title = localize('setupChatProgress', "Getting Copilot ready...");
		const badge = this.activityService.showViewContainerActivity(preferCopilotEditsView(this.viewsService) ? CHAT_EDITING_SIDEBAR_PANEL_ID : CHAT_SIDEBAR_PANEL_ID, {
			badge: new ProgressBadge(() => title),
		});

		try {
			return await this.progressService.withProgress({
				location: options?.notificationProgress ? ProgressLocation.Notification : ProgressLocation.Window,
				command: CHAT_SETUP_ACTION_ID,
				title,
			}, () => this.doSetup(options?.forceSignIn ?? false, watch));
		} finally {
			badge.dispose();
		}
	}

	private async doSetup(forceSignIn: boolean, watch: StopWatch): Promise<boolean> {
		this.context.suspend();  // reduces flicker

		let focusChatInput = false;
		let success = false;
		try {
			const setupFromDialog = Boolean(this.configurationService.getValue('chat.experimental.setupFromDialog'));
			const providerId = ChatSetupRequests.providerId(this.configurationService);
			let session: AuthenticationSession | undefined;
			let entitlement: ChatEntitlement | undefined;

			// Entitlement Unknown or `forceSignIn`: we need to sign-in user
			if (this.context.state.entitlement === ChatEntitlement.Unknown || forceSignIn) {
				this.setStep(ChatSetupStep.SigningIn);
				const result = await this.signIn(providerId);
				if (!result.session) {
					this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedNotSignedIn', installDuration: watch.elapsed(), signUpErrorCode: undefined, setupFromDialog });
					return false;
				}

				session = result.session;
				entitlement = result.entitlement;
			}

			const trusted = await this.workspaceTrustRequestService.requestWorkspaceTrust({
				message: localize('copilotWorkspaceTrust', "Copilot is currently only supported in trusted workspaces.")
			});
			if (!trusted) {
				this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedNotTrusted', installDuration: watch.elapsed(), signUpErrorCode: undefined, setupFromDialog });
				return false;
			}

			const activeElement = getActiveElement();

			// Install
			this.setStep(ChatSetupStep.Installing);
			success = await this.install(session, entitlement ?? this.context.state.entitlement, providerId, watch);

			const currentActiveElement = getActiveElement();
			focusChatInput = activeElement === currentActiveElement || currentActiveElement === mainWindow.document.body;
		} finally {
			this.setStep(ChatSetupStep.Initial);
			this.context.resume();
		}

		if (focusChatInput) {
			(await showCopilotView(this.viewsService, this.layoutService))?.focusInput();
		}

		return success;
	}

	private async signIn(providerId: string): Promise<{ session: AuthenticationSession | undefined; entitlement: ChatEntitlement | undefined }> {
		let session: AuthenticationSession | undefined;
		let entitlements;
		try {
			showCopilotView(this.viewsService, this.layoutService);

			({ session, entitlements } = await this.requests.signIn());
		} catch (e) {
			this.logService.error(`[chat setup] signIn: error ${e}`);
		}

		if (!session && !this.willShutdown) {
			const { confirmed } = await this.dialogService.confirm({
				type: Severity.Error,
				message: localize('unknownSignInError', "Failed to sign in to {0}. Would you like to try again?", ChatSetupRequests.providerId(this.configurationService) === defaultChat.enterpriseProviderId ? defaultChat.enterpriseProviderName : defaultChat.providerName),
				detail: localize('unknownSignInErrorDetail', "You must be signed in to use Copilot."),
				primaryButton: localize('retry', "Retry")
			});

			if (confirmed) {
				return this.signIn(providerId);
			}
		}

		return { session, entitlement: entitlements?.entitlement };
	}

	private async install(session: AuthenticationSession | undefined, entitlement: ChatEntitlement, providerId: string, watch: StopWatch,): Promise<boolean> {
		const wasInstalled = this.context.state.installed;
		let signUpResult: boolean | { errorCode: number } | undefined = undefined;
		const setupFromDialog = Boolean(this.configurationService.getValue('chat.experimental.setupFromDialog'));

		try {
			showCopilotView(this.viewsService, this.layoutService);

			if (
				entitlement !== ChatEntitlement.Limited &&	// User is not signed up to Copilot Free
				entitlement !== ChatEntitlement.Pro &&		// User is not signed up to Copilot Pro
				entitlement !== ChatEntitlement.Unavailable	// User is eligible for Copilot Free
			) {
				if (!session) {
					try {
						session = (await this.authenticationService.getSessions(providerId)).at(0);
					} catch (error) {
						// ignore - errors can throw if a provider is not registered
					}

					if (!session) {
						this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedNoSession', installDuration: watch.elapsed(), signUpErrorCode: undefined, setupFromDialog });
						return false; // unexpected
					}
				}

				signUpResult = await this.requests.signUpLimited(session);

				if (typeof signUpResult !== 'boolean' /* error */) {
					this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'failedSignUp', installDuration: watch.elapsed(), signUpErrorCode: signUpResult.errorCode, setupFromDialog });
				}
			}

			await this.doInstall();
		} catch (error) {
			this.logService.error(`[chat setup] install: error ${error}`);
			this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: isCancellationError(error) ? 'cancelled' : 'failedInstall', installDuration: watch.elapsed(), signUpErrorCode: undefined, setupFromDialog });
			return false;
		}

		this.telemetryService.publicLog2<InstallChatEvent, InstallChatClassification>('commandCenter.chatInstall', { installResult: 'installed', installDuration: watch.elapsed(), signUpErrorCode: undefined, setupFromDialog });

		if (wasInstalled && signUpResult === true) {
			refreshTokens(this.commandService);
		}

		await Promise.race([
			timeout(5000), 												// helps prevent flicker with sign-in welcome view
			Event.toPromise(this.chatAgentService.onDidChangeAgents)	// https://github.com/microsoft/vscode-copilot/issues/9274
		]);

		return true;
	}

	private async doInstall(): Promise<void> {
		let error: Error | undefined;
		try {
			await this.extensionsWorkbenchService.install(defaultChat.extensionId, {
				enable: true,
				isApplicationScoped: true, 	// install into all profiles
				isMachineScoped: false,		// do not ask to sync
				installEverywhere: true,	// install in local and remote
				installPreReleaseVersion: this.productService.quality !== 'stable'
			}, preferCopilotEditsView(this.viewsService) ? EditsViewId : ChatViewId);
		} catch (e) {
			this.logService.error(`[chat setup] install: error ${error}`);
			error = e;
		}

		if (error) {
			if (!this.willShutdown) {
				const { confirmed } = await this.dialogService.confirm({
					type: Severity.Error,
					message: localize('unknownSetupError', "An error occurred while setting up Copilot. Would you like to try again?"),
					detail: error && !isCancellationError(error) ? toErrorMessage(error) : undefined,
					primaryButton: localize('retry', "Retry")
				});

				if (confirmed) {
					return this.doInstall();
				}
			}

			throw error;
		}
	}
}

class ChatSetupWelcomeContent extends Disposable {

	readonly element = $('.chat-setup-view');

	constructor(
		private readonly controller: ChatSetupController,
		private readonly context: ChatSetupContext,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IDialogService private readonly dialogService: IDialogService,
	) {
		super();

		this.create();
	}

	private create(): void {
		const markdown = this.instantiationService.createInstance(MarkdownRenderer, {});

		// Header
		{
			const header = localize({ key: 'header', comment: ['{Locked="[Copilot]({0})"}'] }, "[Copilot]({0}) is your AI pair programmer.", this.context.state.installed ? `command:${defaultChat.walkthroughCommand}` : defaultChat.documentationUrl);
			this.element.appendChild($('p', undefined, this._register(markdown.render(new MarkdownString(header, { isTrusted: true }))).element));

			this.element.appendChild(
				$('div.chat-features-container', undefined,
					$('div', undefined,
						$('div.chat-feature-container', undefined,
							renderIcon(Codicon.code),
							$('span', undefined, localize('featureChat', "Code faster with Completions"))
						),
						$('div.chat-feature-container', undefined,
							renderIcon(Codicon.editSession),
							$('span', undefined, localize('featureEdits', "Build features with Copilot Edits"))
						),
						$('div.chat-feature-container', undefined,
							renderIcon(Codicon.commentDiscussion),
							$('span', undefined, localize('featureExplore', "Explore your codebase with Chat"))
						)
					)
				)
			);
		}

		// Limited SKU
		const free = localize({ key: 'free', comment: ['{Locked="[]({0})"}'] }, "$(sparkle-filled) We now offer [Copilot for free]({0}).", defaultChat.skusDocumentationUrl);
		const freeContainer = this.element.appendChild($('p', undefined, this._register(markdown.render(new MarkdownString(free, { isTrusted: true, supportThemeIcons: true }))).element));

		// Setup Button
		const buttonContainer = this.element.appendChild($('p'));
		buttonContainer.classList.add('button-container');
		const button = this._register(new ButtonWithDropdown(buttonContainer, {
			actions: [
				toAction({ id: 'chatSetup.setupWithProvider', label: localize('setupWithProvider', "Sign in with a {0} Account", defaultChat.providerName), run: () => this.setupWithProvider(false) }),
				toAction({ id: 'chatSetup.setupWithEnterpriseProvider', label: localize('setupWithEnterpriseProvider', "Sign in with a {0} Account", defaultChat.enterpriseProviderName), run: () => this.setupWithProvider(true) })
			],
			addPrimaryActionToDropdown: false,
			contextMenuProvider: this.contextMenuService,
			supportIcons: true,
			...defaultButtonStyles
		}));
		this._register(button.onDidClick(() => this.controller.setup()));

		// Terms
		const terms = localize({ key: 'terms', comment: ['{Locked="["}', '{Locked="]({0})"}', '{Locked="]({1})"}'] }, "By continuing, you agree to the [Terms]({0}) and [Privacy Policy]({1}).", defaultChat.termsStatementUrl, defaultChat.privacyStatementUrl);
		this.element.appendChild($('p', undefined, this._register(markdown.render(new MarkdownString(terms, { isTrusted: true }))).element));

		// SKU Settings
		const settings = localize({ key: 'settings', comment: ['{Locked="["}', '{Locked="]({0})"}', '{Locked="]({1})"}'] }, "Copilot Free and Pro may show [public code]({0}) suggestions and we may use your data for product improvement. You can change these [settings]({1}) at any time.", defaultChat.publicCodeMatchesUrl, defaultChat.manageSettingsUrl);
		const settingsContainer = this.element.appendChild($('p', undefined, this._register(markdown.render(new MarkdownString(settings, { isTrusted: true }))).element));

		// Update based on model state
		this._register(Event.runAndSubscribe(this.controller.onDidChange, () => this.update(freeContainer, settingsContainer, button)));
	}

	private update(freeContainer: HTMLElement, settingsContainer: HTMLElement, button: ButtonWithDropdown): void {
		const showSettings = this.telemetryService.telemetryLevel !== TelemetryLevel.NONE;
		let showFree: boolean;
		let buttonLabel: string;

		switch (this.context.state.entitlement) {
			case ChatEntitlement.Unknown:
				showFree = true;
				buttonLabel = this.context.state.registered ? localize('signUp', "Sign in to Use Copilot") : localize('signUpFree', "Sign in to Use Copilot for Free");
				break;
			case ChatEntitlement.Unresolved:
				showFree = true;
				buttonLabel = this.context.state.registered ? localize('startUp', "Use Copilot") : localize('startUpLimited', "Use Copilot for Free");
				break;
			case ChatEntitlement.Available:
			case ChatEntitlement.Limited:
				showFree = true;
				buttonLabel = localize('startUpLimited', "Use Copilot for Free");
				break;
			case ChatEntitlement.Pro:
			case ChatEntitlement.Unavailable:
				showFree = false;
				buttonLabel = localize('startUp', "Use Copilot");
				break;
		}

		switch (this.controller.step) {
			case ChatSetupStep.SigningIn:
				buttonLabel = localize('setupChatSignIn', "$(loading~spin) Signing in to {0}...", ChatSetupRequests.providerId(this.configurationService) === defaultChat.enterpriseProviderId ? defaultChat.enterpriseProviderName : defaultChat.providerName);
				break;
			case ChatSetupStep.Installing:
				buttonLabel = localize('setupChatInstalling', "$(loading~spin) Getting Copilot Ready...");
				break;
		}

		setVisibility(showFree, freeContainer);
		setVisibility(showSettings, settingsContainer);

		button.label = buttonLabel;
		button.enabled = this.controller.step === ChatSetupStep.Initial;
	}

	private async setupWithProvider(useEnterpriseProvider: boolean): Promise<boolean> {
		const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		registry.registerConfiguration({
			'id': 'copilot.setup',
			'type': 'object',
			'properties': {
				[defaultChat.completionsAdvancedSetting]: {
					'type': 'object',
					'properties': {
						'authProvider': {
							'type': 'string'
						}
					}
				},
				[defaultChat.providerUriSetting]: {
					'type': 'string'
				}
			}
		});

		if (useEnterpriseProvider) {
			const success = await this.handleEnterpriseInstance();
			if (!success) {
				return false; // not properly configured, abort
			}
		}

		let existingAdvancedSetting = this.configurationService.inspect(defaultChat.completionsAdvancedSetting).user?.value;
		if (!isObject(existingAdvancedSetting)) {
			existingAdvancedSetting = {};
		}

		if (useEnterpriseProvider) {
			await this.configurationService.updateValue(`${defaultChat.completionsAdvancedSetting}`, {
				...existingAdvancedSetting,
				'authProvider': defaultChat.enterpriseProviderId
			}, ConfigurationTarget.USER);
		} else {
			await this.configurationService.updateValue(`${defaultChat.completionsAdvancedSetting}`, Object.keys(existingAdvancedSetting).length > 0 ? {
				...existingAdvancedSetting,
				'authProvider': undefined
			} : undefined, ConfigurationTarget.USER);
			await this.configurationService.updateValue(defaultChat.providerUriSetting, undefined, ConfigurationTarget.USER);
		}

		return this.controller.setup({ forceSignIn: true });
	}

	private async handleEnterpriseInstance(): Promise<boolean /* success */> {
		const domainRegEx = /^[a-zA-Z\-_]+$/;
		const fullUriRegEx = /^(https:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.ghe\.com\/?$/;

		const uri = this.configurationService.getValue<string>(defaultChat.providerUriSetting);
		if (typeof uri === 'string' && fullUriRegEx.test(uri)) {
			return true; // already setup with a valid URI
		}

		let isSingleWord = false;
		const result = await this.quickInputService.input({
			prompt: localize('enterpriseInstance', "What is your {0} instance?", defaultChat.enterpriseProviderName),
			placeHolder: localize('enterpriseInstancePlaceholder', 'i.e. "octocat" or "https://octocat.ghe.com"...'),
			value: uri,
			validateInput: async value => {
				isSingleWord = false;
				if (!value) {
					return undefined;
				}

				if (domainRegEx.test(value)) {
					isSingleWord = true;
					return {
						content: localize('willResolveTo', "Will resolve to {0}", `https://${value}.ghe.com`),
						severity: Severity.Info
					};
				} if (!fullUriRegEx.test(value)) {
					return {
						content: localize('invalidEnterpriseInstance', 'Please enter a valid {0} instance (i.e. "octocat" or "https://octocat.ghe.com")', defaultChat.enterpriseProviderName),
						severity: Severity.Error
					};
				}

				return undefined;
			}
		});

		if (!result) {
			const { confirmed } = await this.dialogService.confirm({
				type: Severity.Error,
				message: localize('enterpriseSetupError', "The provided {0} instance is invalid. Would you like to enter it again?", defaultChat.enterpriseProviderName),
				primaryButton: localize('retry', "Retry")
			});

			if (confirmed) {
				return this.handleEnterpriseInstance();
			}

			return false;
		}

		let resolvedUri = result;
		if (isSingleWord) {
			resolvedUri = `https://${resolvedUri}.ghe.com`;
		} else {
			const normalizedUri = result.toLowerCase();
			const hasHttps = normalizedUri.startsWith('https://');
			if (!hasHttps) {
				resolvedUri = `https://${result}`;
			}
		}

		await this.configurationService.updateValue(defaultChat.providerUriSetting, resolvedUri, ConfigurationTarget.USER);

		return true;
	}
}

//#endregion

function refreshTokens(commandService: ICommandService): void {
	// ugly, but we need to signal to the extension that entitlements changed
	commandService.executeCommand(defaultChat.completionsRefreshTokenCommand);
	commandService.executeCommand(defaultChat.chatRefreshTokenCommand);
}
