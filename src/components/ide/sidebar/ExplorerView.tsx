import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Folder, 
  FolderOpen, 
  File, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Search,
  MoreHorizontal,
  Terminal
} from 'lucide-react'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  expanded?: boolean
}

const mockFileTree: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { id: '3', name: 'Button.tsx', type: 'file' },
          { id: '4', name: 'Input.tsx', type: 'file' },
          { id: '5', name: 'Modal.tsx', type: 'file' },
        ]
      },
      {
        id: '6',
        name: 'pages',
        type: 'folder',
        children: [
          { id: '7', name: 'Home.tsx', type: 'file' },
          { id: '8', name: 'About.tsx', type: 'file' },
        ]
      },
      { id: '9', name: 'App.tsx', type: 'file' },
      { id: '10', name: 'main.tsx', type: 'file' },
      { id: '11', name: 'index.css', type: 'file' },
    ]
  },
  {
    id: '12',
    name: 'public',
    type: 'folder',
    children: [
      { id: '13', name: 'index.html', type: 'file' },
      { id: '14', name: 'favicon.ico', type: 'file' },
    ]
  },
  { id: '15', name: 'package.json', type: 'file' },
  { id: '16', name: 'tsconfig.json', type: 'file' },
  { id: '17', name: 'vite.config.ts', type: 'file' },
  { id: '18', name: 'README.md', type: 'file' },
]

interface ExplorerViewProps {
  onTerminalToggle: () => void
}

export function ExplorerView({ onTerminalToggle }: ExplorerViewProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>(mockFileTree)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const toggleFolder = (id: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id && node.type === 'folder') {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setFileTree(updateNode(fileTree))
  }

  const selectFile = (id: string, name: string) => {
    setSelectedFile(id)
    // TODO: Open file in editor
    console.log('Opening file:', name)
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    // Return appropriate color based on file type
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'text-blue-400'
      case 'js':
      case 'jsx':
        return 'text-yellow-400'
      case 'css':
      case 'scss':
        return 'text-green-400'
      case 'html':
        return 'text-orange-400'
      case 'json':
        return 'text-amber-400'
      case 'md':
        return 'text-gray-400'
      default:
        return 'text-gray-500'
    }
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <motion.div
          className={`
            flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded-md mx-1
            ${selectedFile === node.id ? 'bg-blue-600/30 text-blue-300' : ''}
          `}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id)
            } else {
              selectFile(node.id, node.name)
            }
          }}
          whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
          transition={{ duration: 0.1 }}
        >
          {node.type === 'folder' ? (
            <>
              {node.expanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {node.expanded ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className={`w-4 h-4 ${getFileIcon(node.name)}`} />
            </>
          )}
          <span className="text-sm truncate flex-1">{node.name}</span>
        </motion.div>
        
        {node.type === 'folder' && node.expanded && node.children && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">EXPLORER</h2>
        <div className="flex gap-1">
          <button 
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
            title="New File"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
            title="More Actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="text-xs font-semibold text-gray-400 px-3 mb-2">
          VIBESTUDIO
        </div>
        {renderFileTree(fileTree)}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-700">
        <motion.button
          onClick={onTerminalToggle}
          className="w-full flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Terminal className="w-4 h-4" />
          Open Terminal
        </motion.button>
      </div>
    </div>
  )
}