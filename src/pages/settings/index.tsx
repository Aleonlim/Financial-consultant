import { useState } from 'react'
import { Button } from '@/shared/ui/Button/Button'
import { Modal } from '@/shared/ui/Modal/Modal'
import { ChangePasswordForm } from '@/features/auth/change-password/ChangePasswordForm'
import {useAuth} from "@/shared/auth/AuthProvider";
import {useTranslation} from "react-i18next";

export default function SettingsPage() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  return (
    <div>
      <h1 className="text-[20px] mb-[50px]">{t("settings")}</h1>


      <Button onClick={() => setPasswordModalOpen(true)} className="mb-[20px]">
        {t("changePassword")}
      </Button>

      <Button variant="danger" onClick={logout}>
        {t("signOut")}
      </Button>


      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title={t("changePassword")}
      >
        <ChangePasswordForm
          onSuccess={() => setPasswordModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
