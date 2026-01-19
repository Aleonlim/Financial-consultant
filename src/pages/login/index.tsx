import React, { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthProvider'
import {Navigate, useNavigate} from 'react-router-dom'
import { Input } from '@/shared/ui/Input/Input'
import { Button } from '@/shared/ui/Button/Button'
import { useTranslation } from 'react-i18next'
import {LanguageSwitcher} from "@/shared/ui/LanguageSwitcher/LanguageSwitcher"

export default function LoginPage () {
  const { user, login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  if (user) {
    return <Navigate to="/accounts" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError(t('emptyFields'))
      return
    }

    try {
      await login(username, password)
      navigate('/accounts')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t('error'))
      }
    }
  }

  return (
    <div className="bg-blue-100 bg-[url(/images/bg1.jpg)] bg-cover bg-center h-screen flex flex-col">
      <header className="bg-white w-full px-[50px] py-[20px] flex justify-between items-center">
        <p className="font-medium text-center leading-[1.2]">{t('financialConsultant')}</p>
        <LanguageSwitcher className='z-10'/>
      </header>

      <div className="grow flex items-center justify-center backdrop-blur-xs">
        <form className="flex flex-col gap-[10px] w-fit p-[40px] bg-white rounded-[8px]" onSubmit={handleSubmit}>
          <h1 className=" text-2xl mb-[30px] text-center">{t('loginTitle')}</h1>

          <p>data: user34 qwerty1</p>

          <Input
            placeholder={t('username')}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit" className="mt-[10px]">
            {t('signIn')}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  )
}