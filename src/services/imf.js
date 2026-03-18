import { fetchWithCache } from './api'

const BASE_URL = 'https://www.imf.org/external/datamapper/api/v1'

/**
 * Fetch IMF World Economic Outlook data for a country.
 * The WEO DataMapper API returns historical data AND forecasts (out to ~2029).
 *
 * indicator examples:
 *   NGDP_RPCH  — GDP growth (%)
 *   PCPIPCH    — Inflation (avg consumer prices, %)
 *   LUR        — Unemployment rate (%)
 *   GGXCNL_NGDP — Fiscal balance (% GDP)
 *   GGXWDG_NGDP — Gross govt debt (% GDP)
 *   BCA_NGDPD  — Current account balance (% GDP)
 *
 * Returns { period, value }[] sorted by period.
 * Forecast years (beyond current year) are flagged with `forecast: true`.
 */
export async function fetchIMFData(indicator, country = 'IRL') {
  const url = `${BASE_URL}/${indicator}/${country}`
  const raw = await fetchWithCache(url)

  // Response structure: { values: { INDICATOR: { COUNTRY: { "2020": val, ... } } } }
  const indicatorData = raw?.values?.[indicator]?.[country]
  if (!indicatorData) return []

  const currentYear = new Date().getFullYear()

  return Object.entries(indicatorData)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([year, value]) => ({
      period: year,
      value: Math.round(value * 100) / 100,
      forecast: parseInt(year) > currentYear,
    }))
    .sort((a, b) => (a.period < b.period ? -1 : 1))
}

/**
 * Fetch multiple IMF indicators for one country in parallel.
 * Returns an object keyed by indicator code.
 */
export async function fetchIMFMultiple(indicators, country = 'IRL') {
  const results = await Promise.allSettled(
    indicators.map((ind) => fetchIMFData(ind, country))
  )

  const out = {}
  indicators.forEach((ind, i) => {
    if (results[i].status === 'fulfilled') {
      out[ind] = results[i].value
    }
  })
  return out
}

// WEO indicator codes
export const IMF_INDICATORS = {
  GDP_GROWTH: 'NGDP_RPCH',
  INFLATION: 'PCPIPCH',
  UNEMPLOYMENT: 'LUR',
  FISCAL_BALANCE: 'GGXCNL_NGDP',
  GOVT_DEBT: 'GGXWDG_NGDP',
  CURRENT_ACCOUNT: 'BCA_NGDPD',
}

export const IMF_LABELS = {
  NGDP_RPCH: 'GDP Growth',
  PCPIPCH: 'Inflation',
  LUR: 'Unemployment',
  GGXCNL_NGDP: 'Fiscal Balance',
  GGXWDG_NGDP: 'Government Debt',
  BCA_NGDPD: 'Current Account',
}

export const IMF_UNITS = {
  NGDP_RPCH: '%',
  PCPIPCH: '%',
  LUR: '%',
  GGXCNL_NGDP: '% GDP',
  GGXWDG_NGDP: '% GDP',
  BCA_NGDPD: '% GDP',
}
