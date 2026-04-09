/**
 * School-branded shell paths: school theme in App, no shop in nav/footer.
 * Also used with `schoolMode` (localStorage) so toggling school mode hides commerce sitewide.
 *
 * `/schools/*` uses the same chrome so pilot/class flows match educator pages; `/practice` stays consumer.
 */
export function isSchoolShellPath(pathname: string): boolean {
  if (pathname === '/schools' || pathname.startsWith('/schools/')) return true
  return (
    pathname.startsWith('/for-schools') ||
    pathname.startsWith('/compliance') ||
    pathname.startsWith('/teacher')
  )
}
