import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

export function ChartCard({ title, subtitle, children, loading, error, className }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-sm text-slate-400 text-center px-4">{error}</p>
          </div>
        ) : (
          <div className="h-64" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              {children}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
