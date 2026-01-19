import { useEffect, useState } from 'react'
import { getAccounts } from '@/shared/api/accounts'
import { Account } from '@/entities/account/model/types'
import { BalanceExpenseChart } from '@/features/chart/balance-expense-chart/BalanceExpenseChart'
import {useTranslation} from "react-i18next";

type Period = 'week' | 'month' | '3months'

export default function AnalyticsPage() {
  const { t } = useTranslation()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [accountId, setAccountId] = useState<number | null>(null)
  const [period, setPeriod] = useState<Period>('month')

  useEffect(() => {
    getAccounts().then((data) => setAccounts(data as Account[]))
  }, [])

  return (
    <div className="flex flex-col gap-y-[20px]">
      <p className="text-[20px]">{t("analytics.analytics")}</p>

      <div className="flex gap-x-[20px]">
        <select
          onChange={e => setAccountId(Number(e.target.value))}
          className="border p-[5px]"
        >
          <option>{t("analytics.chooseAccount")}</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          value={period}
          onChange={e => setPeriod(e.target.value as Period)}
          className="border p-[5px]"
        >
          <option value="week">{t("date.week")}</option>
          <option value="month">{t("date.month")}</option>
          <option value="3months">{t("date.3months")}</option>
        </select>
      </div>

      {accountId && (
        <>
          <BalanceExpenseChart
            accountId={accountId}
            period={period}
          />

          {/* <ExpensesByCategoryChart /> */}
          {/* <IncomeVsExpenseChart /> */}
        </>
      )}
    </div>
  )
}















// import { useEffect, useState } from 'react'
// import { getAccounts } from '@/shared/api/accounts'
// import { getAccountAnalytics } from '@/shared/api/analytics'
// import { AnalyticsChart } from '@/entities/chart/ui/AnalyticsChart'
// import { Account } from '@/entities/account/model/types'
//
// type Period = 'week' | 'month' | '3months'
//
// export default function AnalyticsPage() {
//   const [accounts, setAccounts] = useState<Account[]>([])
//   const [accountId, setAccountId] = useState<number | null>(null)
//   const [period, setPeriod] = useState<Period>('month')
//   const [data, setData] = useState<any[]>([])
//
//   useEffect(() => {
//     getAccounts().then((data) => setAccounts(data as Account[]))
//   }, [])
//
//   useEffect(() => {
//     if (!accountId) return
//
//     getAccountAnalytics(accountId, period).then(setData)
//   }, [accountId, period])
//
//   return (
//     <div>
//       <p className="text-[20px] mb-[20px]">Аналитика</p>
//
//       <div className="flex gap-x-[20px] mb-[30px]">
//         <select
//           onChange={e => setAccountId(Number(e.target.value))}
//           className="border p-[5px]"
//         >
//           <option>Выберите счёт</option>
//           {accounts.map(a => (
//             <option key={a.id} value={a.id}>
//               {a.name}
//             </option>
//           ))}
//         </select>
//
//         <select
//           value={period}
//           onChange={e => setPeriod(e.target.value as Period)}
//           className="border p-[5px]"
//         >
//           <option value="week">Неделя</option>
//           <option value="month">Месяц</option>
//           <option value="3months">3 месяца</option>
//         </select>
//       </div>
//
//       {data.length > 0 && <AnalyticsChart data={data} />}
//     </div>
//   )
// }
//
