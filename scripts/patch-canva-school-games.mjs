/**
 * 1) Truncate each school-canva-games/*.html after the last </html>
 * 2) Inject sparki-locale-init.js after viewport meta (once)
 * 3) Merge i18n into defaultConfig before first applyConfig(defaultConfig)
 * 4) math-tots-count-1-5: use global number words for Spanish
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dir = path.join(root, 'public/school-canva-games')

const SCRIPT_LINE =
  '  <script src="/school-canva-games/sparki-locale-init.js"></script>\n'

const MERGE_LINE =
  '    if (window.__SPARKI_MERGE_DEFAULTS__) Object.assign(defaultConfig, window.__SPARKI_MERGE_DEFAULTS__);\n'

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'))

for (const name of files) {
  const fp = path.join(dir, name)
  let s = fs.readFileSync(fp, 'utf8')

  const lower = s.toLowerCase()
  const closeIdx = lower.lastIndexOf('</html>')
  if (closeIdx !== -1) {
    s = s.slice(0, closeIdx + 7) + '\n'
  }

  if (!s.includes('sparki-locale-init.js')) {
    const vp = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    if (s.includes(vp)) {
      s = s.replace(vp, vp + '\n' + SCRIPT_LINE)
    } else {
      console.warn('No viewport meta in', name)
    }
  }

  const needle = '    applyConfig(defaultConfig);'
  if (s.includes(needle)) {
    s = s.replace(needle, MERGE_LINE + needle)
  } else {
    console.warn('No applyConfig(defaultConfig) in', name)
  }

  if (name === 'math-tots-count-1-5.html') {
    s = s.replace(
      "const numberWords = ['', 'One', 'Two', 'Three', 'Four', 'Five'];",
      "const numberWords = window.__SPARKI_NUMBER_WORDS__ || ['', 'One', 'Two', 'Three', 'Four', 'Five'];"
    )
  }

  fs.writeFileSync(fp, s)
}

console.log('Patched', files.length, 'HTML files in', dir)
