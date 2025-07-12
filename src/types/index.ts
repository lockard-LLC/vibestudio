export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  name?: string
  age?: number
  location?: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  userId: string
  files: ProjectFile[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
}

export interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  language: string
  size: number
  createdAt: Date
  updatedAt: Date
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  projectId?: string
}

export interface EditorTheme {
  name: string
  colors: {
    background: string
    foreground: string
    selection: string
    line: string
  }
}

export interface OnboardingState {
  completed: boolean
  currentStep: number
  userInfo: {
    name?: string
    age?: number
    location?: string
  }
  permissions: {
    screenAccess: boolean
  }
}

export interface CodyAgentState {
  isVisible: boolean
  isActive: boolean
  currentConversation: AIMessage[]
  position: 'bottom-right' | 'bottom-left' | 'bottom-center'
}
