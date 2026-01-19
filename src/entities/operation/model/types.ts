import { Currency } from '@/shared/config/currency'

export type OperationType = 'income' | 'expense' | 'transfer'

export type OperationTarget = `account:${number}` | `fund:${number}` | `category:${number}`

export type Operation = {
  id: number
  type: OperationType
  amount: number
  currency: Currency
  from: OperationTarget | null
  to: OperationTarget
  date: string
  comment: string | null

  fromName: string | null,
  toName: string,
  toIcon: string,
  toColor: string,
}
