// Firebase configuration and app initialization
export { app, firebaseConfig } from './config'

// Authentication exports
export * from './auth'

// Firestore exports
export * from './firestore'

// Storage exports
export * from './storage'

// Functions exports
export * from './functions'

// Realtime Database exports
export * from './realtime'

// Firebase SDK re-exports for convenience
export { initializeApp } from 'firebase/app'
export { getAnalytics } from 'firebase/analytics'
export { getPerformance } from 'firebase/performance'
export { getRemoteConfig } from 'firebase/remote-config'

// Types
export type { FirebaseApp } from 'firebase/app'
export type { Analytics } from 'firebase/analytics'
export type { Performance } from 'firebase/performance'
export type { RemoteConfig } from 'firebase/remote-config'
