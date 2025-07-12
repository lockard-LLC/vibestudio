import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { CodyAgent } from '@/components/cody/CodyAgent'
import { Dashboard } from '@/pages/Dashboard'
import { useAppStore } from '@/stores'
import './App.css'

function App() {
  const { onboarding } = useAppStore()

  return (
    <AuthProvider>
      <ProtectedRoute>
        <Dashboard />
        {!onboarding.completed && <OnboardingFlow />}
        <CodyAgent />
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App
