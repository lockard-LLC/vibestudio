declare module 'vscode' {
  export type LanguageModelChatSelector = any
  export interface ExtensionContext {
    globalState: {
      get<T = any>(key: string): T | undefined
      update?(key: string, value: any): Promise<void>
    }
    [key: string]: any
  }
  export const env: any
  export const window: any
  export const commands: any
  export const Uri: { parse: (s: string) => any }
  export const version: string
}

declare module 'pretty-bytes' {
  const pb: any
  export default pb
}

declare module 'react-tooltip' {
  export const Tooltip: any
}

declare module 'axios' {
  const axios: any
  export default axios
}
