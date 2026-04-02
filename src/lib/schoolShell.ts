/**
 * School-branded shell paths: school theme in App, no shop in nav/footer.
 * Also used with `schoolMode` (localStorage) so toggling school mode hides commerce sitewide.
 */
export function isSchoolShellPath(pathname: string): boolean {
  return (
    pathname.startsWith('/schools') ||
    pathname.startsWith('/for-schools') ||
    pathname.startsWith('/compliance') ||
    pathname.startsWith('/teacher')
  )
}
