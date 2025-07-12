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
    <div className="h-6 bg-blue-600 text-white text-xs flex items-center justify-between px-3">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Git Branch */}
        <div className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
          <span className="text-blue-200">✓</span>
        </div>

        {/* Problems */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-300" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-yellow-300" />
            <span>2</span>
          </div>
        </div>

        {/* AI Status */}
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-purple-300" />
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
              <Wifi className="w-3 h-3 text-green-300" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-300" />
              <span>Offline</span>
            </>
          )}
        </div>

        {/* Live Share */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Live Share</span>
        </div>

        {/* Terminal Indicator */}
        {terminalOpen && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Terminal</span>
          </div>
        )}

        {/* Language Mode */}
        <button className="hover:bg-blue-700 px-2 py-0.5 rounded transition-colors">
          TypeScript
        </button>

        {/* Encoding */}
        <button className="hover:bg-blue-700 px-2 py-0.5 rounded transition-colors">
          UTF-8
        </button>

        {/* Line Ending */}
        <button className="hover:bg-blue-700 px-2 py-0.5 rounded transition-colors">
          LF
        </button>

        {/* Time */}
        <span className="text-blue-200">{formatTime(time)}</span>

        {/* Settings */}
        <button className="hover:bg-blue-700 p-1 rounded transition-colors">
          <Settings className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}