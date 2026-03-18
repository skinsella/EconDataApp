import { fetchEurostatData, fetchEurostatMultiGeo, fetchEurostatMultiDim } from './eurostat'
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

// ═══════════════════════════════════════════════════════════════════════
// PEER COMPARISONS
// ═══════════════════════════════════════════════════════════════════════

const PEER_GEOS = ['IE', 'EA20', 'EU27_2020', 'DE', 'NL', 'FR']
const GEO_LABELS = { IE: 'Ireland', EA20: 'Euro Area', EU27_2020: 'EU 27', DE: 'Germany', NL: 'Netherlands', FR: 'France' }

function tagGeo(data) {
  return data.map(d => ({ ...d, geoLabel: GEO_LABELS[d.geo] || d.geo }))
}

export async function fetchUnemploymentComparison() {
  const data = await fetchEurostatMultiGeo('une_rt_m', {
    geo: PEER_GEOS, age: 'TOTAL', sex: 'T', unit: 'PC_ACT', s_adj: 'SA',
    sinceTimePeriod: '2022-01',
  })
  return tagGeo(data).map(d => ({ ...d, period: fmtMonth(d.period), value: round1(d.value) }))
}

export async function fetchInflationComparison() {
  const data = await fetchEurostatMultiGeo('prc_hicp_manr', {
    geo: PEER_GEOS, coicop: 'CP00', sinceTimePeriod: '2022-01',
  })
  return tagGeo(data).map(d => ({ ...d, period: fmtMonth(d.period), value: round1(d.value) }))
}

export async function fetchGDPGrowthComparison() {
  const data = await fetchEurostatMultiGeo('namq_10_gdp', {
    geo: PEER_GEOS, unit: 'CLV_PCH_SM', s_adj: 'SCA', na_item: 'B1GQ',
    sinceTimePeriod: '2020-Q1',
  })
  return tagGeo(data).map(d => ({ ...d, period: fmtQuarter(d.period), value: round1(d.value) }))
}

export async function fetchDebtComparison() {
  const data = await fetchEurostatMultiGeo('gov_10dd_edpt1', {
    geo: PEER_GEOS, na_item: 'GD', sector: 'S13', unit: 'PC_GDP',
    sinceTimePeriod: '2015',
  })
  return tagGeo(data).map(d => ({ ...d, value: round1(d.value) }))
}

export async function fetchBondYieldComparison() {
  const data = await fetchEurostatMultiGeo('irt_lt_mcby_m', {
    geo: ['IE', 'EA20', 'DE', 'FR', 'NL'], int_rt: 'MCBY',
    sinceTimePeriod: '2022-01',
  })
  return tagGeo(data).map(d => ({ ...d, period: fmtMonth(d.period), value: round2(d.value) }))
}

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC FINANCES (% of GNI, not GDP)
// Ireland's GDP is distorted by multinational activity. We fetch absolute
// values in MIO_EUR and divide by GNI from World Bank (same approach as
// fetchFiscalAsPercentGNI). GNI* would be ideal but is CSO-specific.
// ═══════════════════════════════════════════════════════════════════════

// Helper: get GNI map (period → MIO_EUR)
async function getGNIMap() {
  const gniRaw = await fetchWorldBankData('IRL', 'NY.GNP.MKTP.CN', 2015, 2025)
  return new Map(gniRaw.map(d => [d.period, d.value / 1e6]))
}

// Tax revenue by type (% GNI, annual)
export async function fetchTaxRevenue() {
  const items = ['D2_D5_D91', 'D2', 'D5', 'D61']
  const [gniMap, ...taxResults] = await Promise.all([
    getGNIMap(),
    ...items.map(na_item =>
      fetchEurostatData('gov_10a_taxag', {
        geo: 'IE', na_item, sector: 'S13', unit: 'MIO_NAC', sinceTimePeriod: '2015',
      })
    ),
  ])

  return items.flatMap((na_item, i) =>
    taxResults[i]
      .filter(d => gniMap.has(d.period) && gniMap.get(d.period) > 0)
      .map(d => ({
        period: d.period,
        value: round1((d.value / gniMap.get(d.period)) * 100),
        category: na_item,
      }))
  )
}

const TAX_LABELS = {
  D2_D5_D91: 'Total Tax',
  D2: 'Production & Import Taxes',
  D5: 'Income & Wealth Taxes',
  D61: 'Social Contributions',
}
export { TAX_LABELS }

