import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Code, Lightbulb, Zap, CheckCircle } from 'lucide-react'
import { useAppStore } from '@/stores'
import { CodyAvatar } from '../CodyAvatar'

interface CodyIntroStepProps {
  onNext: () => void
  onSkip: () => void
}

export function CodyIntroStep({ onNext }: CodyIntroStepProps) {
  const { onboarding } = useAppStore()
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    `Hi ${onboarding.userInfo.name || 'there'}! 👋`,
    "I'm Cody, your AI coding assistant. I'm here to help you build amazing things!",
    'I can help with code reviews, debugging, explanations, and even generate code snippets.',
    "You'll find me in the bottom corner whenever you need assistance. Just click to chat!",
    'Ready to start coding together?',
  ]

  const features = [
    {
      icon: Code,
      title: 'Code Assistance',
      description: 'Help with writing, reviewing, and debugging code',
    },
    {
      icon: Lightbulb,
      title: 'Smart Suggestions',
      description: 'Context-aware recommendations and optimizations',
    },
    {
      icon: MessageCircle,
      title: 'Natural Conversation',
      description: 'Ask questions in plain English, get clear answers',
    },
    {
      icon: Zap,
      title: 'Real-time Help',
      description: 'Instant assistance without leaving your workflow',
    },
  ]

  const handleNext = () => {
    if (currentMessage < messages.length - 1) {
      setCurrentMessage(prev => prev + 1)
    } else {
      onNext()
    }
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="mb-8"
      >
        <div className="flex justify-center mb-6">
          <CodyAvatar
            size="lg"
            animated
            speaking={currentMessage < messages.length - 1}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Meet Cody, Your AI Assistant
        </h2>
      </motion.div>

      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-lg text-gray-800 dark:text-gray-200 text-left">
              {messages[currentMessage]}
            </p>
          </div>
        </div>
      </motion.div>

      {currentMessage === messages.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            What I can help you with:
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <feature.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Always Available</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              I'll be in the bottom corner, ready to help whenever you need me!
            </p>
          </motion.div>
        </motion.div>
      )}

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: currentMessage === messages.length - 1 ? 0.9 : 0.3,
        }}
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        {currentMessage === messages.length - 1
          ? 'Start Coding with Cody!'
          : 'Continue'}
      </motion.button>
    </div>
  )
}
