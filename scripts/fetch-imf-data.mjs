#!/usr/bin/env node
/**
 * Pre-fetch IMF World Economic Outlook data for Ireland.
 * Run before build: `node scripts/fetch-imf-data.mjs`
 *
 * The IMF DataMapper API does NOT support CORS, so we fetch at build time
 * and store as a static JSON file that the SPA can load.
 *
 * WEO data only changes twice a year (April & October), so this is fine.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'data')
const OUT_FILE = join(OUT_DIR, 'imf-weo.json')

const BASE_URL = 'https://www.imf.org/external/datamapper/api/v1'
const COUNTRY = 'IRL'

const INDICATORS = {
  NGDP_RPCH: 'GDP Growth',
  PCPIPCH: 'Inflation',
  LUR: 'Unemployment',
  GGXCNL_NGDP: 'Fiscal Balance',
  GGXWDG_NGDP: 'Government Debt',
  BCA_NGDPD: 'Current Account',
}

async function fetchIndicator(code) {
  const url = `${BASE_URL}/${code}/${COUNTRY}`
  console.log(`  Fetching ${code} ...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${code}: HTTP ${res.status}`)
  const json = await res.json()
  const yearData = json?.values?.[code]?.[COUNTRY]
  if (!yearData) throw new Error(`${code}: no data in response`)
  return yearData
}

async function main() {
  console.log('Fetching IMF WEO data for Ireland...')

  const currentYear = new Date().getFullYear()
  const result = {}

  for (const [code, label] of Object.entries(INDICATORS)) {
    try {
      const yearData = await fetchIndicator(code)
      result[code] = Object.entries(yearData)
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([year, value]) => ({
          period: year,
          value: Math.round(value * 100) / 100,
          forecast: parseInt(year) > currentYear,
        }))
        .sort((a, b) => (a.period < b.period ? -1 : 1))
      console.log(`  ✓ ${code}: ${result[code].length} data points`)
    } catch (e) {
      console.error(`  ✗ ${code}: ${e.message}`)
      result[code] = []
    }
  }

  mkdirSync(OUT_DIR, { recursive: true })

  const output = {
    fetchedAt: new Date().toISOString(),
    country: COUNTRY,
    indicators: result,
  }

  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2))
  console.log(`\nWritten to ${OUT_FILE}`)
  console.log(`Total size: ${(JSON.stringify(output).length / 1024).toFixed(1)} KB`)
}

main().catch(e => {
  console.error('Fatal error:', e)
  process.exit(1)
})
