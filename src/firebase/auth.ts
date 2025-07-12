import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { app } from './config'

export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

const isEmulatorMode = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'

if (isEmulatorMode && !auth.emulatorConfig) {
  connectAuthEmulator(auth, 'http://localhost:9099')
}

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const signInWithGithub = () => signInWithPopup(auth, githubProvider)
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)
export const createAuthUser = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)
export const logout = () => signOut(auth)

export const onAuthStateChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback)

export type { User } from 'firebase/auth'
