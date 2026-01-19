import { Account } from '../model/types'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/ui/Icon/Icon'
import {CURRENCY_NAMES} from "@/shared/config/currency"
import { ContextMenu } from '@/shared/ui/ContextMenu/ContextMenu'

type AccountCardProps = {
  account: Account
  actions: {
    label: string
    onClick: () => void
  }[]
  className?: string
}

export function AccountCard({ account, actions, className }: AccountCardProps) {
  const navigate = useNavigate()

  return (
    <li
      className={`bg-white flex gap-x-[20px] items-center p-[10px] rounded ${className ?? ''}`}
      onClick={() => navigate(`/accounts/${account.id}`)}
    >
      <Icon name={account.icon} color={account.color} />
      <p>{account.name}</p>

      <p className="ml-auto font-medium">
        {account.balance.toLocaleString()} {CURRENCY_NAMES[account.currency]}
      </p>

      <div onClick={(e) => e.stopPropagation()}>
        <ContextMenu actions={actions}/>
      </div>
    </li>
  )
}