// Government spending by COFOG function (% GNI, annual)
export async function fetchGovSpending() {
  const cofogs = ['TOTAL', 'GF01', 'GF04', 'GF07', 'GF09', 'GF10']
  const [gniMap, ...spendResults] = await Promise.all([
    getGNIMap(),
    ...cofogs.map(cofog99 =>
      fetchEurostatData('gov_10a_exp', {
        geo: 'IE', cofog99, na_item: 'TE', sector: 'S13', unit: 'MIO_NAC',
        sinceTimePeriod: '2015',
      })
    ),
  ])

  return cofogs.flatMap((cofog99, i) =>
    spendResults[i]
      .filter(d => gniMap.has(d.period) && gniMap.get(d.period) > 0)
      .map(d => ({
        period: d.period,
        value: round1((d.value / gniMap.get(d.period)) * 100),
        cofog: cofog99,
      }))
  )
}

const COFOG_LABELS = {
  TOTAL: 'Total Expenditure',
  GF01: 'General Public Services',
  GF04: 'Economic Affairs',
  GF07: 'Health',
  GF09: 'Education',
  GF10: 'Social Protection',
}
export { COFOG_LABELS }

// ═══════════════════════════════════════════════════════════════════════
// STRUCTURAL INDICATORS
// ═══════════════════════════════════════════════════════════════════════

// Old-age dependency ratio (annual)
export async function fetchDependencyRatio() {
  const data = await fetchEurostatData('demo_pjanind', {
    geo: 'IE', indic_de: 'DEPRATIO1', sinceTimePeriod: '2010',
  })
  return data.map(d => ({ period: d.period, value: round1(d.value) }))
}

// Proportion aged 65+ (annual)
export async function fetchAged65Plus() {
  const data = await fetchEurostatData('demo_pjanind', {
    geo: 'IE', indic_de: 'PC_Y65_MAX', sinceTimePeriod: '2010',
  })
  return data.map(d => ({ period: d.period, value: round1(d.value) }))
}

// Dependency ratio comparison across countries
export async function fetchDependencyComparison() {
  const data = await fetchEurostatMultiGeo('demo_pjanind', {
    geo: PEER_GEOS, indic_de: 'PC_Y65_MAX', sinceTimePeriod: '2015',
  })
  return tagGeo(data).map(d => ({ ...d, value: round1(d.value) }))
}

// At-risk-of-poverty rate (annual, %)
export async function fetchPovertyRate() {
  const data = await fetchEurostatData('ilc_li02', {
    geo: 'IE', indic_il: 'LI_R_MD60', sex: 'T', age: 'TOTAL', unit: 'PC',
    sinceTimePeriod: '2015',
  })
  return data.map(d => ({ period: d.period, value: round1(d.value) }))
}

// Poverty comparison
export async function fetchPovertyComparison() {
  const data = await fetchEurostatMultiGeo('ilc_li02', {
    geo: PEER_GEOS, indic_il: 'LI_R_MD60', sex: 'T', age: 'TOTAL', unit: 'PC',
    sinceTimePeriod: '2020',
  })
  return tagGeo(data).map(d => ({ ...d, value: round1(d.value) }))
}

// Labour cost index (quarterly, YoY % change)
export async function fetchLabourCostIndex() {
  const data = await fetchEurostatData('lc_lci_r2_q', {
    geo: 'IE', lcstruct: 'D1_D4_MD5', nace_r2: 'B-S',
    s_adj: 'SCA', unit: 'PCH_SM', sinceTimePeriod: '2020-Q1',
  })
  return data.map(d => ({ period: fmtQuarter(d.period), value: round1(d.value) }))
}

// Labour cost comparison
export async function fetchLabourCostComparison() {
  const data = await fetchEurostatMultiGeo('lc_lci_r2_q', {
    geo: ['IE', 'EA20', 'DE', 'NL', 'FR'], lcstruct: 'D1_D4_MD5', nace_r2: 'B-S',
    s_adj: 'SCA', unit: 'I20', sinceTimePeriod: '2020-Q1',
  })
  return tagGeo(data).map(d => ({ ...d, period: fmtQuarter(d.period), value: round1(d.value) }))
}

