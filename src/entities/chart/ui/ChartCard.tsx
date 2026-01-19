import { ReactNode } from 'react'

type Props = {
  title?: string
  children: ReactNode
}

export function ChartCard({ title, children }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-[20px]">
      {title && (
        <p className="text-[16px] font-semibold mb-[15px]">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}
