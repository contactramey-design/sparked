const CACHE_NAME = 'school-generator-json-cache-v1'

export function weeklyActiveGeneratorPath(classId: string) {
  return `/offline-school-generator/${encodeURIComponent(classId)}/active-generator.json`
}

export function unitJsonPath(unitId: string) {
  return `/offline-school-generator/unit/${encodeURIComponent(unitId)}.json`
}

function toCacheKey(path: string) {
  // CacheStorage keys are URLs/Requests; using absolute URLs avoids edge cases.
  return new URL(path, window.location.origin).toString()
}

export async function writeJsonToCache(path: string, data: unknown) {
  const cache = await caches.open(CACHE_NAME)
  const body = JSON.stringify(data ?? null)
  await cache.put(toCacheKey(path), new Response(body, { headers: { 'Content-Type': 'application/json' } }))
}

export async function readJsonFromCache<T = unknown>(path: string): Promise<T | null> {
  const cache = await caches.open(CACHE_NAME)
  const resp = await cache.match(toCacheKey(path))
  if (!resp) return null
  try {
    const json = (await resp.json()) as T
    return json
  } catch {
    return null
  }
}

