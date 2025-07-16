import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Terminal, 
  X, 
  Maximize2, 
  Minimize2, 
  Plus,
  Trash2,
  Settings,
  Play
} from 'lucide-react'

interface TerminalSession {
  id: string
  name: string
  cwd: string
  history: TerminalLine[]
}

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error'
  content: string
  timestamp: Date
}

interface TerminalPanelProps {
  height: number
  onHeightChange: (height: number) => void
  onClose: () => void
}

export function TerminalPanel({ height, onHeightChange, onClose }: TerminalPanelProps) {
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: '1',
      name: 'Terminal 1',
      cwd: '/workspace/vibestudio',
      history: [
        {
          id: '1',
          type: 'output',
          content: 'Welcome to VibeStudio Terminal',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'command',
          content: 'npm run dev',
          timestamp: new Date()
        },
        {
          id: '3',
          type: 'output',
          content: '> vibestudio@0.0.0 dev\n> vite\n\n  VITE v7.0.4  ready in 273 ms\n\n  ➜  Local:   http://localhost:3001/',
          timestamp: new Date()
        }
      ]
    }
  ])
  const [activeSessionId, setActiveSessionId] = useState('1')
  const [currentCommand, setCurrentCommand] = useState('')
  const [isMaximized, setIsMaximized] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>(['npm run dev', 'git status', 'yarn build'])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeSession = sessions.find(s => s.id === activeSessionId)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [activeSession?.history])

  const addNewSession = () => {
    const newSession: TerminalSession = {
      id: Date.now().toString(),
      name: `Terminal ${sessions.length + 1}`,
      cwd: '/workspace/vibestudio',
      history: [
        {
          id: Date.now().toString(),
          type: 'output',
          content: 'New terminal session started',
          timestamp: new Date()
        }
      ]
    }
    setSessions([...sessions, newSession])
    setActiveSessionId(newSession.id)
  }

  const closeSession = (sessionId: string) => {
    if (sessions.length <= 1) return
    
    const newSessions = sessions.filter(s => s.id !== sessionId)
    setSessions(newSessions)
    
    if (activeSessionId === sessionId) {
      setActiveSessionId(newSessions[0].id)
    }
  }

  const executeCommand = (command: string) => {
    if (!command.trim() || !activeSession) return

    // Add command to history
    if (!commandHistory.includes(command)) {
      setCommandHistory(prev => [command, ...prev.slice(0, 19)]) // Keep last 20 commands
    }

    // Add command to terminal
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: command,
      timestamp: new Date()
    }

    // Simulate command execution
    const output = simulateCommand(command)
    const outputLine: TerminalLine = {
      id: (Date.now() + 1).toString(),
      type: output.isError ? 'error' : 'output',
      content: output.content,
      timestamp: new Date()
    }

    setSessions(sessions.map(s => 
      s.id === activeSessionId 
        ? { ...s, history: [...s.history, commandLine, outputLine] }
        : s
    ))

    setCurrentCommand('')
    setHistoryIndex(-1)
  }

  const simulateCommand = (command: string): { content: string; isError: boolean } => {
    const cmd = command.toLowerCase().trim()
    
    if (cmd === 'clear') {
      // Clear terminal
      setSessions(sessions.map(s => 
        s.id === activeSessionId 
          ? { ...s, history: [] }
          : s
      ))
      return { content: '', isError: false }
    }
    
    if (cmd.startsWith('echo ')) {
      return { content: command.slice(5), isError: false }
    }
    
    if (cmd === 'pwd') {
      return { content: activeSession?.cwd || '/workspace/vibestudio', isError: false }
    }
    
    if (cmd === 'ls') {
      return { content: 'src/  public/  package.json  tsconfig.json  vite.config.ts  README.md', isError: false }
    }
    
    if (cmd === 'git status') {
      return { 
        content: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  modified:   src/App.tsx\n  modified:   src/components/Button.tsx',
        isError: false 
      }
    }

    if (cmd.startsWith('npm ') || cmd.startsWith('yarn ') || cmd.startsWith('git ')) {
      return { content: `Executing: ${command}...`, isError: false }
    }
    
    return { content: `Command not found: ${command}`, isError: true }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand('')
      }
    }
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false)
      onHeightChange(300)
    } else {
      setIsMaximized(true)
      onHeightChange(window.innerHeight - 100)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="w-full h-full bg-vscode-panel-background flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-vscode-editor-group-header-tabs-background border-b border-vscode-panel-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-vscode-terminal-foreground" />
          <span className="text-sm font-medium text-vscode-sidebar-foreground">TERMINAL</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={addNewSession}
            className="p-1 hover:bg-vscode-list-hover-background rounded text-vscode-sidebar-foreground hover:text-vscode-activity-bar-foreground transition-colors"
            title="New Terminal"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1 hover:bg-vscode-list-hover-background rounded text-vscode-sidebar-foreground hover:text-vscode-activity-bar-foreground transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-vscode-list-hover-background rounded text-vscode-sidebar-foreground hover:text-vscode-activity-bar-foreground transition-colors"
            title="Close Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Tabs */}
      {sessions.length > 1 && (
        <div className="flex bg-vscode-editor-group-header-tabs-background border-b border-vscode-panel-border">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`
                flex items-center gap-2 px-3 py-1 cursor-pointer text-sm border-r border-vscode-panel-border group
                ${activeSessionId === session.id 
                  ? 'bg-vscode-panel-background text-vscode-tab-active-foreground'
                  : 'bg-vscode-editor-group-header-tabs-background text-vscode-tab-inactive-foreground hover:bg-vscode-tab-inactive-background'
                }
              `}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span>{session.name}</span>
              {sessions.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeSession(session.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-vscode-list-hover-background rounded transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-3 font-mono text-sm text-vscode-terminal-foreground bg-vscode-terminal-background"
        >
          {activeSession?.history.map((line) => (
            <div key={line.id} className="mb-1">
              {line.type === 'command' ? (
                <div className="flex items-start gap-2">
                  <span className="text-vscode-terminal-ansi-bright-blue flex-shrink-0">
                    user@vibestudio:~$
                  </span>
                  <span className="text-vscode-editor-foreground">{line.content}</span>
                  <span className="text-vscode-terminal-ansi-bright-black text-xs ml-auto">
                    {formatTimestamp(line.timestamp)}
                  </span>
                </div>
              ) : (
                <div className={`whitespace-pre-wrap ${
                  line.type === 'error' ? 'text-vscode-terminal-ansi-red' : 'text-vscode-terminal-foreground'
                }`}>
                  {line.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Command Input */}
        <div className="flex items-center gap-2 p-3 bg-vscode-terminal-background border-t border-vscode-panel-border">
          <span className="text-vscode-terminal-ansi-bright-blue font-mono text-sm flex-shrink-0">
            user@vibestudio:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-vscode-editor-foreground font-mono text-sm outline-none"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}