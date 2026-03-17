import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ReportCard } from '@/components/ReportCard'
import { ChartCard } from '@/components/ChartCard'
import { PageWrapper } from '@/components/PageWrapper'
import { TRADE_REPORTS, CHART_COLORS, CHART_AXIS_TICK, CHART_AXIS_STROKE, CHART_GRID_STROKE } from '@/lib/constants'

const filters = ['All', 'wto', 'imf', 'eu_trade']
const filterLabels = { All: 'All', wto: 'WTO', imf: 'IMF', eu_trade: 'EU Trade' }

const tradeGdpData = [
  { year: '2019', value: 220 },
  { year: '2020', value: 210 },
  { year: '2021', value: 230 },
  { year: '2022', value: 240 },
  { year: '2023', value: 235 },
  { year: '2024', value: 245 },
]

const tradeDotStyle = { r: 4, fill: CHART_COLORS[1] }

export default function TradeReports() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredReports =
    activeFilter === 'All'
      ? TRADE_REPORTS
      : TRADE_REPORTS.filter((r) => r.source === activeFilter)

  return (
    <PageWrapper title="Trade Reports">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Trade Reports</h1>
        <p className="text-slate-500 mt-1">Global and EU trade analysis and outlook</p>
      </div>

      <ChartCard title="Ireland Trade as % of GDP" subtitle="Total trade (exports + imports)">
        <LineChart data={tradeGdpData}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
          <XAxis dataKey="year" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_STROKE} />
          <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_STROKE} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={tradeDotStyle}
          />
        </LineChart>
      </ChartCard>

      <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter reports by source">
        {filters.map((f) => (
          <button
            key={f}
            aria-pressed={activeFilter === f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-500">
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <ReportCard key={report.title} report={report} />
        ))}
      </div>
    </PageWrapper>
  )
}
