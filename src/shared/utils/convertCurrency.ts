import { CURRENCY_RATES, Currency } from '@/shared/config/currency'

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
) {
  const inRub = amount * CURRENCY_RATES[from]
  return inRub / CURRENCY_RATES[to]
}