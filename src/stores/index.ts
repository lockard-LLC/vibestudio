import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, Project, OnboardingState, CodyAgentState } from '@/types'

interface AppState {
  user: User | null
  currentProject: Project | null
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  onboarding: OnboardingState
  codyAgent: CodyAgentState
  setUser: (user: User | null) => void
  setCurrentProject: (project: Project | null) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
  updateOnboarding: (updates: Partial<OnboardingState>) => void
  updateCodyAgent: (updates: Partial<CodyAgentState>) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      set => ({
        user: null,
        currentProject: null,
        theme: 'dark',
        sidebarOpen: true,
        onboarding: {
          completed: false,
          currentStep: 0,
          userInfo: {},
          permissions: {
            screenAccess: false,
          },
        },
        codyAgent: {
          isVisible: false,
          isActive: false,
          currentConversation: [],
          position: 'bottom-right',
        },
        setUser: user => set({ user }),
        setCurrentProject: project => set({ currentProject: project }),
        setTheme: theme => set({ theme }),
        toggleSidebar: () =>
          set(state => ({ sidebarOpen: !state.sidebarOpen })),
        updateOnboarding: updates =>
          set(state => ({
            onboarding: { ...state.onboarding, ...updates },
          })),
        updateCodyAgent: updates =>
          set(state => ({
            codyAgent: { ...state.codyAgent, ...updates },
          })),
      }),
      {
        name: 'vibestudio-app-state',
        partialize: state => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          onboarding: state.onboarding,
          codyAgent: {
            position: state.codyAgent.position,
          },
        }),
      }
    )
  )
)
