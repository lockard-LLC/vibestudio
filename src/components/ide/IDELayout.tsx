import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ActivityBar } from './ActivityBar'
import { Sidebar } from './Sidebar'
import { EditorArea } from './EditorArea'
import { TerminalPanel } from './TerminalPanel'
import { StatusBar } from './StatusBar'
import { useAppStore } from '@/stores'

export function IDELayout() {
  const { sidebarOpen } = useAppStore()
  const [activeSidebarView, setActiveSidebarView] = useState<'explorer' | 'search' | 'git' | 'extensions'>('explorer')
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [terminalHeight, setTerminalHeight] = useState(300)

  return (
    <div className="flex h-screen bg-vscode-editor-background text-vscode-editor-foreground overflow-hidden">
      {/* Activity Bar */}
      <ActivityBar 
        activeView={activeSidebarView}
        onViewChange={setActiveSidebarView}
      />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 280 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-r border-vscode-sidebar-border"
          >
            <Sidebar 
              activeView={activeSidebarView}
              onTerminalToggle={() => setTerminalOpen(!terminalOpen)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Area */}
        <div 
          className="flex-1 min-h-0"
          style={{ 
            height: terminalOpen ? `calc(100% - ${terminalHeight}px)` : '100%' 
          }}
        >
          <EditorArea />
        </div>

        {/* Terminal Panel */}
        <AnimatePresence>
          {terminalOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: terminalHeight }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="border-t border-vscode-panel-border"
            >
              <TerminalPanel 
                height={terminalHeight}
                onHeightChange={setTerminalHeight}
                onClose={() => setTerminalOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        <StatusBar terminalOpen={terminalOpen} />
      </div>
    </div>
  )
}