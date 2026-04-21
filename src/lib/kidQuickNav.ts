/** Consumer kid hubs: show the shortcut chip row below the main app header. */
export function shouldShowKidQuickNav(pathname: string): boolean {
  if (pathname === '/' || pathname === '/tracks' || pathname === '/books' || pathname === '/shop') return true
  if (pathname.startsWith('/track/')) return true
  if (pathname.startsWith('/unit/')) return true
  if (pathname.startsWith('/lesson/')) return true
  if (pathname.startsWith('/daily')) return true
  if (pathname.startsWith('/homework')) return true
  if (pathname.startsWith('/ai-tutor')) return true
  if (pathname.startsWith('/practice')) return true
  if (pathname.startsWith('/ebook')) return true
  return false
}
