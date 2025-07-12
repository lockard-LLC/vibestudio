import { 
  Files, 
  Search, 
  GitBranch, 
  Package, 
  Settings, 
  User,
  MessageSquare 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/stores'

interface ActivityBarProps {
  activeView: 'explorer' | 'search' | 'git' | 'extensions'
  onViewChange: (view: 'explorer' | 'search' | 'git' | 'extensions') => void
}

export function ActivityBar({ activeView, onViewChange }: ActivityBarProps) {
  const { toggleSidebar, updateCodyAgent } = useAppStore()

  const activities = [
    { id: 'explorer', icon: Files, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'extensions', icon: Package, label: 'Extensions' },
  ] as const

  const handleCodyClick = () => {
    updateCodyAgent({ isVisible: true })
  }

  return (
    <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-2">
      {/* Main Activities */}
      <div className="space-y-1">
        {activities.map((activity) => {
          const Icon = activity.icon
          const isActive = activeView === activity.id
          
          return (
            <motion.button
              key={activity.id}
              onClick={() => {
                if (isActive) {
                  toggleSidebar()
                } else {
                  onViewChange(activity.id)
                }
              }}
              className={`
                w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={activity.label}
            >
              <Icon className="w-5 h-5" />
            </motion.button>
          )
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Actions */}
      <div className="space-y-1">
        {/* Cody AI Assistant */}
        <motion.button
          onClick={handleCodyClick}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-purple-400 hover:text-purple-300 hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Cody AI Assistant"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>

        {/* User Account */}
        <motion.button
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Account"
        >
          <User className="w-5 h-5" />
        </motion.button>

        {/* Settings */}
        <motion.button
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}