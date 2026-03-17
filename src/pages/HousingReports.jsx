import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Home, TrendingUp, ArrowUpDown } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { ReportCard } from '@/components/ReportCard'
import { HOUSING_REPORTS, CHART_COLORS } from '@/lib/constants'

const housePriceIndexData = [
  { year: '2020', value: 100 },
  { year: '2021', value: 108 },
  { year: '2022', value: 121 },
  { year: '2023', value: 128 },
  { year: '2024', value: 136 },
  { year: '2025', value: 143 },
]

export default function HousingReports() {
  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Housing Reports</h1>
        <p className="text-slate-500 mt-1">Residential property data and analysis for Ireland</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Median Price"
          value="\u20AC350,000"
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
        <LineChart data={housePriceIndexData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[4]}
            strokeWidth={2}
            dot={{ r: 4, fill: CHART_COLORS[4] }}
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
    </motion.div>
  )
}
