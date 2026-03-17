import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Home, TrendingUp, ArrowUpDown } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { ReportCard } from '@/components/ReportCard'
import { PageWrapper } from '@/components/PageWrapper'
import { HOUSING_REPORTS, CHART_COLORS, CHART_AXIS_TICK, CHART_AXIS_STROKE, CHART_GRID_STROKE, HOUSE_PRICE_INDEX_DATA } from '@/lib/constants'

const housingDotStyle = { r: 4, fill: CHART_COLORS[4] }

export default function HousingReports() {
  return (
    <PageWrapper title="Housing Reports">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Housing Reports</h1>
        <p className="text-slate-500 mt-1">Residential property data and analysis for Ireland</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Median Price"
          value={"\u20AC350,000"}
          subtitle="National, Feb 2026"
          icon={Home}
          color="violet"
        />
        <KpiCard
          title="Annual Change"
          value="+6.2%"
          subtitle="YoY Feb 2026"
          icon={TrendingUp}
          color="emerald"
        />
        <KpiCard
          title="Transactions"
          value="4,200/mo"
          subtitle="Average monthly"
          icon={ArrowUpDown}
          color="sky"
        />
      </div>

      <ChartCard title="House Price Index" subtitle="National, base year 2020 = 100">
        <LineChart data={HOUSE_PRICE_INDEX_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
          <XAxis dataKey="period" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_STROKE} />
          <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_STROKE} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[4]}
            strokeWidth={2}
            dot={housingDotStyle}
          />
        </LineChart>
      </ChartCard>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Housing Reports</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {HOUSING_REPORTS.map((report) => (
            <ReportCard key={report.title} report={report} />
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
