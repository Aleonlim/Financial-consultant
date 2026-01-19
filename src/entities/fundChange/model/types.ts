import { Currency } from '@/shared/config/currency'

export type FundChangeType = 'manual' | 'autoAccrual' | 'transferIn' | 'transferOut'

export type FundChange = {
  id: number
  fundId: number
  type: FundChangeType
  amount: number
  currency: Currency
  date: string
  accountId?: number | null
  connectedOperationId?: number | null
}
