import { Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/auth/AuthProvider'
import {JSX} from "react";

type Props = {
  children: JSX.Element
}

export function ProtectedRoute(props: Props) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  return props.children
}