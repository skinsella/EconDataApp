import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { TrendingUp, Users, UserX, DollarSign, Home, Landmark, Info } from 'lucide-react'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { Card, CardContent } from '@/components/ui/card'
import { CHART_COLORS } from '@/lib/constants'
import {
  fetchGDPGrowth,
  fetchUnemploymentRate,
  fetchYouthUnemployment,
  fetchHICPInflation,
  fetchHousePriceIndex,
  fetchGovBalance,
  fetchGovDebt,
} from '@/services/indicators'

const tabs = ['Macro', 'Employment', 'Prices', 'Housing', 'Fiscal']

export default function IrishEconomy() {
  const [activeTab, setActiveTab] = useState('Macro')
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      const fetchers = {
        gdp: fetchGDPGrowth,
        unemployment: fetchUnemploymentRate,
        youthUnemployment: fetchYouthUnemployment,
        hicp: fetchHICPInflation,
        housePrices: fetchHousePriceIndex,
        govBalance: fetchGovBalance,
        govDebt: fetchGovDebt,
      }

      const keys = Object.keys(fetchers)
      const results = await Promise.allSettled(keys.map((k) => fetchers[k]()))

      if (cancelled) return

      const newData = {}
      const newErrors = {}

      results.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          newData[keys[i]] = result.value
        } else {
          newErrors[keys[i]] =
            result.status === 'rejected'
              ? result.reason?.message || 'Unknown error'
              : 'No data available'
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
    const s = data[key]
    return s && s.length > 0 ? s[s.length - 1] : null
  }

  function slice(key, n) {
    const s = data[key]
    if (!s) return []
    return n ? s.slice(-n) : s
  }

  function renderTabContent() {
    switch (activeTab) {
      case 'Macro':
        return <MacroTab data={data} errors={errors} loading={loading} latest={latest} slice={slice} />
      case 'Employment':
        return <EmploymentTab data={data} errors={errors} loading={loading} latest={latest} slice={slice} />
      case 'Prices':
        return <PricesTab data={data} errors={errors} loading={loading} latest={latest} slice={slice} />
      case 'Housing':
        return <HousingTab data={data} errors={errors} loading={loading} latest={latest} slice={slice} />
      case 'Fiscal':
        return <FiscalTab data={data} errors={errors} loading={loading} latest={latest} slice={slice} />
      default:
        return null
    }
  }

  return (
    <motion.div
      className="p-8 space-y-8 overflow-y-auto h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Irish Economic Overview</h1>
        <p className="text-slate-500 mt-1">Live data from Eurostat for Ireland</p>
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

      {renderTabContent()}
    </motion.div>
  )
}

/* ── Tab components ─────────────────────────────────────────────────── */

function MacroTab({ errors, loading, latest, slice }) {
  const gdpLatest = latest('gdp')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="GDP Growth (YoY)"
          value={gdpLatest ? `${gdpLatest.value}%` : '\u2014'}
          subtitle={gdpLatest ? `${gdpLatest.period} \u00b7 Eurostat` : 'Loading\u2026'}
          icon={TrendingUp}
          color="sky"
          loading={loading}
        />
      </div>

      <Card className="border-sky-200 bg-sky-50">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
          <p className="text-sm text-sky-800">
            GNI* (Modified Gross National Income) and Modified Domestic Demand are Ireland-specific
            metrics published by the{' '}
            <a
              href="https://www.cso.ie/en/statistics/nationalaccounts/quarterlynationalaccounts/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              CSO Quarterly National Accounts
            </a>
            . They strip out the distorting effects of multinational activity on headline GDP.
          </p>
        </CardContent>
      </Card>

      <ChartCard
        title="GDP Growth (% YoY, quarterly)"
        subtitle="Source: Eurostat namq_10_gdp"
        loading={loading}
        error={errors.gdp}
      >
        <LineChart data={slice('gdp')}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-45} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="value" name="GDP Growth" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartCard>
    </div>
  )
}

