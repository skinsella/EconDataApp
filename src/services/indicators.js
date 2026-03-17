import { fetchEurostatData } from './eurostat'
import { fetchWorldBankData } from './worldbank'

/**
 * Centralised indicator fetchers.
 * Each function returns an array of { period, value } from a real, verifiable source.
 * No fabricated data — if the API fails, the caller gets an error.
 */

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function fmtMonth(p) {
  const m = p.match(/(\d{4})[M-](\d{2})/)
  if (m) return `${MONTH_NAMES[parseInt(m[2],10)-1]} ${m[1]}`
  return p
}

function fmtQuarter(p) {
  const m = p.match(/(\d{4})[- ]?Q(\d)/)
  if (m) return `Q${m[2]} ${m[1]}`
  return p
}

function round1(v) {
  return Math.round(v * 10) / 10
}

// ── GDP Growth (YoY %, quarterly) ── Eurostat namq_10_gdp ──────────────
export async function fetchGDPGrowth() {
  const data = await fetchEurostatData('namq_10_gdp', {
    geo: 'IE',
    unit: 'CLV_PCH_SM',
    s_adj: 'SCA',
    na_item: 'B1GQ',
    sinceTimePeriod: '2020-Q1',
  })
  return data.map(d => ({ period: fmtQuarter(d.period), value: round1(d.value) }))
}

// ── Unemployment Rate (monthly %, SA) ── Eurostat une_rt_m ─────────────
export async function fetchUnemploymentRate() {
  const data = await fetchEurostatData('une_rt_m', {
    geo: 'IE',
    age: 'TOTAL',
    sex: 'T',
    unit: 'PC_ACT',
    s_adj: 'SA',
    sinceTimePeriod: '2022-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// ── Youth Unemployment (under 25, monthly %, SA) ── Eurostat une_rt_m ──
export async function fetchYouthUnemployment() {
  const data = await fetchEurostatData('une_rt_m', {
    geo: 'IE',
    age: 'Y_LT25',
    sex: 'T',
    unit: 'PC_ACT',
    s_adj: 'SA',
    sinceTimePeriod: '2022-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// ── HICP Inflation (annual rate of change, monthly) ── Eurostat prc_hicp_manr
export async function fetchHICPInflation() {
  const data = await fetchEurostatData('prc_hicp_manr', {
    geo: 'IE',
    coicop: 'CP00',
    sinceTimePeriod: '2022-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// ── House Price Index (quarterly, 2015=100) ── Eurostat prc_hpi_q ──────
export async function fetchHousePriceIndex() {
  const data = await fetchEurostatData('prc_hpi_q', {
    geo: 'IE',
    purchase: 'TOTAL',
    unit: 'I15_Q',
    sinceTimePeriod: '2018-Q1',
  })
  return data.map(d => ({ period: fmtQuarter(d.period), value: round1(d.value) }))
}

// ── Fiscal ratios as % of GNI (not GDP) ── Eurostat ────────────────────
// Ireland's GDP is distorted by multinational activity. GNI is a better
// denominator. GNI* (CSO-specific) would be even better but is not
// available from Eurostat. We fetch GNI from nama_10_gdp (B5G), and
// gov debt/balance in absolute EUR from gov_10dd_edpt1, then compute ratios.

export async function fetchFiscalAsPercentGNI() {
  // GNI from World Bank (NY.GNP.MKTP.CN = current LCU = EUR for Ireland)
  // Debt & balance from Eurostat in MIO_EUR
  const [gniRaw, debtData, balData] = await Promise.all([
    fetchWorldBankData('IRL', 'NY.GNP.MKTP.CN', 2015, 2025),
    fetchEurostatData('gov_10dd_edpt1', {
      geo: 'IE', na_item: 'GD', sector: 'S13', unit: 'MIO_EUR', sinceTimePeriod: '2015',
    }),
    fetchEurostatData('gov_10dd_edpt1', {
      geo: 'IE', na_item: 'B9', sector: 'S13', unit: 'MIO_EUR', sinceTimePeriod: '2015',
    }),
  ])

  // World Bank returns GNI in EUR units; convert to MIO_EUR to match Eurostat
  const gniMap = new Map(gniRaw.map(d => [d.period, d.value / 1e6]))

  const debtPctGNI = debtData
    .filter(d => gniMap.has(d.period) && gniMap.get(d.period) > 0)
    .map(d => ({ period: d.period, value: round1((d.value / gniMap.get(d.period)) * 100) }))

  const balPctGNI = balData
    .filter(d => gniMap.has(d.period) && gniMap.get(d.period) > 0)
    .map(d => ({ period: d.period, value: round1((d.value / gniMap.get(d.period)) * 100) }))

  return { debtPctGNI, balPctGNI }
}

// Keep the old GDP-based versions as fallbacks
export async function fetchGovBalance() {
  const data = await fetchEurostatData('gov_10dd_edpt1', {
    geo: 'IE', na_item: 'B9', sector: 'S13', unit: 'PC_GDP', sinceTimePeriod: '2015',
  })
  return data.map(d => ({ period: d.period, value: round1(d.value) }))
}

export async function fetchGovDebt() {
  const data = await fetchEurostatData('gov_10dd_edpt1', {
    geo: 'IE', na_item: 'GD', sector: 'S13', unit: 'PC_GDP', sinceTimePeriod: '2015',
  })
  return data.map(d => ({ period: d.period, value: round1(d.value) }))
}

// ── Trade as % of GDP (annual) ── World Bank ───────────────────────────
export async function fetchTradeToGDP() {
  const data = await fetchWorldBankData('IRL', 'NE.TRD.GNFS.ZS', 2010, 2025)
  return data.map(d => ({ period: d.period, value: round1(d.value) }))
}

// ── GDP per capita (current US$, annual) ── World Bank ─────────────────
export async function fetchGDPPerCapita() {
  const data = await fetchWorldBankData('IRL', 'NY.GDP.PCAP.CD', 2010, 2025)
  return data.map(d => ({ period: d.period, value: Math.round(d.value) }))
}
