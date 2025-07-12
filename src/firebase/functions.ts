import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
  type HttpsCallableResult,
} from 'firebase/functions'
import { app } from './config'

export const functions = getFunctions(app)

const isEmulatorMode = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'

if (isEmulatorMode) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

// AI Processing Functions
export const processAIRequest = httpsCallable(functions, 'processAIRequest')
export const generateCode = httpsCallable(functions, 'generateCode')
export const analyzeCode = httpsCallable(functions, 'analyzeCode')
export const optimizeCode = httpsCallable(functions, 'optimizeCode')
export const generateDocumentation = httpsCallable(
  functions,
  'generateDocumentation'
)
export const reviewCode = httpsCallable(functions, 'reviewCode')

// Project Management Functions
export const createProject = httpsCallable(functions, 'createProject')
export const cloneRepository = httpsCallable(functions, 'cloneRepository')
export const deployProject = httpsCallable(functions, 'deployProject')
export const buildProject = httpsCallable(functions, 'buildProject')

// Collaboration Functions
export const inviteToProject = httpsCallable(functions, 'inviteToProject')
export const shareProject = httpsCallable(functions, 'shareProject')
export const syncProjectState = httpsCallable(functions, 'syncProjectState')

// Analytics Functions
export const trackUserActivity = httpsCallable(functions, 'trackUserActivity')
export const generateUsageReport = httpsCallable(
  functions,
  'generateUsageReport'
)

// Security Functions
export const scanForVulnerabilities = httpsCallable(
  functions,
  'scanForVulnerabilities'
)
export const validateUserPermissions = httpsCallable(
  functions,
  'validateUserPermissions'
)

// Helper function for type-safe function calls
export const callFunction = async <T = any>(
  functionName: string,
  data?: any
): Promise<T> => {
  const callable = httpsCallable(functions, functionName)
  const result = await callable(data)
  return result.data as T
}

// AI Model interfaces
export interface AIRequest {
  prompt: string
  context?: string
  model?: 'gpt-4' | 'claude-3' | 'gemini-pro'
  temperature?: number
  maxTokens?: number
}

export interface CodeAnalysisRequest {
  code: string
  language: string
  analysisType: 'quality' | 'security' | 'performance' | 'style'
}

export interface CodeGenerationRequest {
  description: string
  language: string
  framework?: string
  style?: 'functional' | 'object-oriented' | 'mixed'
}

export interface ProjectDeployment {
  projectId: string
  environment: 'development' | 'staging' | 'production'
  config?: Record<string, any>
}

export type { HttpsCallableResult }
