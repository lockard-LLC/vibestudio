import { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Eye, Shield, CheckCircle, XCircle } from 'lucide-react'
import { useAppStore } from '@/stores'

interface ScreenAccessStepProps {
  onNext: () => void
  onSkip: () => void
}

export function ScreenAccessStep({ onNext, onSkip }: ScreenAccessStepProps) {
  const { updateOnboarding } = useAppStore()
  const [permissionStatus, setPermissionStatus] = useState<
    'pending' | 'granted' | 'denied'
  >('pending')
  const [isRequesting, setIsRequesting] = useState(false)

  const requestScreenAccess = async () => {
    setIsRequesting(true)

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        })

        stream.getTracks().forEach(track => track.stop())
        setPermissionStatus('granted')
        updateOnboarding({
          permissions: { screenAccess: true },
        })
      } else {
        throw new Error('Screen capture not supported')
      }
    } catch (error) {
      console.error('Screen access denied:', error)
      setPermissionStatus('denied')
      updateOnboarding({
        permissions: { screenAccess: false },
      })
    } finally {
      setIsRequesting(false)
    }
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Monitor className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Screen Access Permission
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          Cody, your AI assistant, would like permission to see your screen.
          This helps provide context-aware assistance and better understand your
          development workflow.
        </p>
      </motion.div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <Eye className="w-6 h-6 text-blue-500 mt-1" />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              What Cody can see:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Your code editor and project structure</li>
              <li>• Terminal output and error messages</li>
              <li>• Browser tabs for better debugging help</li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-green-500 mt-1" />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Your privacy is protected:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Only used for coding assistance</li>
              <li>• No recording or permanent storage</li>
              <li>• You can revoke access anytime</li>
            </ul>
          </div>
        </div>
      </div>

      {permissionStatus === 'pending' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-4"
        >
          <button
            onClick={requestScreenAccess}
            disabled={isRequesting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isRequesting ? 'Requesting Access...' : 'Grant Screen Access'}
          </button>
          <button
            onClick={onSkip}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Maybe Later
          </button>
        </motion.div>
      )}

      {permissionStatus === 'granted' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="w-8 h-8" />
            <span className="text-lg font-semibold">Access Granted!</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Perfect! Cody can now provide better assistance by understanding
            your screen context.
          </p>
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Continue
          </button>
        </motion.div>
      )}

      {permissionStatus === 'denied' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-orange-600 dark:text-orange-400 mb-4">
            <XCircle className="w-8 h-8" />
            <span className="text-lg font-semibold">Access Denied</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No worries! Cody can still help with coding questions. You can
            enable screen access later in settings.
          </p>
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Continue Anyway
          </button>
        </motion.div>
      )}
    </div>
  )
}
