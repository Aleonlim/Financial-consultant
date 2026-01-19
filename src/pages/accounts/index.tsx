import { useEffect, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/AddRounded'
import { CURRENCY_NAMES } from '@/shared/config/currency'
import { Button } from '@/shared/ui/Button/Button'
import { getAccounts } from '@/shared/api/accounts'
import { convertCurrency } from '@/shared/utils/convertCurrency'
import { Account } from '@/entities/account/model/types'
import {AccountCard} from "@/entities/account/ui/AccountCard"
import { deleteAccount } from '@/shared/api/accounts'
import { Modal } from '@/shared/ui/Modal/Modal'
import { AddOperationForm } from '@/features/operation/add-operation/AddOperationForm'
import {AccountForm} from "@/features/account/account-form/AccountForm";
import {useTranslation} from "react-i18next";

export default function AccountsPage() {
  const { t } = useTranslation()

  const [accounts, setAccounts] = useState<Account[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'addOperation' | 'addAccount' | 'editAccount' | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  useEffect(() => {
    getAccounts().then((data) => setAccounts(data as Account[]))
  }, [])

  const totalBalanceRub = useMemo(() => {
    return accounts.reduce((sum, acc) => {
      return (
        sum +
        convertCurrency(acc.balance, acc.currency, 'RUB')
      )
    }, 0)
  }, [accounts])

  const reloadAccounts = async () => {
    const data = await getAccounts()
    setAccounts([...data] as Account[])
  }

  const handleAddOperation = (account?: Account | null) => {
    setSelectedAccount(account ?? null)
    setModalType('addOperation')
    setModalOpen(true)
  }

  const handleAddAccount = () => {
    setSelectedAccount(null)
    setModalType('addAccount')
    setModalOpen(true)
  }

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setModalType('editAccount')
    setModalOpen(true)
  }

  const handleDeleteAccount = async (id: number) => {
    await deleteAccount(id)
    setAccounts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      <p className="text-[20px] mb-[50px]">
        {`${t("accounts.totalAccountBalance")}: `}
        <span className="font-semibold">
          {Math.round(totalBalanceRub).toLocaleString()} {CURRENCY_NAMES['RUB']}
        </span>
      </p>

      <div className="mb-[20px] flex justify-between">
        <Button onClick={() => handleAddOperation(null)}>
          <AddIcon /> {t("operations.addOperation")}
        </Button>
        <Button onClick={handleAddAccount}>
          <AddIcon /> {t("accounts.addAccount")}
        </Button>
      </div>

      <ul className="flex flex-col gap-y-[10px]">
        {accounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            actions={[
                { label: t("operations.addOperation"), onClick: () => handleAddOperation(account) },
                { label: t("generalModal.edit"), onClick: () => handleEditAccount(account) },
                { label: t("generalModal.delete"), onClick: () => handleDeleteAccount(account.id) },
            ]}
          />
        ))}
      </ul>



      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === 'editAccount'
            ? t("accounts.editAccount")
            : modalType === 'addOperation'
              ? t("operations.addOperation")
              : t("accounts.addAccount")
        }
      >
        {modalType === 'addOperation' && (
          <AddOperationForm
            defaultFrom={
              selectedAccount
                ? { kind: 'account', id: selectedAccount.id }
                : null
            }
            onSuccess={async () => {
              await reloadAccounts()
              setModalOpen(false)
            }}
          />
        )}


        {modalType === 'addAccount' && (
          <AccountForm
            onSuccess={async () => {
              await reloadAccounts()
              setModalOpen(false)
            }}
          />
        )}

        {modalType === 'editAccount' &&
          <AccountForm
            account={selectedAccount as Account}
            onSuccess={async () => {
              await reloadAccounts()
              setModalOpen(false)
            }}
          />
        }
      </Modal>
    </div>
  )
}