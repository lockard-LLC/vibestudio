import { useState, useEffect } from 'react'
import { 
  GitBranch, 
  AlertCircle, 
  CheckCircle, 
  Zap,
  Wifi,
  WifiOff,
  Settings
} from 'lucide-react'

interface StatusBarProps {
  terminalOpen: boolean
}

export function StatusBar({ terminalOpen }: StatusBarProps) {
  const [time, setTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  return (
    <div className="h-6 bg-vscode-status-bar-background text-vscode-status-bar-foreground text-xs flex items-center justify-between px-3">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Git Branch */}
        <div className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>

        {/* Problems */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>2</span>
          </div>
        </div>

        {/* AI Status */}
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Cody Ready</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-4">
        {/* File Info */}
        <span>TypeScript React • UTF-8 • LF</span>
        
        {/* Cursor Position */}
        <span>Ln 15, Col 32</span>
        
        {/* Selection */}
        <span>(2 selected)</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Server Status */}
        <div className="flex items-center gap-1">
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </>
          )}
        </div>

        {/* Live Share */}
        <div className="flex items-center gap-1">
          <span>Live Share</span>
        </div>

        {/* Terminal Indicator */}
        {terminalOpen && (
          <div className="flex items-center gap-1">
            <span>Terminal</span>
          </div>
        )}

        {/* Language Mode */}
        <button className="hover:bg-vscode-status-bar-no-folder-background px-2 py-0.5 rounded transition-colors">
          TypeScript
        </button>

        {/* Encoding */}
        <button className="hover:bg-vscode-status-bar-no-folder-background px-2 py-0.5 rounded transition-colors">
          UTF-8
        </button>

        {/* Line Ending */}
        <button className="hover:bg-vscode-status-bar-no-folder-background px-2 py-0.5 rounded transition-colors">
          LF
        </button>

        {/* Time */}
        <span>{formatTime(time)}</span>

        {/* Settings */}
        <button className="hover:bg-vscode-status-bar-no-folder-background p-1 rounded transition-colors">
          <Settings className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}