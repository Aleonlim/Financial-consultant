import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/shared/ui/Button/Button'
import { getAccounts } from '@/shared/api/accounts'
import { getFunds } from '@/shared/api/funds'
import { getCategories } from '@/shared/api/categories'
import { createOperation } from '@/shared/api/operations'
import { Currency } from '@/shared/config/currency'
import { Account } from '@/entities/account/model/types'
import {useTranslation} from "react-i18next";

type Props = {
  defaultFrom?: { kind: 'account' | 'deposit' | 'investment' | 'credit' ; id: number } | null
  onSuccess?: () => void
}

type SelectFromValue = 'income' | `account:${number}` | `fund:${number}`

type SelectToValue =`category:${number}` | `account:${number}` | `fund:${number}`

export function AddOperationForm({ defaultFrom, onSuccess }: Props) {
  const { t } = useTranslation()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [funds, setFunds] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [from, setFrom] = useState<SelectFromValue | ''>('')
  const [to, setTo] = useState<SelectToValue | ''>('')
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    getAccounts().then((data) => setAccounts(data as Account[]))
    getFunds().then(setFunds)
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (!defaultFrom) return

    if (defaultFrom.kind === 'account') {
      setFrom(`account:${defaultFrom.id}`)
    }

    if (defaultFrom.kind ==='deposit') {
      setFrom(`fund:${defaultFrom.id}`)
    }

    if (defaultFrom.kind ==='investment' || defaultFrom.kind ==='credit') {
      setTo(`fund:${defaultFrom.id}`)
    }
  }, [defaultFrom])

  const amountCurrency: Currency = useMemo(() => {
    if (!from.startsWith('account')) return 'RUB'
    const id = Number(from.split(':')[1])
    return accounts.find(a => a.id === id)?.currency ?? 'RUB'
  }, [from, accounts])

  function resolveOperationType() {
    if (from === 'income') return 'income'

    const fromKind = from.split(':')[0]
    const toKind = to.split(':')[0]

    if (
      ['account', 'fund'].includes(fromKind) &&
      ['account', 'fund'].includes(toKind)
    ) {
      return 'transfer'
    }

    return 'expense'
  }

  async function handleSubmit() {
    if (!from || !to || !amount) return

    await createOperation({
      type: resolveOperationType(),
      from: from === 'income' ? null : from,
      to,
      amount: Number(amount),
      currency: amountCurrency ?? 'RUB',
      comment: comment || null,
      date: new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Novosibirsk'
      })
    })

    onSuccess?.()
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <label className="block mb-1 text-sm">{t("generalModal.from")}</label>
        <select
          value={from}
          onChange={e => setFrom(e.target.value as SelectFromValue)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="" disabled>{t("generalModal.choose")}</option>
          <option value="income">{t("operations.income")}</option>

          <optgroup label={t("accounts.accounts").toLowerCase()}>
            {accounts.map(a => (
              <option key={`account:${a.id}`} value={`account:${a.id}`}>
                {a.name}
              </option>
            ))}
          </optgroup>

          <optgroup label={t("funds.deposits").toLowerCase()}>
            {funds.filter(f => f.type === 'deposit').map(f => (
                <option key={`fund:${f.id}`} value={`fund:${f.id}`}>
                  {f.name}
                </option>
              ))
            }
          </optgroup>
        </select>
      </div>


      <div>
        <label className="block mb-1 text-sm">{t("generalModal.to")}</label>
        <select
          value={to}
          onChange={e => setTo(e.target.value as SelectToValue)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="" disabled>{t("generalModal.choose")}</option>

          <optgroup label={t("accounts.accounts").toLowerCase()}>
            {accounts.map(a => (
              <option key={`account:${a.id}`} value={`account:${a.id}`}>
                {a.name}
              </option>
            ))}
          </optgroup>

          <optgroup label={t("funds.deposits").toLowerCase()}>
            {funds.filter(f => f.type === 'deposit').map(f => (
              <option key={`fund:${f.id}`} value={`fund:${f.id}`}>
                {f.name}
              </option>
            ))
            }
          </optgroup>

          <optgroup label={t("funds.investments").toLowerCase()}>
            {funds.filter(f => f.type === 'investment').map(f => (
              <option key={`fund:${f.id}`} value={`fund:${f.id}`}>
                {f.name}
              </option>
            ))
            }
          </optgroup>

          <optgroup label={t("funds.loans").toLowerCase()}>
            {funds.filter(f => f.type === 'credit').map(f => (
              <option key={`fund:${f.id}`} value={`fund:${f.id}`}>
                {f.name}
              </option>
            ))
            }
          </optgroup>

          <optgroup label={`${t("generalModal.categories")}, ${t("generalModal.subcategories")}`.toLowerCase()}>
            {categories.map(c => (
              <option key={`category:${c.id}`} value={`category:${c.id}`}>
                {c.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm">{t("generalModal.amount")}</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border rounded px-2 py-1 pr-12"
          />
          {amountCurrency && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {amountCurrency}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm">{t("generalModal.comment")}</label>
        <textarea
          value={comment}
          maxLength={200}
          onChange={e => setComment(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
        <p className="text-xs text-gray-400">
          {comment.length}/200
        </p>
      </div>

      <Button onClick={handleSubmit}>
        {t("generalModal.save")}
      </Button>
    </div>
  )
}











// import { useEffect, useMemo, useState } from 'react'
// import { Button } from '@/shared/ui/Button/Button'
// import { createOperation } from '@/shared/api/operations'
// import { Currency } from '@/shared/config/currency'
// import { getAccounts } from '@/shared/api/accounts'
// import { Account } from '@/entities/account/model/types'
// import { Fund } from '@/entities/fund/model/types'
//
// type Props = {
//   defaultFrom?: Account | Fund | null
//   onSuccess?: () => void
// }
//
// export function AddOperationForm({ defaultFrom, onSuccess }: Props) {
//   const [accounts, setAccounts] = useState<Account[]>([])
//
//   const [from, setFrom] = useState<string>('')
//   const [to, setTo] = useState<string>('')
//   const [amount, setAmount] = useState('')
//   const [comment, setComment] = useState('')
//   const [loading, setLoading] = useState(false)
//
//   useEffect(() => {
//     getAccounts().then(setAccounts)
//   }, [])
//
//   useEffect(() => {
//     if (defaultFrom?.type === 'account' && defaultFrom.id) {
//       setFrom(`account:${defaultFrom.id}`)
//     }
//     if (defaultFrom?.kind === 'income') {
//       setFrom('income')
//     }
//   }, [defaultFrom])
//
//   const operationType = useMemo(() => {
//     if (from === 'income') return 'income'
//     if (from.startsWith('account') && to.startsWith('account')) return 'transfer'
//     if (from.startsWith('fund') || to.startsWith('fund')) return 'transfer'
//     return 'expense'
//   }, [from, to])
//
//   const handleSubmit = async () => {
//     if (!from || !to || !amount) return
//
//     setLoading(true)
//
//     await createOperation({
//       type: operationType,
//       from: from === 'income' ? null : from,
//       to,
//       amount: Number(amount),
//       currency: 'RUB', // позже можно вычислять
//       comment: comment || null,
//     })
//
//     setLoading(false)
//     onSuccess?.()
//   }
//
//   return (
//     <div className="flex flex-col gap-4">
//       {/* Откуда */}
//       <select value={from} onChange={e => setFrom(e.target.value)}>
//         <option value="">Откуда</option>
//         <option value="income">Доход</option>
//
//         {accounts.map(acc => (
//           <option key={acc.id} value={`account:${acc.id}`}>
//             {acc.name}
//           </option>
//         ))}
//       </select>
//
//       {/* Куда */}
//       <select value={to} onChange={e => setTo(e.target.value)}>
//         <option value="">Куда</option>
//
//         {accounts.map(acc => (
//           <option key={acc.id} value={`account:${acc.id}`}>
//             {acc.name}
//           </option>
//         ))}
//       </select>
//
//       {/* Сумма */}
//       <input
//         type="number"
//         placeholder="Сумма"
//         value={amount}
//         onChange={e => setAmount(e.target.value)}
//       />
//
//       {/* Комментарий */}
//       <textarea
//         placeholder="Комментарий (до 200 символов)"
//         maxLength={200}
//         value={comment}
//         onChange={e => setComment(e.target.value)}
//       />
//
//       <Button onClick={handleSubmit} disabled={loading}>
//         {loading ? 'Сохранение...' : 'Сохранить'}
//       </Button>
//     </div>
//   )
// }