// Electricity prices for households (half-yearly, EUR/kWh)
export async function fetchElectricityPrices() {
  const data = await fetchEurostatData('nrg_pc_204', {
    geo: 'IE', nrg_cons: 'TOT_KWH', tax: 'I_TAX', currency: 'EUR',
    sinceTimePeriod: '2020',
  })
  return data.map(d => ({ period: d.period, value: round2(d.value) }))
}

// Electricity price comparison
export async function fetchElectricityComparison() {
  const data = await fetchEurostatMultiGeo('nrg_pc_204', {
    geo: ['IE', 'EA20', 'EU27_2020', 'DE', 'NL', 'FR'],
    nrg_cons: 'TOT_KWH', tax: 'I_TAX', currency: 'EUR',
    sinceTimePeriod: '2022',
  })
  return tagGeo(data).map(d => ({ ...d, value: round2(d.value) }))
}

// FDI inward positions (annual, MIO_EUR)
export async function fetchFDIInward() {
  const data = await fetchEurostatData('bop_fdi6_pos', {
    geo: 'IE', partner: 'WRL_REST', currency: 'MIO_EUR', nace_r2: 'TOTAL',
    counterp: 'IMM', entity: 'TOTAL', stk_flow: 'NI', fdi_item: 'DI__D__F',
    sinceTimePeriod: '2015',
  })
  return data.map(d => ({ period: d.period, value: Math.round(d.value) }))
}

// ═══════════════════════════════════════════════════════════════════════
// CONFIDENCE & SENTIMENT (Leading Indicators)
// ═══════════════════════════════════════════════════════════════════════

// Consumer Confidence Indicator (monthly, balance, SA)
export async function fetchConsumerConfidence() {
  const data = await fetchEurostatData('ei_bsco_m', {
    geo: 'IE', indic: 'BS-CSMCI-BAL', s_adj: 'SA',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// Economic Sentiment Indicator (monthly, SA)
export async function fetchEconomicSentiment() {
  const data = await fetchEurostatData('ei_bssi_m_r2', {
    geo: 'IE', indic: 'BS-ESI-I', s_adj: 'SA',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// Industrial Confidence (monthly, balance, SA)
export async function fetchIndustrialConfidence() {
  const data = await fetchEurostatData('ei_bssi_m_r2', {
    geo: 'IE', indic: 'BS-ICI-BAL', s_adj: 'SA',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// Services Confidence (monthly, balance, SA)
export async function fetchServicesConfidence() {
  const data = await fetchEurostatData('ei_bssi_m_r2', {
    geo: 'IE', indic: 'BS-SCI-BAL', s_adj: 'SA',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// Construction Confidence (monthly, balance, SA)
export async function fetchConstructionConfidence() {
  const data = await fetchEurostatData('ei_bssi_m_r2', {
    geo: 'IE', indic: 'BS-CCI-BAL', s_adj: 'SA',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// Retail Trade Volume (monthly, SA, index 2015=100)
export async function fetchRetailTrade() {
  const data = await fetchEurostatData('sts_trtu_m', {
    geo: 'IE', nace_r2: 'G47', s_adj: 'SCA', unit: 'I15',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// Industrial Production Index (monthly, SA, index 2015=100)
export async function fetchIndustrialProduction() {
  const data = await fetchEurostatData('sts_inpr_m', {
    geo: 'IE', nace_r2: 'B-D', s_adj: 'SCA', unit: 'I15',
    sinceTimePeriod: '2020-01',
  })
  return data.map(d => ({ period: fmtMonth(d.period), value: round1(d.value) }))
}

// Consumer confidence comparison
export async function fetchConsumerConfidenceComparison() {
  const data = await fetchEurostatMultiGeo('ei_bsco_m', {
    geo: ['IE', 'EA20', 'EU27_2020', 'DE', 'NL', 'FR'],
    indic: 'BS-CSMCI-BAL', s_adj: 'SA',
    sinceTimePeriod: '2022-01',
  })
  return tagGeo(data).map(d => ({ ...d, period: fmtMonth(d.period), value: round1(d.value) }))
}

// ESI comparison
export async function fetchSentimentComparison() {
  const data = await fetchEurostatMultiGeo('ei_bssi_m_r2', {
    geo: ['IE', 'EA20', 'EU27_2020', 'DE', 'NL', 'FR'],
    indic: 'BS-ESI-I', s_adj: 'SA',
    sinceTimePeriod: '2022-01',
  })
  return tagGeo(data).map(d => ({ ...d, period: fmtMonth(d.period), value: round1(d.value) }))
}
