const cache = new Map()
const DEFAULT_TTL = 60 * 60 * 1000 // 1 hour
const MAX_CACHE_SIZE = 100

function evictStaleEntries() {
  const now = Date.now()
  for (const [key, entry] of cache) {
    if (now - entry.timestamp >= entry.ttl) {
      cache.delete(key)
    }
  }
  // If still over limit, remove oldest entries
  if (cache.size > MAX_CACHE_SIZE) {
    const sorted = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toRemove = sorted.slice(0, cache.size - MAX_CACHE_SIZE)
    for (const [key] of toRemove) {
      cache.delete(key)
    }
  }
}

export async function fetchWithCache(url, options = {}) {
  const { ttl = DEFAULT_TTL, headers = {} } = options
  const cacheKey = url

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json', ...headers },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  cache.set(cacheKey, { data, timestamp: Date.now(), ttl })

  // Periodically evict stale entries
  if (cache.size > MAX_CACHE_SIZE) {
    evictStaleEntries()
  }

  return data
}

export function clearCache() {
  cache.clear()
}
