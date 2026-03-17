import { fetchWithCache } from './api'

const BASE_URL = 'https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset'

/**
 * Fetch and transform CSO PxStat data in JSON-stat 2.0 format.
 * Returns an array of { period, value, label } objects.
 */
export async function fetchCSOData(datasetId) {
  const url = `${BASE_URL}/${datasetId}/JSON-stat/2.0/en`
  const raw = await fetchWithCache(url)

  // JSON-stat 2.0: the response key is the dataset ID
  const datasetKey = Object.keys(raw).find((k) => k !== 'version' && k !== 'class') || Object.keys(raw)[0]
  const dataset = raw[datasetKey] || raw

  const { dimension, id: dimIds, size, value: values } = dataset

  if (!dimIds || !size || !values) {
    throw new Error(`Unexpected CSO response structure for dataset ${datasetId}`)
  }

  // Build arrays of labels for each dimension
  const dimLabels = dimIds.map((dimId) => {
    const dim = dimension[dimId]
    const catIndex = dim.category.index
    const catLabel = dim.category.label

    // category.index can be an object { code: position } or an array
    let ordered
    if (Array.isArray(catIndex)) {
      ordered = catIndex
    } else {
      ordered = Object.entries(catIndex)
        .sort((a, b) => a[1] - b[1])
        .map(([code]) => code)
    }

    return ordered.map((code) => ({
      code,
      label: catLabel[code] || code,
    }))
  })

  // Find the TIME dimension index
  const timeIdx = dimIds.findIndex(
    (d) => d.toUpperCase().includes('TIME') || d.toUpperCase().includes('TLIST')
  )

  // Reconstruct multi-dimensional indices from the flat value array
  const results = []
  const totalSize = values.length

  for (let flatIdx = 0; flatIdx < totalSize; flatIdx++) {
    const val = values[flatIdx]
    if (val === null || val === undefined) continue

    // Compute the index for each dimension from the flat index
    let remainder = flatIdx
    const indices = []
    for (let d = dimIds.length - 1; d >= 0; d--) {
      indices[d] = remainder % size[d]
      remainder = Math.floor(remainder / size[d])
    }

    const period = timeIdx >= 0 ? dimLabels[timeIdx][indices[timeIdx]].label : String(flatIdx)

    // Build a combined label from non-time dimensions
    const labelParts = dimIds
      .map((_, d) => (d !== timeIdx ? dimLabels[d][indices[d]].label : null))
      .filter(Boolean)

    results.push({
      period,
      value: val,
      label: labelParts.join(' - '),
    })
  }

  return results
}
