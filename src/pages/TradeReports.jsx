import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ReportCard } from '@/components/ReportCard'
import { ChartCard } from '@/components/ChartCard'
import { TRADE_REPORTS, CHART_COLORS } from '@/lib/constants'

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

export default function TradeReports() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredReports =
    activeFilter === 'All'
      ? TRADE_REPORTS
      : TRADE_REPORTS.filter((r) => r.source === activeFilter)

  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Trade Reports</h1>
        <p className="text-slate-500 mt-1">Global and EU trade analysis and outlook</p>
      </div>

      <ChartCard title="Ireland Trade as % of GDP" subtitle="Total trade (exports + imports)">
        <LineChart data={tradeGdpData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={{ r: 4, fill: CHART_COLORS[1] }}
          />
        </LineChart>
      </ChartCard>

      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
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
    </motion.div>
  )
}
