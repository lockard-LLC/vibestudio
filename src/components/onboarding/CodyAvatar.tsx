import { motion } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'

interface CodyAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  speaking?: boolean
}

export function CodyAvatar({
  size = 'md',
  animated = false,
  speaking = false,
}: CodyAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={
        animated
          ? {
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: animated ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg`}
      >
        <Bot className={`${iconSizeClasses[size]} text-white`} />

        {speaking && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        )}

        {animated && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-300"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-purple-300"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </>
        )}
      </div>

      <motion.div
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
        animate={
          speaking
            ? {
                scale: [1, 1.1, 1],
                opacity: [0.6, 1, 0.6],
              }
            : {}
        }
        transition={{
          duration: 0.8,
          repeat: speaking ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
      </motion.div>
    </motion.div>
  )
}
