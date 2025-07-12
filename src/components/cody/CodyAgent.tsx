import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Minimize2 } from 'lucide-react'
import { useAppStore } from '@/stores'
import { CodyAvatar } from '../onboarding/CodyAvatar'
import type { AIMessage } from '@/types'

export function CodyAgent() {
  const { codyAgent, updateCodyAgent, onboarding } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [codyAgent.currentConversation])

  const addWelcomeMessage = useCallback(() => {
    const welcomeMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Hey ${onboarding.userInfo.name || 'there'}! 👋 I'm ready to help you code. What would you like to work on?`,
      timestamp: new Date(),
    }

    updateCodyAgent({
      currentConversation: [welcomeMessage],
      isActive: true,
    })
  }, [onboarding.userInfo.name, updateCodyAgent])

  useEffect(() => {
    if (onboarding.completed && !codyAgent.isVisible) {
      updateCodyAgent({ isVisible: true })

      setTimeout(() => {
        addWelcomeMessage()
      }, 1000)
    }
  }, [
    onboarding.completed,
    codyAgent.isVisible,
    updateCodyAgent,
    addWelcomeMessage,
  ])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }

    updateCodyAgent({
      currentConversation: [...codyAgent.currentConversation, userMessage],
    })

    setMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that! Let me take a look at your code.",
        "That's a great question! Here's what I think...",
        'I can definitely help you with that. Let me explain...',
        "Good catch! Here's how we can solve this...",
        "I see what you're trying to do. Here's a better approach...",
      ]

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      updateCodyAgent({
        currentConversation: [
          ...codyAgent.currentConversation,
          userMessage,
          assistantMessage,
        ],
      })
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleClose = () => {
    updateCodyAgent({ isVisible: false })
  }

  if (!codyAgent.isVisible) {
    return null
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`fixed ${positionClasses[codyAgent.position]} z-50`}
    >
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 h-[32rem] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <CodyAvatar size="sm" speaking={isTyping} />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Cody
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isTyping ? 'Typing...' : 'AI Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleExpanded}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {codyAgent.currentConversation.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Cody anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={toggleExpanded}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 relative"
          >
            <CodyAvatar size="md" animated />
            {codyAgent.currentConversation.length > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {Math.min(
                  codyAgent.currentConversation.filter(
                    m => m.role === 'assistant'
                  ).length,
                  9
                )}
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
