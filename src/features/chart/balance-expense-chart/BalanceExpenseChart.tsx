import { useEffect, useState } from 'react'
import { getAccountAnalytics } from '@/shared/api/analytics'
import {  ChartCard } from '@/entities/chart/ui/ChartCard'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import {useTranslation} from "react-i18next";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
)

type Period = 'week' | 'month' | '3months'

type Props = {
  accountId: number
  period: Period
}

export function BalanceExpenseChart({ accountId, period }: Props) {
  const { t } = useTranslation()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    getAccountAnalytics(accountId, period).then(setData)
  }, [accountId, period])

  if (!data.length) return null

  return (
    <ChartCard title={t("balanceAndExpenses")}>
      <Line
        data={{
          labels: data.map(d => d.date),
          datasets: [
            {
              label: t("analytics.balance"),
              data: data.map(d => d.balance),
              borderColor: '#4f46e5',
              backgroundColor: '#4f46e5'
            },
            {
              label: t("analytics.expenses"),
              data: data.map(d => d.expenses),
              borderColor: '#ef4444',
              backgroundColor: '#ef4444'
            }
          ]
        }}
      />
    </ChartCard>
  )
}
