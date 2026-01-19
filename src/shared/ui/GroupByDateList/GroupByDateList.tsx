import { ReactNode } from 'react'
import { formatDate } from '@/shared/utils/formatDate'

type WithDate = {
  date: string
}

type Props<T extends WithDate> = {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export function GroupedByDateList<T extends WithDate>({
                                                        items,
                                                        renderItem,
                                                      }: Props<T>) {
  const grouped = items.reduce<Record<string, T[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = []
    acc[item.date].push(item)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <ul className="flex flex-col gap-y-6">
      {sortedDates.map(date => (
        <li key={date}>
          <p className="mb-2 text-sm text-gray-700 font-medium">
            {formatDate(date)}
          </p>

          <ul className="flex flex-col gap-y-2">
            {grouped[date].map(item => (
              <li key={(item as any).id}>
                {renderItem(item)}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}