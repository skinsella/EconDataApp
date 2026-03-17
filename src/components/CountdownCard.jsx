import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'

export function CountdownCard({ title, targetDate }) {
  const parsedDate = useMemo(() => parseISO(targetDate), [targetDate])
  const formattedDate = useMemo(() => format(parsedDate, 'd MMM yyyy'), [parsedDate])

  const [daysRemaining, setDaysRemaining] = useState(() =>
    differenceInDays(parsedDate, new Date())
  )

  useEffect(() => {
    const update = () => setDaysRemaining(differenceInDays(parsedDate, new Date()))
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [parsedDate])

  const isPast = daysRemaining < 0

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`mt-2 text-4xl font-bold ${isPast ? 'text-slate-400' : 'text-slate-900'}`}>
          {isPast ? 0 : daysRemaining}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {isPast ? 'event passed' : 'days remaining'}
        </p>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {formattedDate}
        </div>
      </CardContent>
    </Card>
  )
}
