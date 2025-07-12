import { motion } from 'framer-motion'
import { Code2, Sparkles, Users, Zap } from 'lucide-react'

interface WelcomeStepProps {
  onNext: () => void
  onSkip: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="mb-8"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to VibeStudio!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The AI-native web IDE where code meets flow. Let's get you set up for
          an amazing development experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        >
          <Code2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Browser-Native IDE
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Full VS Code experience in your browser
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
        >
          <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            AI-First Design
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI built into every aspect of coding
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
        >
          <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Real-time Collab
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Live editing with intelligent sync
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
        >
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Zero Setup
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No downloads, just open and code
          </p>
        </motion.div>
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onNext}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        Let's Get Started!
      </motion.button>
    </div>
  )
}
