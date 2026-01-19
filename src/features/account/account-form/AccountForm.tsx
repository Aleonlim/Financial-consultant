import { useState } from 'react'
import { Button } from '@/shared/ui/Button/Button'
import {Input} from '@/shared/ui/Input/Input'
import {createAccount, updateAccount} from '@/shared/api/accounts'
import { CURRENCIES, Currency } from '@/shared/config/currency'
import { Icon } from '@/shared/ui/Icon/Icon'
import {AVAILABLE_COLORS} from '@/shared/config/colors'
import {AVAILABLE_ICONS} from '@/shared/config/icons'
import {Account} from "@/entities/account/model/types";

type Props = {
  account?: Account
  onSuccess?: () => void
}

export function AccountForm({ account, onSuccess }: Props) {
  const isEdit = Boolean(account)

  const [name, setName] = useState(account?.name ?? '')
  const [currency, setCurrency] = useState<Currency>(account?.currency ?? 'RUB')
  const [balance, setBalance] = useState(account?.balance ?? 0)
  const [icon, setIcon] = useState(account?.icon ?? AVAILABLE_ICONS[0])
  const [color, setColor] = useState(account?.color ?? AVAILABLE_COLORS[0])

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)

    if (isEdit) {
      await updateAccount(account!.id, {
        name,
        balance,
        icon,
        color,
      })
    } else {
      await createAccount({
        name,
        currency,
        balance,
        icon,
        color,
      })
    }

    setLoading(false)
    onSuccess?.()
  }


  return (
    <div className="flex flex-col gap-y-4">

      <Input
        label="Название"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div>
        <label className="block mb-1 text-sm">Валюта {isEdit ? '(поменять нельзя)' : ''}</label>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value as Currency)}
          className="w-full border rounded px-3 py-2"
          disabled={isEdit}
        >
          {CURRENCIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Начальный баланс"
        type="number"
        value={balance}
        onChange={e => setBalance(Number(e.target.value))}
      />

      <div>
        <label className="block mb-1 text-sm">Иконка</label>
        <div className="flex  overflow-x-scroll">
          {AVAILABLE_ICONS.map(i => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              className={`p-2 rounded border ${
                icon === i ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <Icon name={i} color={color} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm">Цвет</label>
        <div className="flex gap-2">
          {AVAILABLE_COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${
                color === c ? 'border-black' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        Сохранить
      </Button>
    </div>
  )
}
