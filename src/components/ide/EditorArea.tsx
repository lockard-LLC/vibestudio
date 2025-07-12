import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, MoreHorizontal } from 'lucide-react'
import { MonacoEditor } from '../editor/MonacoEditor'

interface EditorTab {
  id: string
  name: string
  path: string
  content: string
  language: string
  isDirty: boolean
}

const sampleFiles: EditorTab[] = [
  {
    id: '1',
    name: 'App.tsx',
    path: 'src/App.tsx',
    content: `import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App`,
    language: 'typescript',
    isDirty: false
  },
  {
    id: '2',
    name: 'Button.tsx',
    path: 'src/components/Button.tsx',
    content: `import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200'
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }\`}
    >
      {children}
    </button>
  )
}`,
    language: 'typescript',
    isDirty: true
  }
]

export function EditorArea() {
  const [openTabs, setOpenTabs] = useState<EditorTab[]>(sampleFiles)
  const [activeTabId, setActiveTabId] = useState<string>(sampleFiles[0]?.id || '')

  const activeTab = openTabs.find(tab => tab.id === activeTabId)

  const closeTab = (tabId: string) => {
    const newTabs = openTabs.filter(tab => tab.id !== tabId)
    setOpenTabs(newTabs)
    
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id)
    }
  }

  const updateTabContent = (tabId: string, content: string) => {
    setOpenTabs(tabs => 
      tabs.map(tab => 
        tab.id === tabId 
          ? { ...tab, content, isDirty: true }
          : tab
      )
    )
  }

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'typescript':
      case 'javascript':
        return 'text-blue-400'
      case 'css':
      case 'scss':
        return 'text-green-400'
      case 'html':
        return 'text-orange-400'
      case 'json':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  if (openTabs.length === 0) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">No files open</h2>
          <p className="text-gray-500 mb-4">Open a file from the explorer to start coding</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto">
            <Plus className="w-4 h-4" />
            New File
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Tab Bar */}
      <div className="flex bg-gray-800 border-b border-gray-700 min-h-0">
        <div className="flex flex-1 overflow-x-auto">
          {openTabs.map((tab) => (
            <motion.div
              key={tab.id}
              layout
              className={`
                flex items-center gap-2 px-3 py-2 border-r border-gray-700 cursor-pointer
                min-w-0 max-w-xs group relative
                ${activeTabId === tab.id 
                  ? 'bg-gray-900 text-white border-t-2 border-t-blue-500' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }
              `}
              onClick={() => setActiveTabId(tab.id)}
            >
              <div className={`w-2 h-2 rounded-full ${getLanguageColor(tab.language)}`} />
              <span className="text-sm truncate flex-1">
                {tab.name}
                {tab.isDirty && <span className="text-orange-400">•</span>}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
        
        {/* Tab Actions */}
        <div className="flex items-center px-2">
          <button 
            className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
            title="More Actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full"
            >
              <MonacoEditor
                value={activeTab.content}
                language={activeTab.language}
                onChange={(value) => {
                  if (value !== undefined) {
                    updateTabContent(activeTab.id, value)
                  }
                }}
                className="w-full h-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}