import { Currency } from '@/shared/config/currency'

export type Account = {
  id: number
  name: string
  balance: number
  currency: Currency
  icon: string
  color: string
}