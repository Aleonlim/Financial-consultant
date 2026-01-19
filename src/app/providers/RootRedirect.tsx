import { Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/auth/AuthProvider'

export function RootRedirect() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/accounts" replace />
  }

  return <Navigate to="/login" replace />
}
