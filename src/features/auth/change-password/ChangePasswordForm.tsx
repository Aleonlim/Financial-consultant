import { useState } from 'react'
import { Input } from '@/shared/ui/Input/Input'
import { Button } from '@/shared/ui/Button/Button'
import { useAuth} from '@/shared/auth/AuthProvider'
import {useTranslation} from "react-i18next";

type Props = {
  onSuccess: () => void
}

export function ChangePasswordForm({ onSuccess }: Props) {
  const { t } = useTranslation()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { changePassword } = useAuth()

  const handleSubmit = async () => {
    setError(null)

    if (newPassword !== repeatPassword) {
      setError(t("passwordsDoNotMatch"))
      return
    }

    try {
      setLoading(true)
      changePassword(oldPassword, newPassword)
      onSuccess()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Input
        type="password"
        placeholder={t("currentPassword")}
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder={t("newPassword")}
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder={t("repeatNewPassword")}
        value={repeatPassword}
        onChange={e => setRepeatPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleSubmit} disabled={loading}>
        {t("generalModal.save")}
      </Button>
    </div>
  )
}
