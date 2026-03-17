import { format } from 'date-fns'
import { TrendingUp, Users, DollarSign, BarChart3, UserX, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { PageWrapper } from '@/components/PageWrapper'
import { CHART_COLORS, CHART_AXIS_TICK, CHART_AXIS_STROKE, CHART_GRID_STROKE } from '@/lib/constants'

const gdpData = [
  { period: '2024Q1', value: 1.8 },
  { period: '2024Q2', value: 2.0 },
  { period: '2024Q3', value: 1.9 },
  { period: '2024Q4', value: 2.1 },
  { period: '2025Q1', value: 2.3 },
  { period: '2025Q2', value: 2.1 },
]

const gniStarData = [
  { period: '2024Q1', value: 3.2 },
  { period: '2024Q2', value: 2.8 },
  { period: '2024Q3', value: 3.1 },
  { period: '2024Q4', value: 2.9 },
  { period: '2025Q1', value: 3.4 },
  { period: '2025Q2', value: 3.0 },
]

const mddData = [
  { period: '2024Q1', value: 1.5 },
  { period: '2024Q2', value: 1.7 },
  { period: '2024Q3', value: 1.6 },
  { period: '2024Q4', value: 1.8 },
  { period: '2025Q1', value: 2.0 },
  { period: '2025Q2', value: 1.9 },
]

const unemploymentData = [
  { period: '2024Q1', value: 4.5 },
  { period: '2024Q2', value: 4.4 },
  { period: '2024Q3', value: 4.3 },
  { period: '2024Q4', value: 4.2 },
  { period: '2025Q1', value: 4.1 },
  { period: '2025Q2', value: 4.2 },
]

const youthUnemploymentData = [
  { period: '2024Q1', value: 10.2 },
  { period: '2024Q2', value: 9.8 },
  { period: '2024Q3', value: 9.5 },
  { period: '2024Q4', value: 9.3 },
  { period: '2025Q1', value: 9.1 },
  { period: '2025Q2', value: 9.4 },
]

const inflationData = [
  { period: '2024Q1', value: 2.8 },
  { period: '2024Q2', value: 2.6 },
  { period: '2024Q3', value: 2.5 },
  { period: '2024Q4', value: 2.4 },
  { period: '2025Q1', value: 2.3 },
  { period: '2025Q2', value: 2.3 },
]

const charts = [
  { title: 'GDP Growth (%)', data: gdpData, color: CHART_COLORS[0] },
  { title: 'GNI* Growth (%)', data: gniStarData, color: CHART_COLORS[1] },
  { title: 'Modified Domestic Demand (%)', data: mddData, color: CHART_COLORS[2] },
  { title: 'Unemployment Rate (%)', data: unemploymentData, color: CHART_COLORS[3] },
  { title: 'Youth Unemployment (%)', data: youthUnemploymentData, color: CHART_COLORS[4] },
  { title: 'Inflation Rate (%)', data: inflationData, color: CHART_COLORS[5] },
]

const dotStyle = (color) => ({ r: 4, fill: color })

export default function Dashboard() {
  return (
    <PageWrapper title="Dashboard">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="GDP Growth" value="2.1%" subtitle="Q4 2025 YoY" icon={TrendingUp} color="sky" />
        <KpiCard title="GNI* Growth" value="3.0%" subtitle="Q4 2025 YoY" icon={Activity} color="emerald" />
        <KpiCard title="Mod. Domestic Demand" value="1.9%" subtitle="Q4 2025 YoY" icon={BarChart3} color="indigo" />
        <KpiCard title="Unemployment" value="4.2%" subtitle="Feb 2026" icon={Users} color="amber" />
        <KpiCard title="Youth Unemployment" value="9.4%" subtitle="Feb 2026" icon={UserX} color="rose" />
        <KpiCard title="Inflation (HICP)" value="2.3%" subtitle="Feb 2026" icon={DollarSign} color="violet" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Key Indicators</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {charts.map((chart) => (
            <ChartCard key={chart.title} title={chart.title}>
              <LineChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="period" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_STROKE} />
                <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_STROKE} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chart.color}
                  strokeWidth={2}
                  dot={dotStyle(chart.color)}
                />
              </LineChart>
            </ChartCard>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
