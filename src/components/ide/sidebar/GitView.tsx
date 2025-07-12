import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GitBranch, 
  Plus, 
  Minus, 
  FileText, 
  GitCommit,
  GitPullRequest,
  GitMerge,
  RefreshCw,
  Upload,
  Download
} from 'lucide-react'

interface GitChange {
  file: string
  status: 'modified' | 'added' | 'deleted' | 'untracked'
  changes: { additions: number; deletions: number }
}

const mockGitChanges: GitChange[] = [
  {
    file: 'src/components/Button.tsx',
    status: 'modified',
    changes: { additions: 5, deletions: 2 }
  },
  {
    file: 'src/pages/Home.tsx',
    status: 'modified',
    changes: { additions: 12, deletions: 0 }
  },
  {
    file: 'src/utils/helpers.ts',
    status: 'added',
    changes: { additions: 25, deletions: 0 }
  },
  {
    file: 'old-component.tsx',
    status: 'deleted',
    changes: { additions: 0, deletions: 18 }
  }
]

export function GitView() {
  const [commitMessage, setCommitMessage] = useState('')
  const [changes] = useState<GitChange[]>(mockGitChanges)
  const [stagedFiles, setStagedFiles] = useState<Set<string>>(new Set())

  const getStatusIcon = (status: GitChange['status']) => {
    switch (status) {
      case 'modified':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case 'added':
        return <Plus className="w-3 h-3 text-green-500" />
      case 'deleted':
        return <Minus className="w-3 h-3 text-red-500" />
      case 'untracked':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      default:
        return null
    }
  }

  const getStatusColor = (status: GitChange['status']) => {
    switch (status) {
      case 'modified':
        return 'text-yellow-400'
      case 'added':
        return 'text-green-400'
      case 'deleted':
        return 'text-red-400'
      case 'untracked':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const toggleStaging = (file: string) => {
    const newStaged = new Set(stagedFiles)
    if (newStaged.has(file)) {
      newStaged.delete(file)
    } else {
      newStaged.add(file)
    }
    setStagedFiles(newStaged)
  }

  const stageAll = () => {
    setStagedFiles(new Set(changes.map(c => c.file)))
  }

  const unstageAll = () => {
    setStagedFiles(new Set())
  }

  const handleCommit = () => {
    if (commitMessage.trim() && stagedFiles.size > 0) {
      console.log('Committing:', Array.from(stagedFiles), 'with message:', commitMessage)
      setCommitMessage('')
      setStagedFiles(new Set())
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">SOURCE CONTROL</h2>
        <div className="flex gap-1">
          <button 
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Branch Info */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">main</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
            <Upload className="w-3 h-3" />
            Push
          </button>
          <button className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors">
            <Download className="w-3 h-3" />
            Pull
          </button>
        </div>
      </div>

      {/* Commit Section */}
      <div className="p-3 border-b border-gray-700">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Commit message..."
          className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleCommit}
            disabled={!commitMessage.trim() || stagedFiles.size === 0}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
          >
            <GitCommit className="w-3 h-3" />
            Commit
          </button>
          <span className="text-xs text-gray-500 self-center">
            {stagedFiles.size} staged
          </span>
        </div>
      </div>

      {/* Changes */}
      <div className="flex-1 overflow-y-auto">
        {/* Staged Changes */}
        {stagedFiles.size > 0 && (
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-300">STAGED CHANGES</span>
              <button
                onClick={unstageAll}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Unstage All
              </button>
            </div>
            {changes
              .filter(change => stagedFiles.has(change.file))
              .map((change, index) => (
                <motion.div
                  key={`staged-${change.file}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                  onClick={() => toggleStaging(change.file)}
                >
                  {getStatusIcon(change.status)}
                  <FileText className={`w-3 h-3 ${getStatusColor(change.status)}`} />
                  <span className="text-sm truncate flex-1">{change.file}</span>
                  <div className="flex gap-1 text-xs">
                    <span className="text-green-400">+{change.changes.additions}</span>
                    <span className="text-red-400">-{change.changes.deletions}</span>
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        {/* Unstaged Changes */}
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-300">CHANGES</span>
            <button
              onClick={stageAll}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Stage All
            </button>
          </div>
          {changes
            .filter(change => !stagedFiles.has(change.file))
            .map((change, index) => (
              <motion.div
                key={`unstaged-${change.file}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                onClick={() => toggleStaging(change.file)}
              >
                {getStatusIcon(change.status)}
                <FileText className={`w-3 h-3 ${getStatusColor(change.status)}`} />
                <span className="text-sm truncate flex-1">{change.file}</span>
                <div className="flex gap-1 text-xs">
                  <span className="text-green-400">+{change.changes.additions}</span>
                  <span className="text-red-400">-{change.changes.deletions}</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}