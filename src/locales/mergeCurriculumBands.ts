/**
 * Merges optional age-band plug-ins (tots/crew) into curriculum locale JSON.
 * Kids (anchor) stays in base `curriculum-*.json` unit entries — no `bands.kids` in plugins.
 */
export function mergeCurriculumBands(
  base: Record<string, unknown>,
  plugin: { units?: Record<string, Record<string, unknown>> },
): Record<string, unknown> {
  const baseUnits = base.units as Record<string, Record<string, unknown>> | undefined
  if (!baseUnits || !plugin.units) return base

  const units: Record<string, Record<string, unknown>> = { ...baseUnits }
  for (const [unitId, bandPatch] of Object.entries(plugin.units)) {
    if (!units[unitId]) continue
    const u = { ...units[unitId] }
    const existingBands = (u.bands as Record<string, unknown> | undefined) ?? {}
    u.bands = { ...existingBands, ...bandPatch }
    units[unitId] = u
  }
  return { ...base, units }
}
