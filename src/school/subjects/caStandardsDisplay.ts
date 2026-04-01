/**
 * California standards display + CDE reference URLs.
 * Codes cite public frameworks (PTKLF, CA CCSS, CA NGSS, CA HSS); link teachers to CDE, not pasted framework text.
 */
import type { CaStandardsFramework, CaStandardsMeta, SchoolSubjectLesson } from './types'

/** Stable CDE landing pages (verify periodically). */
const CDE_FRAMEWORK_URL: Record<CaStandardsFramework, string> = {
  PTKLF: 'https://www.cde.ca.gov/sp/cd/re/preschoollg.asp',
  CCSS_MATH: 'https://www.cde.ca.gov/re/cc/math.asp',
  CCSS_ELA: 'https://www.cde.ca.gov/re/cc/ela.asp',
  CA_NGSS: 'https://www.cde.ca.gov/pd/ca/sc/ngss.asp',
  CA_HSS: 'https://www.cde.ca.gov/ci/csh/',
}

const FRAMEWORK_LABEL_EN: Record<CaStandardsFramework, string> = {
  PTKLF: 'CA Preschool Learning Foundations',
  CCSS_MATH: 'CA CCSS Mathematics',
  CCSS_ELA: 'CA CCSS ELA/Literacy',
  CA_NGSS: 'California NGSS',
  CA_HSS: 'CA History–Social Science',
}

const FRAMEWORK_LABEL_ES: Record<CaStandardsFramework, string> = {
  PTKLF: 'Fundamentos de aprendizaje preescolar (California)',
  CCSS_MATH: 'Matemáticas CA CCSS',
  CCSS_ELA: 'ELA/Literacidad CA CCSS',
  CA_NGSS: 'NGSS de California',
  CA_HSS: 'Historia y estudios sociales de California',
}

export function cdeFrameworkUrl(framework: CaStandardsFramework): string {
  return CDE_FRAMEWORK_URL[framework]
}

/** CDE site search — useful when no stable deep link exists for a specific code. */
export function cdeSearchUrl(query: string): string {
  const q = encodeURIComponent(query.trim() || 'California content standards')
  return `https://www.cde.ca.gov/search/searchresults.asp?q=${q}`
}

export function caFrameworkLabel(framework: CaStandardsFramework, locale: 'en' | 'es'): string {
  return locale === 'es' ? FRAMEWORK_LABEL_ES[framework] : FRAMEWORK_LABEL_EN[framework]
}

/** Short badge line: framework short name · codes */
export function formatCaStandardsBadge(ca: CaStandardsMeta): string {
  const short = {
    PTKLF: 'CA PTKLF',
    CCSS_MATH: 'CA CCSS Math',
    CCSS_ELA: 'CA CCSS ELA',
    CA_NGSS: 'CA NGSS',
    CA_HSS: 'CA HSS',
  }[ca.framework]
  const codes = ca.codes.join(', ')
  return codes ? `${short} · ${codes}` : short
}

/** Best URL: framework landing, or search using first code / custom query. */
export function caStandardsReferenceUrl(ca: CaStandardsMeta): string {
  if (ca.cdeSearchQuery?.trim()) {
    return cdeSearchUrl(ca.cdeSearchQuery)
  }
  if (ca.codes.length > 0) {
    return cdeSearchUrl(`${ca.framework} ${ca.codes[0]} California`)
  }
  return cdeFrameworkUrl(ca.framework)
}

export function lessonCaStandardsOrUndefined(lesson: SchoolSubjectLesson): CaStandardsMeta | undefined {
  return lesson.caStandards
}
