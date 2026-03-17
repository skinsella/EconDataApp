import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { TrendingUp, Users, UserX, DollarSign, Home, Landmark, Activity, BarChart3 } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { CHART_COLORS } from '@/lib/constants'

const tabs = ['Macro', 'Employment', 'Prices', 'Housing', 'Fiscal']

const macroGdpData = [
  { period: '2023Q1', gdp: 1.2, gniStar: 2.5, mdd: 0.8 },
  { period: '2023Q2', gdp: 1.5, gniStar: 2.2, mdd: 1.0 },
  { period: '2023Q3', gdp: 1.8, gniStar: 2.8, mdd: 1.3 },
  { period: '2023Q4', gdp: 1.6, gniStar: 2.6, mdd: 1.1 },
  { period: '2024Q1', gdp: 1.8, gniStar: 3.2, mdd: 1.5 },
  { period: '2024Q2', gdp: 2.0, gniStar: 2.8, mdd: 1.7 },
  { period: '2024Q3', gdp: 1.9, gniStar: 3.1, mdd: 1.6 },
  { period: '2024Q4', gdp: 2.1, gniStar: 2.9, mdd: 1.8 },
]

const employmentData = [
  { period: '2023Q1', unemployment: 4.8, youth: 10.8 },
  { period: '2023Q2', unemployment: 4.6, youth: 10.5 },
  { period: '2023Q3', unemployment: 4.5, youth: 10.3 },
  { period: '2023Q4', unemployment: 4.4, youth: 10.1 },
  { period: '2024Q1', unemployment: 4.5, youth: 10.2 },
  { period: '2024Q2', unemployment: 4.4, youth: 9.8 },
  { period: '2024Q3', unemployment: 4.3, youth: 9.5 },
  { period: '2024Q4', unemployment: 4.2, youth: 9.3 },
]

const pricesData = [
  { period: '2023Q1', value: 6.2 }, { period: '2023Q2', value: 5.4 },
  { period: '2023Q3', value: 4.5 }, { period: '2023Q4', value: 3.8 },
  { period: '2024Q1', value: 3.2 }, { period: '2024Q2', value: 2.8 },
  { period: '2024Q3', value: 2.5 }, { period: '2024Q4', value: 2.3 },
]

const housePriceData = [
  { period: '2020', value: 100 }, { period: '2021', value: 108 },
  { period: '2022', value: 120 }, { period: '2023', value: 128 },
  { period: '2024', value: 135 }, { period: '2025', value: 143 },
]

const fiscalData = [
  { period: '2020', value: -5.1 }, { period: '2021', value: -3.8 },
  { period: '2022', value: -1.5 }, { period: '2023', value: 0.2 },
  { period: '2024', value: 0.8 }, { period: '2025', value: 1.2 },
]

const tabContent = {
  Macro: {
    kpis: [
      { title: 'GDP Growth', value: '2.1%', subtitle: 'Q4 2024 YoY', icon: TrendingUp, color: 'sky' },
      { title: 'GNI* Growth', value: '2.9%', subtitle: 'Q4 2024 YoY', icon: Activity, color: 'emerald' },
      { title: 'Mod. Domestic Demand', value: '1.8%', subtitle: 'Q4 2024 YoY', icon: BarChart3, color: 'indigo' },
    ],
    chart: { title: 'GDP, GNI* & Modified Domestic Demand (%)', data: macroGdpData, multiLine: true,
      lines: [
        { dataKey: 'gdp', label: 'GDP', color: CHART_COLORS[0] },
        { dataKey: 'gniStar', label: 'GNI*', color: CHART_COLORS[1] },
        { dataKey: 'mdd', label: 'MDD', color: CHART_COLORS[2] },
      ],
    },
  },
  Employment: {
    kpis: [
      { title: 'Unemployment Rate', value: '4.2%', subtitle: 'Feb 2026', icon: Users, color: 'amber' },
      { title: 'Youth Unemployment', value: '9.3%', subtitle: 'Q4 2024', icon: UserX, color: 'rose' },
      { title: 'Labour Force', value: '2.71M', subtitle: 'Q4 2025', icon: Users, color: 'blue' },
    ],
    chart: { title: 'Unemployment & Youth Unemployment (%)', data: employmentData, multiLine: true,
      lines: [
        { dataKey: 'unemployment', label: 'Overall', color: CHART_COLORS[1] },
        { dataKey: 'youth', label: 'Youth (15-24)', color: CHART_COLORS[4] },
      ],
    },
  },
  Prices: {
    kpis: [
      { title: 'HICP Inflation', value: '2.3%', subtitle: 'Feb 2026', icon: DollarSign, color: 'rose' },
      { title: 'CPI Annual Change', value: '2.1%', subtitle: 'Feb 2026', icon: DollarSign, color: 'orange' },
    ],
    chart: { title: 'CPI / HICP Inflation (%)', data: pricesData, color: CHART_COLORS[2] },
  },
  Housing: {
    kpis: [
      { title: 'House Price Index', value: '143.0', subtitle: 'Base 2020 = 100', icon: Home, color: 'violet' },
      { title: 'Annual Change', value: '+6.2%', subtitle: 'Feb 2026', icon: Home, color: 'cyan' },
    ],
    chart: { title: 'House Price Index (2020=100)', data: housePriceData, color: CHART_COLORS[4] },
  },
  Fiscal: {
    kpis: [
      { title: 'Government Balance', value: '+1.2%', subtitle: '% of GDP, 2025', icon: Landmark, color: 'green' },
      { title: 'Debt-to-GDP', value: '42%', subtitle: '2025 est.', icon: Landmark, color: 'slate' },
    ],
    chart: { title: 'Government Balance (% of GDP)', data: fiscalData, color: CHART_COLORS[5] },
  },
}

export default function IrishEconomy() {
  const [activeTab, setActiveTab] = useState('Macro')
  const content = tabContent[activeTab]

  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Irish Economic Overview</h1>
        <p className="text-slate-500 mt-1">Key indicators for the Irish economy</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <ChartCard title={content.chart.title}>
        <LineChart data={content.chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          {content.chart.multiLine ? (
            <>
              <Legend />
              {content.chart.lines.map((line) => (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.label}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: line.color }}
                />
              ))}
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={content.chart.color}
              strokeWidth={2}
              dot={{ r: 4, fill: content.chart.color }}
            />
          )}
        </LineChart>
      </ChartCard>
    </motion.div>
  )
}
