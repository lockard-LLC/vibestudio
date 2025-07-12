import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Star, 
  Download, 
  Settings, 
  CheckCircle,
  Package,
  Trash2
} from 'lucide-react'

interface Extension {
  id: string
  name: string
  description: string
  author: string
  rating: number
  downloads: string
  installed: boolean
  enabled: boolean
}

const mockExtensions: Extension[] = [
  {
    id: '1',
    name: 'TypeScript Hero',
    description: 'Additional tooling for TypeScript',
    author: 'rbbit',
    rating: 4.5,
    downloads: '2.1M',
    installed: true,
    enabled: true
  },
  {
    id: '2', 
    name: 'Prettier - Code formatter',
    description: 'Code formatter using prettier',
    author: 'Prettier',
    rating: 4.8,
    downloads: '25.4M',
    installed: true,
    enabled: true
  },
  {
    id: '3',
    name: 'ESLint',
    description: 'Integrates ESLint JavaScript into VS Code',
    author: 'Microsoft',
    rating: 4.6,
    downloads: '29.8M',
    installed: true,
    enabled: false
  },
  {
    id: '4',
    name: 'GitLens',
    description: 'Supercharge Git within VS Code',
    author: 'GitKraken',
    rating: 4.7,
    downloads: '15.2M',
    installed: false,
    enabled: false
  },
  {
    id: '5',
    name: 'AI Code Assistant',
    description: 'AI-powered code completion and suggestions',
    author: 'VibeStudio',
    rating: 4.9,
    downloads: '892K',
    installed: false,
    enabled: false
  }
]

export function ExtensionsView() {
  const [extensions, setExtensions] = useState<Extension[]>(mockExtensions)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'installed' | 'marketplace'>('installed')

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ext.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === 'installed') {
      return matchesSearch && ext.installed
    }
    return matchesSearch
  })

  const toggleExtension = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
    ))
  }

  const installExtension = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, installed: true, enabled: true } : ext
    ))
  }

  const uninstallExtension = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, installed: false, enabled: false } : ext
    ))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">EXTENSIONS</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search extensions..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('installed')}
            className={`flex-1 px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'installed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Installed
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex-1 px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'marketplace'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Marketplace
          </button>
        </div>
      </div>

      {/* Extensions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredExtensions.length > 0 ? (
          <div className="p-2 space-y-2">
            {filteredExtensions.map((extension, index) => (
              <motion.div
                key={extension.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-medium text-white">{extension.name}</h3>
                    {extension.installed && extension.enabled && (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-400">{extension.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-2">{extension.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-gray-500">
                    by {extension.author} • {extension.downloads} downloads
                  </div>
                  
                  <div className="flex gap-1">
                    {extension.installed ? (
                      <>
                        <button
                          onClick={() => toggleExtension(extension.id)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            extension.enabled
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {extension.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => uninstallExtension(extension.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Uninstall"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => installExtension(extension.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Install
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-gray-500 text-sm">
            {searchTerm ? 'No extensions found' : 'No extensions available'}
          </div>
        )}
      </div>
    </div>
  )
}