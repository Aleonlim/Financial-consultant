import { Currency } from '@/shared/config/currency'

export type FundType = 'deposit' | 'investment' | 'realEstate' | 'credit'
export type PeriodType = 'month' | 'quarter' | 'year'

export type Fund = {
  id: number
  name: string
  type: FundType
  balance: number
  currency: Currency
  icon: string
  color: string

  annualRate?: number
  accrualPeriod?: PeriodType

  autoAccrual?: boolean
  autoWriteOff?: boolean
  writeOffAmount?: number
  writeOffPeriod?: PeriodType
  writeOffAccountId?: number
}
