import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {db} from '../api/fakeDb'

type User = {
  username: string
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(username: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const found = db.onlyUser.find(
          u => u.username === username && u.password === password
        )
        if (found) {
          const userData = { username: found.username }
          setUser(userData)

          localStorage.setItem('user', JSON.stringify(userData))
          resolve()
        } else {
          reject(new Error(t('loginError')))
        }
      }, 300)
    })
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
