/** Paths that keep the full marketing footer (SEO / discovery). App-style routes use the short family footer. */
const MARKETING_FOOTER_PREFIXES = [
  '/home-2',
  '/about-us',
  '/about',
  '/contact-us',
  '/contact',
  '/faq',
  '/blog',
  '/services',
  '/service-details',
  '/portfolio',
  '/for-schools',
  '/compliance',
  '/teacher',
] as const

export function isMarketingFooterPath(pathname: string): boolean {
  const p = pathname.split('?')[0].toLowerCase()
  return MARKETING_FOOTER_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))
}

export function getFooterVariant(
  pathname: string,
  opts: { isLoggedIn: boolean; kidLock: boolean },
): 'full' | 'short' {
  if (isMarketingFooterPath(pathname)) return 'full'
  const bare = pathname.split('?')[0]
  if (bare === '/' && !opts.isLoggedIn && !opts.kidLock) return 'full'
  return 'short'
}
