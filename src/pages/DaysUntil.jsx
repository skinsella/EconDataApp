import { CountdownCard } from '@/components/CountdownCard'
import { PageWrapper } from '@/components/PageWrapper'
import { COUNTDOWN_EVENTS } from '@/lib/constants'

export default function DaysUntil() {
  return (
    <PageWrapper title="Days Until">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Days Until...</h1>
        <p className="text-slate-500 mt-1">Upcoming economic events and releases</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COUNTDOWN_EVENTS.map((event) => (
          <CountdownCard key={event.title} title={event.title} targetDate={event.targetDate} />
        ))}
      </div>
    </PageWrapper>
  )
}
