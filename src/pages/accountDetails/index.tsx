import { useParams } from "react-router-dom"
import {CURRENCY_NAMES} from "@/shared/config/currency";
import {getAccount, getAccountOperations} from "@/shared/api/accounts";
import {Button} from "@/shared/ui/Button/Button";
import AddIcon from "@mui/icons-material/AddRounded";
import {useEffect, useState } from "react";
import { GroupedByDateList } from "@/shared/ui/GroupByDateList/GroupByDateList";
import { OperationCard } from "@/entities/operation/ui/OperationCard";
import { Modal } from "@/shared/ui/Modal/Modal";
import {AddOperationForm} from "@/features/operation/add-operation/AddOperationForm";
import {Account} from "@/entities/account/model/types";
import {Operation} from "@/entities/operation/model/types";
import {deleteOperation} from "@/shared/api/operations";
import {AccountForm} from "@/features/account/account-form/AccountForm";
import {formatDate} from "@/shared/utils/formatDate";
import {useTranslation} from "react-i18next";

export function AccountDetailsPage() {
  const { t } = useTranslation()
  const {accountId} = useParams()
  const accountIdNum = Number(accountId)

  const [account, setAccount] = useState<Account | null>(null)
  const [operations, setOperations] = useState<Operation[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'addOperation' | 'editAccount' |'operationDetails' | null>(null)
  const [selectedOperation, setSelectedOperation] = useState<Operation>()

  useEffect(() => {
    loadAccount()
    loadOperations()
  }, [accountIdNum])

  async function loadAccount() {
    const data = await getAccount(accountIdNum)
    setAccount(data as Account)
  }

  async function loadOperations() {
    const data = await getAccountOperations(accountIdNum)
    setOperations(data as Operation[])
  }

  function handleAddOperation() {
    setModalType('addOperation')
    setModalOpen(true)
  }

  function handleEditAccount() {
    setModalType('editAccount')
    setModalOpen(true)
  }

  const handleDeleteOperation = async (id: number) => {
    await deleteOperation(id)
    setOperations(prev => prev.filter(op => op.id !== id))
  }

  const handleOpenDetails = (operation: Operation) => {
    setSelectedOperation(operation)
    setModalType('operationDetails')
    setModalOpen(true)
  }

  return (
    <div>
      <p className="text-[20px] mb-[50px]">
        {account?.name} |{' '}
        {account?.balance.toLocaleString()} {CURRENCY_NAMES[account?.currency!]}
      </p>

      <div className="mb-[20px] flex justify-between">
        <Button onClick={handleAddOperation}>
          <AddIcon /> {t("operations.addOperation")}
        </Button>
        <Button onClick={handleEditAccount}>
          {t("generalModal.edit")}
        </Button>
      </div>

      <GroupedByDateList
        items={operations}
        renderItem={(operation) => (
          <OperationCard
            key={operation.id}
            operation={operation}
            actions={[
              { label: t("generalModal.delete"), onClick: () => handleDeleteOperation(operation.id) },
            ]}
            onClick={() => handleOpenDetails(operation)}
          />
        )}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === 'addOperation'
            ? t("operations.addOperation")
            : modalType === 'editAccount'
              ? t("accounts.editAccount")
              : t("operations.operationDetails")
        }
      >
        {modalType === 'addOperation' && (
          <AddOperationForm
            defaultFrom={
              account
                ? { kind: 'account', id: account.id }
                : null
            }
            onSuccess={async () => {
              await loadAccount()
              await loadOperations()
              setModalOpen(false)
            }}
          />
        )}

        {modalType === 'editAccount' && (
          <AccountForm
            account={account as Account}
            onSuccess={async () => {
              await loadAccount()
              setModalOpen(false)
            }}
          />
        )}

        {modalType === 'operationDetails' &&
          <div className="flex flex-col gap-y-[15px]">
            <p>{t('generalModal.amount')}: {selectedOperation?.id} {selectedOperation?.currency ? CURRENCY_NAMES[selectedOperation?.currency] : ''}</p>
            <p>{t('generalModal.from')}: {selectedOperation?.fromName ?? t('operations.income').toLowerCase()}</p>
            <p>{t('generalModal.to')}: {selectedOperation?.toName}</p>
            <p>{t('generalModal.date')}: {selectedOperation?.date ? formatDate(selectedOperation?.date, t) : '-'}</p>
            <p>{t('generalModal.comment')}: {selectedOperation?.comment || '-'}</p>
          </div>
        }
      </Modal>
    </div>
  )
}
