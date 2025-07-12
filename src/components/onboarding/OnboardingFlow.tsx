import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores'
import { CodyAvatar } from './CodyAvatar'
import { ScreenAccessStep } from './steps/ScreenAccessStep'
import { UserInfoStep } from './steps/UserInfoStep'
import { WelcomeStep } from './steps/WelcomeStep'
import { CodyIntroStep } from './steps/CodyIntroStep'

const steps = [
  { component: WelcomeStep, title: 'Welcome to VibeStudio' },
  { component: ScreenAccessStep, title: 'Screen Access Permission' },
  { component: UserInfoStep, title: 'Tell us about yourself' },
  { component: CodyIntroStep, title: 'Meet Cody, your AI assistant' },
]

export function OnboardingFlow() {
  const { onboarding, updateOnboarding, updateCodyAgent } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateOnboarding({ currentStep: nextStep })
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const completeOnboarding = () => {
    updateOnboarding({ completed: true })
    updateCodyAgent({ isVisible: true })
    setIsVisible(false)
  }

  const CurrentStepComponent = steps[currentStep]?.component

  if (!isVisible || onboarding.completed) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <CodyAvatar size="lg" animated />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {steps[currentStep]?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    onNext={handleNext}
                    onSkip={handleSkip}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Skip for now
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentStep + 1} / {steps.length}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
