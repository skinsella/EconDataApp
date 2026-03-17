import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { TrendingUp, Users, UserX, DollarSign, Home, Landmark } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { CHART_COLORS } from '@/lib/constants'
import {
  fetchGDPGrowth,
  fetchUnemploymentRate,
  fetchYouthUnemployment,
  fetchHICPInflation,
  fetchHousePriceIndex,
  fetchGovBalance,
} from '@/services/indicators'

const INDICATORS = [
  { key: 'gdp', label: 'GDP Growth', unit: '%', icon: TrendingUp, color: 'sky', chartTitle: 'GDP Growth (% YoY)', fetcher: fetchGDPGrowth, source: 'Eurostat' },
  { key: 'unemployment', label: 'Unemployment', unit: '%', icon: Users, color: 'amber', chartTitle: 'Unemployment Rate (%)', fetcher: fetchUnemploymentRate, source: 'Eurostat' },
  { key: 'youthUnemployment', label: 'Youth Unemp.', unit: '%', icon: UserX, color: 'rose', chartTitle: 'Youth Unemployment Rate (%)', fetcher: fetchYouthUnemployment, source: 'Eurostat' },
  { key: 'hicp', label: 'Inflation (HICP)', unit: '%', icon: DollarSign, color: 'violet', chartTitle: 'HICP Inflation (% annual)', fetcher: fetchHICPInflation, source: 'Eurostat' },
  { key: 'housePrices', label: 'House Price Idx', unit: '', icon: Home, color: 'emerald', chartTitle: 'House Price Index (2015=100)', fetcher: fetchHousePriceIndex, source: 'Eurostat' },
  { key: 'govBalance', label: 'Gov. Balance', unit: '% GDP', icon: Landmark, color: 'green', chartTitle: 'Government Balance (% GDP)', fetcher: fetchGovBalance, source: 'Eurostat' },
]

export default function Dashboard() {
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      const results = await Promise.allSettled(
        INDICATORS.map((ind) => ind.fetcher())
      )

      if (cancelled) return

      const newData = {}
      const newErrors = {}

      results.forEach((result, i) => {
        const key = INDICATORS[i].key
        if (result.status === 'fulfilled' && result.value.length > 0) {
          newData[key] = result.value
        } else {
          newErrors[key] = result.status === 'rejected'
            ? `Failed to load: ${result.reason?.message || 'Unknown error'}`
            : 'No data available from source'
        }
      })

      setData(newData)
      setErrors(newErrors)
      setLoading(false)
    }

    loadAll()
    return () => { cancelled = true }
  }, [])

  function latest(key) {
    const series = data[key]
    if (!series || series.length === 0) return null
    return series[series.length - 1]
  }

  function chartSlice(key, n = 12) {
    const series = data[key]
    if (!series) return []
    return series.slice(-n)
  }

  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {INDICATORS.map((ind) => {
          const val = latest(ind.key)
          return (
            <KpiCard
              key={ind.key}
              title={ind.label}
              value={val ? `${val.value}${ind.unit}` : '\u2014'}
              subtitle={val ? `${val.period} \u00b7 ${ind.source}` : errors[ind.key] ? 'Unavailable' : 'Loading\u2026'}
              icon={ind.icon}
              color={ind.color}
              loading={loading}
            />
          )
        })}
      </div>

      {/* Charts */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Key Indicators \u2014 Ireland</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {INDICATORS.map((ind, i) => {
            const cd = chartSlice(ind.key)
            const hasError = !!errors[ind.key]
            const isLoading = loading && !data[ind.key]

            return (
              <ChartCard
                key={ind.key}
                title={ind.chartTitle}
                subtitle={`Source: ${ind.source}`}
                loading={isLoading}
                error={hasError ? errors[ind.key] : undefined}
              >
                <LineChart data={cd}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS[i]}
                    strokeWidth={2}
                    dot={{ r: 3, fill: CHART_COLORS[i] }}
                  />
                </LineChart>
              </ChartCard>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        All data sourced live from Eurostat. Last refresh: {format(new Date(), 'd MMM yyyy HH:mm')}.
      </p>
    </motion.div>
  )
}
