import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Replace, Case, Regex, FileText, X } from 'lucide-react'

interface SearchResult {
  file: string
  line: number
  content: string
  match: string
}

const mockSearchResults: SearchResult[] = [
  {
    file: 'src/components/Button.tsx',
    line: 15,
    content: 'const Button = ({ children, onClick, disabled = false }) => {',
    match: 'Button'
  },
  {
    file: 'src/components/Button.tsx',
    line: 23,
    content: '  return <button className="btn" onClick={onClick}>{children}</button>',
    match: 'button'
  },
  {
    file: 'src/pages/Home.tsx',
    line: 8,
    content: '      <Button onClick={handleClick}>Click me</Button>',
    match: 'Button'
  }
]

export function SearchView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setResults(mockSearchResults.filter(result => 
        caseSensitive 
          ? result.content.includes(searchTerm)
          : result.content.toLowerCase().includes(searchTerm.toLowerCase())
      ))
      setIsSearching(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setResults([])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">SEARCH</h2>
        <button 
          onClick={() => setShowReplace(!showReplace)}
          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          title="Toggle Replace"
        >
          <Replace className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Replace Input */}
        {showReplace && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Replace..."
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>
        )}

        {/* Search Options */}
        <div className="flex gap-1">
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={`p-2 rounded text-xs transition-colors ${
              caseSensitive 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Match Case"
          >
            <Case className="w-3 h-3" />
          </button>
          <button
            onClick={() => setUseRegex(!useRegex)}
            className={`p-2 rounded text-xs font-mono transition-colors ${
              useRegex 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Use Regular Expression"
          >
            <Regex className="w-3 h-3" />
          </button>
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim() || isSearching}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-xs transition-colors"
            title="Search"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-blue-500 rounded-full" />
          </div>
        ) : results.length > 0 ? (
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">
              {results.length} result{results.length !== 1 ? 's' : ''} in {new Set(results.map(r => r.file)).size} file{new Set(results.map(r => r.file)).size !== 1 ? 's' : ''}
            </div>
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mb-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-gray-300 truncate">{result.file}</span>
                  <span className="text-xs text-gray-500">:{result.line}</span>
                </div>
                <div className="text-xs text-gray-400 ml-5 font-mono">
                  {result.content}
                </div>
              </motion.div>
            ))}
          </div>
        ) : searchTerm && !isSearching ? (
          <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
            No results found
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
            Enter search term to find in files
          </div>
        )}
      </div>
    </div>
  )
}