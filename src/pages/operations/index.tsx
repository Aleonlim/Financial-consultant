import AddIcon from "@mui/icons-material/AddRounded"
import {Button} from "@/shared/ui/Button/Button"
import {OperationCard} from "@/entities/operation/ui/OperationCard"
import {useEffect, useState} from "react"
import {Operation} from "@/entities/operation/model/types"
import {getOperations, deleteOperation} from "@/shared/api/operations"
import {AddOperationForm} from "@/features/operation/add-operation/AddOperationForm"
import {Modal} from "@/shared/ui/Modal/Modal"
import { GroupedByDateList } from '@/shared/ui/GroupByDateList/GroupByDateList'
import { formatDate } from '@/shared/utils/formatDate'
import { CURRENCY_NAMES } from "@/shared/config/currency"

export default function OperationsPage() {
  const [operations, setOperations] = useState<Operation[]>([])

  const [selectedOperation, setSelectedOperation] = useState<Operation>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'addOperation' | 'operationDetails' | null>(null)

  useEffect(() => {
    getOperations().then((data) => setOperations(data as Operation[]))
  }, [])

  const reloadOperations = async () => {
    const data = await getOperations()
    setOperations([...data] as Operation[])
  }

  const handleAddOperation = () => {
    setModalType('addOperation')
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
      <p className="text-[20px] mb-[50px]">История операций</p>
      <Button className="mb-[20px]" onClick={handleAddOperation}>
        <AddIcon /> Добавить операцию
      </Button>

      <GroupedByDateList
        items={operations}
        renderItem={(operation) => (
          <OperationCard
            key={operation.id}
            operation={operation}
            actions={[
              { label: 'Удалить', onClick: () => handleDeleteOperation(operation.id) },
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
            ? 'Добавить операцию'
            : 'Детали операции'
        }
      >
        {modalType === 'addOperation' && (
          <AddOperationForm
            defaultFrom={null}
            onSuccess={async () => {
              await reloadOperations()
              setModalOpen(false)
            }}
          />
        )}

        {modalType === 'operationDetails' &&
          <div className="flex flex-col gap-y-[15px]">
            <p>Сумма: {selectedOperation?.id} {selectedOperation?.currency ? CURRENCY_NAMES[selectedOperation?.currency] : ''}</p>
            <p>Откуда: {selectedOperation?.fromName ?? 'Доход'}</p>
            <p>Куда: {selectedOperation?.toName}</p>
            <p>Дата: {selectedOperation ? formatDate(selectedOperation?.date) : 'не указана'}</p>
            <p>Комментарий: {selectedOperation?.comment || '-'}</p>
          </div>
        }
      </Modal>

    </div>
  )
}