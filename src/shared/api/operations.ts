import { db } from './fakeDb'
import { delay } from '../utils/delay'
import {Currency} from "@/shared/config/currency"

type OperationDTO = {
  type: string
  amount: number
  currency: Currency
  from: string
  to: string
  date: string
  comment: string
} | {
  type: string
  amount: number
  currency: Currency
  from: string
  to: string
  date: string
  comment: null
} | {
  type: string
  amount: number
  currency: Currency
  from: null
  to: string
  date: string
  comment: string
} | {
  type: string
  amount: number
  currency: Currency
  from: null
  to: string
  date: string
  comment: null
}
type OperationType = {
  id: number
  type: string
  amount: number
  currency: string
  from: string
  to: string
  date: string
  comment: string
} | {
  id: number
  type: string
  amount: number
  currency: string
  from: string
  to: string
  date: string
  comment: null
} | {
  id: number
  type: string
  amount: number
  currency: string
  from: null
  to: string
  date: string
  comment: string
} | {
  id: number
  type: string
  amount: number
  currency: string
  from: null
  to: string
  date: string
  comment: null
}

export const getOperations = async () => {
  await delay(300)

  return db.operations.map(op => {
    const fromEntity = resolveEntity(op.from)
    const toEntity = resolveEntity(op.to)

    return {
      ...op,

      fromName: fromEntity?.name ?? null,
      toName: toEntity?.name ?? null,
      toIcon: toEntity?.icon ?? null,
      toColor: toEntity?.color ?? null,
    }
  })
}

function resolveEntity(ref: string | null) {
  if (!ref) return null

  const [type, idStr] = ref.split(':')
  const id = Number(idStr)

  if (type === 'account') {
    return db.accounts.find(a => a.id === id) ?? null
  }

  if (type === 'fund') {
    return db.funds.find(f => f.id === id) ?? null
  }

  if (type === 'category') {
    return db.categories.find(c => c.id === id) ?? null
  }

  return null
}



export const createOperation = async (
  operation: OperationDTO
) => {
  await delay(300)

  const maxId = db.operations.reduce((max, op) => Math.max(max, op.id), 0)

  const newOperation = {
    id: maxId+1,
    ...operation,
  }

  db.operations.push(newOperation)

  applyOperation(newOperation)

  return newOperation
}


function applyOperation(op: OperationType) {
  if (op.type === 'income') {
    if (!op.to) return
    const accountId = parseInt(op.to.split(':')[1])
    const account = db.accounts.find(a => a.id === accountId)
    if (account) {
      account.balance += op.amount
    }
  }

  if (op.type === 'expense') {
    if (!op.from) return
    const accountId = parseInt(op.from.split(':')[1])
    const account = db.accounts.find(a => a.id === accountId)
    if (account) {
      account.balance -= op.amount
    }
  }

  if (op.type === 'transfer') {
    if (!op.from || !op.to) return

    const [fromType, fromIdStr] = op.from.split(':')
    const [toType, toIdStr] = op.to.split(':')

    const fromId = parseInt(fromIdStr)
    const toId = parseInt(toIdStr)

    let fromAcc, toAcc
    let fromFund, toFund

    if (fromType === 'account') fromAcc = db.accounts.find(a => a.id === fromId)
    if (fromType === 'fund') fromFund = db.funds.find(f => f.id === fromId)
    if (toType === 'account') toAcc = db.accounts.find(a => a.id === toId)
    if (toType === 'fund') toFund = db.funds.find(f => f.id === toId)

    if (fromAcc) fromAcc.balance -= op.amount
    if (fromFund) fromFund.balance -= op.amount
    if (toAcc) toAcc.balance += op.amount
    if (toFund) toFund.balance += op.amount

    if (fromFund) {
      if (!toAcc) return

      db.fundChanges.push({
        id: db.fundChanges.length + 1,
        fundId: fromFund.id,
        type: 'transferOut',
        amount: op.amount,
        currency: op.currency,
        date: op.date,
        accountId: toAcc.id,
        connectedOperationId: op.id
      })
    }

    if (toFund) {
      if (!fromAcc) return

      db.fundChanges.push({
        id: db.fundChanges.length + 1,
        fundId: toFund.id,
        type: 'transferIn',
        amount: op.amount,
        currency: op.currency,
        date: op.date,
        accountId: fromAcc.id,
        connectedOperationId: op.id
      })
    }
  }

}



export const deleteOperation = async ( operationId: number) => {
  const op = db.operations.find(o => o.id === operationId)
  if (!op) throw new Error('Operation not found')

  rollbackOperation(op)
  deleteLinkedFundChanges(op.id)

  db.operations = db.operations.filter(o => o.id !== operationId)
}

function rollbackOperation(op: OperationType) {
  if (op.type === 'income' && op.to) {
    const accountId = parseInt(op.to.split(':')[1])
    const account = db.accounts.find(a => a.id === accountId)
    if (account) account.balance -= op.amount
  }

  if (op.type === 'expense' && op.from) {
    const accountId = parseInt(op.from.split(':')[1])
    const account = db.accounts.find(a => a.id === accountId)
    if (account) account.balance += op.amount
  }

  if (op.type === 'transfer' && op.from && op.to) {
    const [fromType, fromIdStr] = op.from.split(':')
    const [toType, toIdStr] = op.to.split(':')
    const fromId = parseInt(fromIdStr)
    const toId = parseInt(toIdStr)

    let fromAcc, toAcc, fromFund, toFund

    if (fromType === 'account') fromAcc = db.accounts.find(a => a.id === fromId)
    if (fromType === 'fund') fromFund = db.funds.find(f => f.id === fromId)
    if (toType === 'account') toAcc = db.accounts.find(a => a.id === toId)
    if (toType === 'fund') toFund = db.funds.find(f => f.id === toId)

    if (fromAcc) fromAcc.balance += op.amount
    if (fromFund) fromFund.balance += op.amount
    if (toAcc) toAcc.balance -= op.amount
    if (toFund) toFund.balance -= op.amount
  }
}

function deleteLinkedFundChanges(operationId: number) {
  db.fundChanges = db.fundChanges.filter(fc => fc.connectedOperationId !== operationId)
}

