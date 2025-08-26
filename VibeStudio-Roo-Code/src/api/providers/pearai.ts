import * as vscode from "vscode"
import { ApiHandlerOptions, VIBESTUDIO_URL, ModelInfo } from "../../shared/api"
import { AnthropicHandler } from "./anthropic"
import { DeepSeekHandler } from "./deepseek"
import Anthropic from "@anthropic-ai/sdk"
import { BaseProvider } from "./base-provider"
import { SingleCompletionHandler } from "../"

interface VibeStudioModelsResponse {
	models: {
		[key: string]: {
			underlyingModel?: string
			[key: string]: any
		}
	}
	defaultModelId: string
}

export class VibeStudioHandler extends BaseProvider implements SingleCompletionHandler {
	private handler!: AnthropicHandler | DeepSeekHandler

	constructor(options: ApiHandlerOptions) {
		super()
		if (!options.vibestudioApiKey) {
			vscode.window.showErrorMessage("VibeStudio API key not found.", "Login to VibeStudio").then(async (selection) => {
				if (selection === "Login to VibeStudio") {
					const extensionUrl = `${vscode.env.uriScheme}://vibestudio.vibestudio/auth`
					const callbackUri = await vscode.env.asExternalUri(vscode.Uri.parse(extensionUrl))
					vscode.env.openExternal(
						await vscode.env.asExternalUri(
							vscode.Uri.parse(`https://vibestudio.online/signin?callback=${callbackUri.toString()}`),
						),
					)
				}
			})
			throw new Error("VibeStudio API key not found. Please login to VibeStudio.")
		}

		// Initialize with a default handler synchronously
		this.handler = new AnthropicHandler({
			...options,
			apiKey: options.vibestudioApiKey,
			anthropicBaseUrl: VIBESTUDIO_URL,
			apiModelId: "claude-3-5-sonnet-20241022",
		})

		// Then try to initialize the correct handler asynchronously
		this.initializeHandler(options).catch((error) => {
			console.error("Failed to initialize VibeStudio handler:", error)
		})
	}

	private async initializeHandler(options: ApiHandlerOptions): Promise<void> {
		const modelId = options.apiModelId || "vibestudio-model"

		if (modelId === "vibestudio-model") {
			try {
				const response = await fetch(`${VIBESTUDIO_URL}/getVibeStudioAgentModels`)
				if (!response.ok) {
					throw new Error(`Failed to fetch models: ${response.statusText}`)
				}
				const data = (await response.json()) as VibeStudioModelsResponse
				const underlyingModel = data.models[modelId]?.underlyingModel || "claude-3-5-sonnet-20241022"
				console.dir(underlyingModel)
				if (underlyingModel.startsWith("deepseek")) {
					this.handler = new DeepSeekHandler({
						...options,
						deepSeekApiKey: options.vibestudioApiKey,
						deepSeekBaseUrl: VIBESTUDIO_URL,
						apiModelId: underlyingModel,
					})
				} else {
					// Default to Claude
					this.handler = new AnthropicHandler({
						...options,
						apiKey: options.vibestudioApiKey,
						anthropicBaseUrl: VIBESTUDIO_URL,
						apiModelId: underlyingModel,
					})
				}
			} catch (error) {
				console.error("Error fetching VibeStudio models:", error)
				// Default to Claude if there's an error
				this.handler = new AnthropicHandler({
					...options,
					apiKey: options.vibestudioApiKey,
					anthropicBaseUrl: VIBESTUDIO_URL,
					apiModelId: "claude-3-5-sonnet-20241022",
				})
			}
		} else if (modelId.startsWith("claude")) {
			this.handler = new AnthropicHandler({
				...options,
				apiKey: options.vibestudioApiKey,
				anthropicBaseUrl: VIBESTUDIO_URL,
			})
		} else if (modelId.startsWith("deepseek")) {
			this.handler = new DeepSeekHandler({
				...options,
				deepSeekApiKey: options.vibestudioApiKey,
				deepSeekBaseUrl: VIBESTUDIO_URL,
			})
		} else {
			throw new Error(`Unsupported model: ${modelId}`)
		}
	}

	getModel(): { id: string; info: ModelInfo } {
		console.dir(this.handler)
		const baseModel = this.handler.getModel()
		return {
			id: baseModel.id,
			info: {
				...baseModel.info,
				// Inherit all capabilities from the underlying model
				supportsImages: baseModel.info.supportsImages,
				supportsComputerUse: baseModel.info.supportsComputerUse,
				supportsPromptCache: baseModel.info.supportsPromptCache,
				// Apply VibeStudio's price markup
				inputPrice: (baseModel.info.inputPrice || 0) * 1.03,
				outputPrice: (baseModel.info.outputPrice || 0) * 1.03,
				cacheWritesPrice: baseModel.info.cacheWritesPrice ? baseModel.info.cacheWritesPrice * 1.03 : undefined,
				cacheReadsPrice: baseModel.info.cacheReadsPrice ? baseModel.info.cacheReadsPrice * 1.03 : undefined,
			},
		}
	}

	async *createMessage(systemPrompt: string, messages: any[]): AsyncGenerator<any> {
		const generator = this.handler.createMessage(systemPrompt, messages)
		let warningMsg = ""

		for await (const chunk of generator) {
			console.dir(chunk)
			if (chunk.type === "text" && chunk.metadata?.ui_only) {
				warningMsg += chunk.metadata?.content
				continue
			}
			yield chunk
		}

		if (warningMsg) {
			if (warningMsg.includes("pay-as-you-go")) {
				vscode.window.showInformationMessage(warningMsg, "View Pay-As-You-Go").then((selection) => {
					if (selection === "View Pay-As-You-Go") {
						vscode.env.openExternal(vscode.Uri.parse("https://vibestudio.online/pay-as-you-go"))
					}
				})
			} else {
				vscode.window.showInformationMessage(warningMsg)
			}
		}
	}

	async completePrompt(prompt: string): Promise<string> {
		return this.handler.completePrompt(prompt)
	}
}

