/**
 * Deep-merge locale objects so Spanish (or any partial locale) inherits English
 * for missing keys. Strings and nested objects are merged; arrays are replaced wholesale.
 */
export function mergeLocaleWithFallback<T extends Record<string, unknown>>(
  english: T,
  override: Partial<T> | T,
): T {
  const out: Record<string, unknown> = { ...english }
  for (const key of Object.keys(override)) {
    const ek = key as keyof T
    const ev = english[ek]
    const ov = override[ek]
    if (ov === undefined) continue
    if (ov !== null && typeof ov === 'object' && !Array.isArray(ov) && ev !== null && typeof ev === 'object' && !Array.isArray(ev)) {
      out[key] = mergeLocaleWithFallback(ev as Record<string, unknown>, ov as Record<string, unknown>)
    } else {
      out[key] = ov
    }
  }
  return out as T
}
