import { Operation } from '../model/types'
import { Icon } from '@/shared/ui/Icon/Icon'
import {CURRENCY_NAMES} from "@/shared/config/currency"
import { ContextMenu } from '@/shared/ui/ContextMenu/ContextMenu'

type OperationCardProps = {
  operation: Operation
  actions: {
    label: string
    onClick: () => void
  }[]
  className?: string
  onClick: () => void
}

export function OperationCard({ operation, actions, className, onClick }: OperationCardProps) {


  return (
    <div
      className={`bg-white flex gap-x-[20px] items-center p-[10px] rounded ${className ?? ''}`}
      onClick={onClick}
    >
      <Icon name={operation.toIcon} color={operation.toColor} />

      <div className="flex flex-col ">
        <p>{operation.toName}</p>
        <p className='text-gray-500 font-medium'>{operation.fromName || 'Доход'}</p>
      </div>


      <p className="ml-auto font-medium">
        {operation.amount.toLocaleString()} {CURRENCY_NAMES[operation.currency]}
      </p>

      <div onClick={(e) => e.stopPropagation()}>
        <ContextMenu actions={actions}/>
      </div>
    </div>
  )
}