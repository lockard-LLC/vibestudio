import { useState } from 'react'
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithEmail,
  createAuthUser,
  logout,
} from '@/firebase'

export function useAuthActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuthAction = async (action: () => Promise<any>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await action()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = () => handleAuthAction(signInWithGoogle)
  const loginWithGithub = () => handleAuthAction(signInWithGithub)
  const loginWithEmail = (email: string, password: string) =>
    handleAuthAction(() => signInWithEmail(email, password))
  const signUp = (email: string, password: string) =>
    handleAuthAction(() => createAuthUser(email, password))
  const signOut = () => handleAuthAction(logout)

  return {
    loading,
    error,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    signUp,
    signOut,
  }
}