function EmploymentTab({ errors, loading, latest, slice, data }) {
  const unemp = latest('unemployment')
  const youth = latest('youthUnemployment')

  // Merge unemployment and youth data by period for dual-line chart
  const merged = (() => {
    const uData = data.unemployment || []
    const yData = data.youthUnemployment || []
    const map = new Map()
    uData.forEach((d) => map.set(d.period, { period: d.period, unemployment: d.value }))
    yData.forEach((d) => {
      const existing = map.get(d.period) || { period: d.period }
      existing.youth = d.value
      map.set(d.period, existing)
    })
    return Array.from(map.values())
      .sort((a, b) => (a.period < b.period ? -1 : 1))
      .slice(-24)
  })()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          title="Unemployment Rate"
          value={unemp ? `${unemp.value}%` : '\u2014'}
          subtitle={unemp ? `${unemp.period} \u00b7 Eurostat` : 'Loading\u2026'}
          icon={Users}
          color="amber"
          loading={loading}
        />
        <KpiCard
          title="Youth Unemployment"
          value={youth ? `${youth.value}%` : '\u2014'}
          subtitle={youth ? `${youth.period} \u00b7 Eurostat` : 'Loading\u2026'}
          icon={UserX}
          color="rose"
          loading={loading}
        />
      </div>

      <ChartCard
        title="Unemployment Rates (%, monthly, SA)"
        subtitle="Source: Eurostat une_rt_m"
        loading={loading}
        error={errors.unemployment && errors.youthUnemployment ? errors.unemployment : undefined}
      >
        <LineChart data={merged}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-45} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="unemployment" name="Overall" stroke={CHART_COLORS[1]} strokeWidth={2} dot={{ r: 2 }} />
          <Line type="monotone" dataKey="youth" name="Youth (< 25)" stroke={CHART_COLORS[4]} strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ChartCard>
    </div>
  )
}

function PricesTab({ errors, loading, latest, slice }) {
  const hicp = latest('hicp')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          title="HICP Inflation"
          value={hicp ? `${hicp.value}%` : '\u2014'}
          subtitle={hicp ? `${hicp.period} \u00b7 Eurostat` : 'Loading\u2026'}
          icon={DollarSign}
          color="rose"
          loading={loading}
        />
      </div>

      <ChartCard
        title="HICP Annual Rate of Change (%, monthly)"
        subtitle="Source: Eurostat prc_hicp_manr"
        loading={loading}
        error={errors.hicp}
      >
        <LineChart data={slice('hicp', 36)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-45} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="value" name="HICP" stroke={CHART_COLORS[2]} strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ChartCard>
    </div>
  )
}

function HousingTab({ errors, loading, latest, slice }) {
  const hpi = latest('housePrices')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          title="House Price Index"
          value={hpi ? `${hpi.value}` : '\u2014'}
          subtitle={hpi ? `${hpi.period} \u00b7 Eurostat (2015=100)` : 'Loading\u2026'}
          icon={Home}
          color="violet"
          loading={loading}
        />
      </div>

      <ChartCard
        title="House Price Index (2015=100, quarterly)"
        subtitle="Source: Eurostat prc_hpi_q"
        loading={loading}
        error={errors.housePrices}
      >
        <LineChart data={slice('housePrices')}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="#94a3b8" angle={-45} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="value" name="HPI" stroke={CHART_COLORS[4]} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartCard>
    </div>
  )
}

function FiscalTab({ errors, loading, latest, slice, data }) {
  const bal = latest('govBalance')
  const debt = latest('govDebt')

  // Merge balance and debt by period
  const merged = (() => {
    const bData = data.govBalance || []
    const dData = data.govDebt || []
    const map = new Map()
    bData.forEach((d) => map.set(d.period, { period: d.period, balance: d.value }))
    dData.forEach((d) => {
      const existing = map.get(d.period) || { period: d.period }
      existing.debt = d.value
      map.set(d.period, existing)
    })
    return Array.from(map.values()).sort((a, b) => (a.period < b.period ? -1 : 1))
  })()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          title="Government Balance"
          value={bal ? `${bal.value > 0 ? '+' : ''}${bal.value}%` : '\u2014'}
          subtitle={bal ? `${bal.period} \u00b7 % GDP \u00b7 Eurostat` : 'Loading\u2026'}
          icon={Landmark}
          color="green"
          loading={loading}
        />
        <KpiCard
          title="Government Debt"
          value={debt ? `${debt.value}%` : '\u2014'}
          subtitle={debt ? `${debt.period} \u00b7 % GDP \u00b7 Eurostat` : 'Loading\u2026'}
          icon={Landmark}
          color="slate"
          loading={loading}
        />
      </div>

      <ChartCard
        title="Government Balance & Debt (% of GDP, annual)"
        subtitle="Source: Eurostat gov_10dd_edpt1"
        loading={loading}
        error={errors.govBalance && errors.govDebt ? errors.govBalance : undefined}
      >
        <LineChart data={merged}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="balance" name="Balance (% GDP)" stroke={CHART_COLORS[1]} strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="debt" name="Debt (% GDP)" stroke={CHART_COLORS[5]} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartCard>
    </div>
  )
}
