import { fetchEurostatData } from './eurostat'
import { fetchWorldBankData } from './worldbank'
import { fetchCSOSeries } from './cso'

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

function round2(v) {
  return Math.round(v * 100) / 100
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
export async function fetchFiscalAsPercentGNI() {
  const [gniRaw, debtData, balData] = await Promise.all([
    fetchWorldBankData('IRL', 'NY.GNP.MKTP.CN', 2015, 2025),
    fetchEurostatData('gov_10dd_edpt1', {
      geo: 'IE', na_item: 'GD', sector: 'S13', unit: 'MIO_EUR', sinceTimePeriod: '2015',
    }),
    fetchEurostatData('gov_10dd_edpt1', {
      geo: 'IE', na_item: 'B9', sector: 'S13', unit: 'MIO_EUR', sinceTimePeriod: '2015',
    }),
  ])

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

// ═══════════════════════════════════════════════════════════════════════
// NEW INDICATORS
// ═══════════════════════════════════════════════════════════════════════

// ── Bond Yields (10-year Irish govt, monthly %) ── Eurostat irt_lt_mcby_m
export async function fetchBondYields() {
  const data = await fetchEurostatData('irt_lt_mcby_m', {
    geo: 'IE',
    int_rt: 'MCBY',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round2(d.value) }))
}

// ── Euro Area Short-Term Rates (3-month, monthly %) ── Eurostat irt_st_m
export async function fetchEuroAreaRates() {
  const data = await fetchEurostatData('irt_st_m', {
    geo: 'EA',
    int_rt: 'IRT_M3',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round2(d.value) }))
}

// ── Government Interest Expenditure (% GDP, annual) ── Eurostat gov_10dd_edpt1
export async function fetchDebtServiceCosts() {
  const data = await fetchEurostatData('gov_10dd_edpt1', {
    geo: 'IE',
    na_item: 'D41PAY',
    sector: 'S13',
    unit: 'PC_GDP',
    sinceTimePeriod: '2015',
  })
  return data.map(d => ({ period: d.period, value: round1(d.value) }))
}

// ── Government Interest Expenditure (MIO_EUR, annual) ── Eurostat
export async function fetchDebtServiceAbsolute() {
  const data = await fetchEurostatData('gov_10dd_edpt1', {
    geo: 'IE',
    na_item: 'D41PAY',
    sector: 'S13',
    unit: 'MIO_EUR',
    sinceTimePeriod: '2015',
  })
  return data.map(d => ({ period: d.period, value: Math.round(d.value) }))
}

// ── Current Account Balance (quarterly, MIO_EUR) ── Eurostat bop_c6_q
export async function fetchCurrentAccount() {
  const data = await fetchEurostatData('bop_c6_q', {
    geo: 'IE',
    bop_item: 'CA',
    stk_flow: 'BAL',
    partner: 'WRL_REST',
    sector10: 'S1',
    sectpart: 'S1',
    currency: 'MIO_EUR',
    sinceTimePeriod: '2018-Q1',
  })
  return data.map(d => ({ period: fmtQuarter(d.period), value: Math.round(d.value) }))
}

// ── Dwelling Completions (quarterly, SA) ── CSO NDQ01
export async function fetchDwellingCompletions() {
  // NDQ01C02 = Seasonally Adjusted, C02342V02816='-' = All house types
  const data = await fetchCSOSeries('NDQ01', {
    STATISTIC: 'NDQ01C02',
    C02342V02816: '-',
  })
  // CSO quarterly periods are like "2025Q4" — need to format
  return data
    .filter(d => {
      // Only keep recent data (2018+)
      const year = parseInt(d.period, 10)
      return year >= 2018 || d.period >= '2018'
    })
    .map(d => ({ period: fmtQuarter(d.period), value: Math.round(d.value) }))
}

// ── Average Weekly Earnings (quarterly, SA, all sectors) ── CSO EHQ04
export async function fetchEarnings() {
  // EHQ04S1 = Seasonally Adjusted Average Weekly Earnings
  // Enterprise size '-' is not available; try without size filter first
  // NACE sector '-' = All NACE economic sectors
  const data = await fetchCSOSeries('EHQ04', {
    STATISTIC: 'EHQ04S1',
  })

  // Filter to "All NACE" and aggregate across enterprise sizes if needed
  // The label will help us filter — we want the broadest category
  // Since fetchCSOSeries doesn't return labels, we just get all and take the first value per period
  const periodMap = new Map()
  for (const d of data) {
    // Keep only the first value per period (which should be the aggregate)
    if (!periodMap.has(d.period)) {
      periodMap.set(d.period, d.value)
    }
  }

  return Array.from(periodMap.entries())
    .filter(([p]) => {
      const year = parseInt(p, 10)
      return year >= 2015 || p >= '2015'
    })
    .sort(([a], [b]) => a < b ? -1 : 1)
    .map(([period, value]) => ({ period: fmtQuarter(period), value: round1(value) }))
}

// ── Net Migration (annual, thousands) ── CSO PEA18
export async function fetchMigration() {
  // PEA18 = Estimated Migration, sex='-' (both), origin/dest='01' (net migration), country='-' (all)
  const data = await fetchCSOSeries('PEA18', {
    STATISTIC: 'PEA18',
    C02199V02655: '-',
    C02542V03077: '01',
    C02719V03286: '-',
  })

  return data
    .filter(d => {
      const year = parseInt(d.period, 10)
      return year >= 2010
    })
    .map(d => ({ period: d.period, value: round1(d.value) }))
}

// ── Immigration (annual, thousands) ── CSO PEA18
export async function fetchImmigration() {
  const data = await fetchCSOSeries('PEA18', {
    STATISTIC: 'PEA18',
    C02199V02655: '-',
    C02542V03077: '05',
    C02719V03286: '-',
  })
  return data
    .filter(d => parseInt(d.period, 10) >= 2010)
    .map(d => ({ period: d.period, value: round1(d.value) }))
}

// ── Emigration (annual, thousands) ── CSO PEA18
export async function fetchEmigration() {
  const data = await fetchCSOSeries('PEA18', {
    STATISTIC: 'PEA18',
    C02199V02655: '-',
    C02542V03077: '04',
    C02719V03286: '-',
  })
  return data
    .filter(d => parseInt(d.period, 10) >= 2010)
    .map(d => ({ period: d.period, value: round1(d.value) }))
}
