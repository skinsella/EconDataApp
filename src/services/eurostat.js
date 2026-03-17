import { fetchWithCache } from './api'

const BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data'

/**
 * Fetch Eurostat data.
 * dataset example: 'prc_hicp_manr'
 * params can include: geo, unit, sinceTimePeriod, coicop, etc.
 * Returns an array of { period, value } sorted by period.
 */
export async function fetchEurostatData(dataset, params = {}) {
  const queryParams = new URLSearchParams({ format: 'JSON' })

  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      queryParams.append(key, val)
    }
  }

  const url = `${BASE_URL}/${dataset}?${queryParams.toString()}`
  const raw = await fetchWithCache(url)

  const results = []

  // Eurostat JSON format: dimension.time.category.label has { index: label } mappings
  // value is an object with numeric string keys mapping to values
  const timeDim =
    raw.dimension?.time?.category ||
    raw.dimension?.TIME_PERIOD?.category ||
    null

  if (!timeDim || !raw.value) {
    return results
  }

  const timeIndex = timeDim.index // { "2020": 0, "2021": 1, ... } or similar
  const timeLabel = timeDim.label || {}

  // Build reverse lookup: position -> period label
  const positionToperiod = {}
  if (typeof timeIndex === 'object' && !Array.isArray(timeIndex)) {
    for (const [code, position] of Object.entries(timeIndex)) {
      positionToperiod[position] = timeLabel[code] || code
    }
  }

  // Determine the size of all non-time dimensions to compute offsets
  // In the flat value array, the time dimension is typically the last one
  const dimIds = raw.id || []
  const dimSizes = raw.size || []
  const timeKey = dimIds.find(
    (d) => d.toLowerCase() === 'time' || d.toLowerCase() === 'time_period'
  )
  const timeDimIdx = dimIds.indexOf(timeKey)
  const timeSize = timeDimIdx >= 0 ? dimSizes[timeDimIdx] : Object.keys(timeIndex).length

  // For simple single-series queries, value keys map directly to flat indices
  // We need to figure out which flat index corresponds to which time position
  const totalBeforeTime = timeDimIdx >= 0
    ? dimSizes.slice(timeDimIdx + 1).reduce((a, b) => a * b, 1)
    : 1
  const totalAfterTime = timeDimIdx >= 0
    ? dimSizes.slice(0, timeDimIdx).reduce((a, b) => a * b, 1)
    : 1

  for (const [flatIdx, val] of Object.entries(raw.value)) {
    if (val === null || val === undefined) continue

    const idx = parseInt(flatIdx, 10)
    // Extract time position from flat index
    const timePos = Math.floor(idx / totalBeforeTime) % timeSize
    const period = positionToperiod[timePos] || String(timePos)

    results.push({ period, value: val })
  }

  results.sort((a, b) => (a.period < b.period ? -1 : a.period > b.period ? 1 : 0))
  return results
}
