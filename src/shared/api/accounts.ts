import { db } from './fakeDb'
import { delay } from '../utils/delay'
import {Currency} from "@/shared/config/currency"
import {deleteOperation, getOperations} from "@/shared/api/operations"

export const getAccount = async ( accountId: number ) => {
  await delay(300)
  return db.accounts.find(acc => acc.id === accountId)
}

export const getAccounts = async () => {
  await delay(300)
  return db.accounts
}


export const createAccount = async (
  account: {
    name: string
    balance: number
    currency: Currency
    icon: string
    color: string
  }
) => {
  await delay(300)

  const maxId = db.accounts.reduce((max, acc) => Math.max(max, acc.id), 0)

  const newAccount = {
    id: maxId + 1,
    name: account.name,
    balance: account.balance,
    currency: account.currency,
    icon: account.icon,
    color: account.color,
  }

  db.accounts.push(newAccount)
  return newAccount
}


export const updateAccount = async (
  accountId: number,
  dto: {
    name?: string
    balance?: number
    icon?: string
    color?: string
  }
) => {
  await delay(300)

  const account = db.accounts.find(a => a.id === accountId)
  if (!account) {
    throw new Error('Account not found')
  }

  Object.assign(account, dto)
  return account
}


export const deleteAccount = async (accountId: number) => {
  await delay(300)

  const relatedOps = db.operations.filter(
    op => op.from === `account:${accountId}` || op.to === `account:${accountId}`
  )

  for (const op of relatedOps) {
    await deleteOperation(op.id)
  }

  db.accounts = db.accounts.filter(a => a.id !== accountId)
}

export const getAccountOperations = async ( accountId: number ) => {
  const operationsWithDetails = await getOperations()

  return operationsWithDetails.filter(
    op =>
      op.from === `account:${accountId}` ||
      op.to === `account:${accountId}`
  )
}