import { delay } from '../utils/delay'
import { db } from './fakeDb'

type Period = 'week' | 'month' | '3months'

export async function getAccountAnalytics(
  accountId: number,
  period: Period
) {
  await delay(300)

  const startDate = getStartDate(period)

  const operations = db.operations
    .filter(op =>
      (op.from === `account:${accountId}` ||
        op.to === `account:${accountId}`) &&
      new Date(op.date) >= startDate
    )
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))

  const account = db.accounts.find(a => a.id === accountId)
  if (!account) throw new Error('Account not found')

  let currentBalance = account.balance
  const result: Record<string, { balance: number; expenses: number }> = {}

  for (const op of operations) {
    const date = op.date

    if (!result[date]) {
      result[date] = {
        balance: currentBalance,
        expenses: 0
      }
    }

    if (op.from === `account:${accountId}`) {
      currentBalance -= op.amount
      result[date].expenses += op.amount
    }

    if (op.to === `account:${accountId}`) {
      currentBalance += op.amount
    }

    result[date].balance = currentBalance
  }

  return Object.entries(result).map(([date, data]) => ({
    date,
    ...data
  }))
}

function getStartDate(period: Period) {
  const d = new Date()

  if (period === 'week') d.setDate(d.getDate() - 7)
  if (period === 'month') d.setMonth(d.getMonth() - 1)
  if (period === '3months') d.setMonth(d.getMonth() - 3)

  return d
}
