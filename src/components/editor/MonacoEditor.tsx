import { useRef, useEffect } from 'react'
import Editor, { OnMount, OnChange } from '@monaco-editor/react'
import { useAppStore } from '@/stores'

interface MonacoEditorProps {
  value: string
  language: string
  onChange?: (value: string | undefined) => void
  onMount?: OnMount
  className?: string
  readOnly?: boolean
}

export function MonacoEditor({
  value,
  language,
  onChange,
  onMount,
  className = '',
  readOnly = false,
}: MonacoEditorProps) {
  const { theme } = useAppStore()
  const editorRef = useRef<any>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure Monaco for better VS Code-like experience
    monaco.editor.defineTheme('vibestudio-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2d2e',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorCursor.foreground': '#ffffff',
        'editorWhitespace.foreground': '#404040',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
      },
    })

    monaco.editor.defineTheme('vibestudio-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'operator', foreground: '000000' },
        { token: 'type', foreground: '267F99' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editor.selectionBackground': '#add6ff',
        'editor.inactiveSelectionBackground': '#e5ebf1',
        'editorCursor.foreground': '#000000',
        'editorWhitespace.foreground': '#d3d3d3',
        'editorIndentGuide.background': '#d3d3d3',
        'editorIndentGuide.activeBackground': '#939393',
        'editorLineNumber.foreground': '#237893',
        'editorLineNumber.activeForeground': '#0b216f',
      },
    })

    // Set theme based on app theme
    const editorTheme = theme === 'dark' ? 'vibestudio-dark' : 'vibestudio-light'
    monaco.editor.setTheme(editorTheme)

    // Configure editor options for better UX
    editor.updateOptions({
      fontFamily: "'Fira Code', 'JetBrains Mono', 'SF Mono', Consolas, monospace",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.5,
      fontLigatures: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderWhitespace: 'selection',
      rulers: [80, 120],
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      quickSuggestions: true,
      parameterHints: { enabled: true },
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoIndent: 'advanced',
      formatOnType: true,
      formatOnPaste: true,
    })

    // Call the provided onMount callback
    if (onMount) {
      onMount(editor, monaco)
    }
  }

  const handleChange: OnChange = (value) => {
    if (onChange) {
      onChange(value)
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco
      if (monaco) {
        const editorTheme = theme === 'dark' ? 'vibestudio-dark' : 'vibestudio-light'
        monaco.editor.setTheme(editorTheme)
      }
    }
  }, [theme])

  return (
    <div className={`w-full h-full ${className}`}>
      <Editor
        value={value}
        language={language}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vibestudio-dark' : 'vibestudio-light'}
        options={{
          readOnly,
          automaticLayout: true,
          scrollbar: {
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full" />
              <span>Loading Editor...</span>
            </div>
          </div>
        }
      />
    </div>
  )
}