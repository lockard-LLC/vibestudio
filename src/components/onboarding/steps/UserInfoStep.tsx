import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/stores'

interface UserInfoStepProps {
  onNext: () => void
  onSkip: () => void
}

export function UserInfoStep({ onNext, onSkip }: UserInfoStepProps) {
  const { onboarding, updateOnboarding } = useAppStore()
  const [userInfo, setUserInfo] = useState({
    name: onboarding.userInfo.name || '',
    age: onboarding.userInfo.age || '',
    location: onboarding.userInfo.location || '',
  })

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    updateOnboarding({
      userInfo: {
        name: userInfo.name || undefined,
        age: userInfo.age ? parseInt(userInfo.age) : undefined,
        location: userInfo.location || undefined,
      },
    })
    onNext()
  }

  const isValid = userInfo.name.trim().length > 0

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Tell us about yourself
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Help Cody provide personalized assistance by sharing a bit about
          yourself. This information stays private and secure.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6 mb-8"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            What's your name? *
          </label>
          <input
            type="text"
            value={userInfo.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            How old are you? (optional)
          </label>
          <input
            type="number"
            value={userInfo.age}
            onChange={e => handleInputChange('age', e.target.value)}
            placeholder="Your age"
            min="1"
            max="120"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Where are you located? (optional)
          </label>
          <input
            type="text"
            value={userInfo.location}
            onChange={e => handleInputChange('location', e.target.value)}
            placeholder="City, Country"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8"
      >
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Privacy Notice:</strong> This information helps Cody provide
          better, more personalized assistance. It's stored securely and never
          shared with third parties.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all transform flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onSkip}
          className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Skip this step
        </button>
      </motion.div>
    </div>
  )
}
