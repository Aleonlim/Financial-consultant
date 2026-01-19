import { LOCALE_MAP } from '@/shared/config/locale'
import i18n from "@/shared/config/i18n"

export function formatDate(dateStr: string | Date, t?: (key: string) => string) {

  const date = new Date(dateStr)

  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (t){
    if (isSameDay(date, today)) return t("date.today")
    if (isSameDay(date, yesterday)) return t("date.yesterday")
  }

  const lang = i18n.language
  const locale = LOCALE_MAP[lang] ?? 'ru-RU'

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
