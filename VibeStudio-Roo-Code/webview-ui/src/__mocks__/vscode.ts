// Minimal vscode mock for webview-ui tests
export const version = "1.0.0"

export const env = {
  uriScheme: "vscode",
  openExternal: async (_uri: any) => true,
  asExternalUri: async (uri: any) => uri,
}

export const window = {
  showErrorMessage: (..._args: any[]) => Promise.resolve(undefined),
  showInformationMessage: (..._args: any[]) => Promise.resolve(undefined),
  createOutputChannel: (_name: string) => ({ appendLine: () => {}, dispose: () => {} }),
}

export const commands = {
  executeCommand: async (..._args: any[]) => undefined,
}

export const Uri = {
  parse: (value: string) => ({ toString: () => value }),
}

export type LanguageModelChatSelector = any

export default { version, env, window, commands, Uri }

