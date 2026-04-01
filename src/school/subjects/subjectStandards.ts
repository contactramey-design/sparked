/**
 * Parse optional standards line from lesson `standardsNote` into a short badge + human line.
 * Convention: "Human-readable scope; SHORT-CODE" (e.g. "Counting (pre-K); K.CC").
 */
export function parseStandardsNote(note: string | undefined): {
  /** First segment — good for secondary line on cards */
  scopeLine: string | null
  /** Trailing code after `;` — CCSS / NGSS / CA framework-style tag */
  codeBadge: string | null
} {
  if (!note?.trim()) return { scopeLine: null, codeBadge: null }
  const trimmed = note.trim()
  const idx = trimmed.lastIndexOf(';')
  if (idx === -1) return { scopeLine: trimmed, codeBadge: null }
  const scope = trimmed.slice(0, idx).trim()
  const code = trimmed.slice(idx + 1).trim()
  if (!code) return { scopeLine: scope || null, codeBadge: null }
  return { scopeLine: scope || null, codeBadge: code.length > 32 ? `${code.slice(0, 29)}…` : code }
}
