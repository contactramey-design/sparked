/**
 * Splits CANVA GAMES.txt (concatenated HTML exports) into one file per school lesson.
 * Source: ebook-2_KC/public/CANVA GAMES.txt (or path passed as first CLI arg).
 * Output: public/school-canva-games/<lessonId>.html
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const DEFAULT_SRC = path.join(root, 'ebook-2_KC/public/CANVA GAMES.txt')
const OUT_DIR = path.join(root, 'public/school-canva-games')

/** Order matches <!doctype html> sequence in the source file (Tab 1 → Tab 2 → Tab 3). */
const LESSON_IDS = [
  'math-tots-count-1-5',
  'math-tots-patterns',
  'math-tots-more-less-same',
  'eng-kids-main-idea',
  'eng-kids-sentence-parts',
  'eng-kids-blend-sounds-cvc',
  'sci-kids-states-matter',
  'sci-kids-plants-need',
  'sci-kids-pushes-pulls',
  'hist-kids-community-helpers',
  'hist-kids-map-landmarks',
  'hist-kids-goods-services',
  'math-crew-multiply-thinking',
  'math-crew-fractions-intro',
  'math-crew-area-tiles',
  'eng-crew-text-evidence',
  'eng-crew-context-clues',
  'eng-crew-summary-paragraph',
  'sci-crew-food-web',
  'sci-crew-sun-energy',
  'sci-crew-human-body-systems',
  'hist-crew-timeline-basics',
  'hist-crew-sources',
  'hist-crew-ca-symbols-regions',
]

const CF_CHALLENGE = /<script>\(function\(\)\{function c\(\)\{var b=a\.contentDocument[\s\S]*?<\/script>/g

function splitHtmlDocs(raw) {
  const re = /<!doctype html>/gi
  const starts = []
  let m
  while ((m = re.exec(raw)) !== null) {
    starts.push(m.index)
  }
  const docs = []
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i]
    const end = i + 1 < starts.length ? starts[i + 1] : raw.length
    docs.push(raw.slice(start, end).trim())
  }
  return docs
}

function cleanHtml(html) {
  let h = html.replace(CF_CHALLENGE, '')
  h = h.replace(/^[\u200b\ufeff\s]+/i, '')
  return h
}

const srcPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SRC
if (!fs.existsSync(srcPath)) {
  console.error('Missing source file:', srcPath)
  process.exit(1)
}

const raw = fs.readFileSync(srcPath, 'utf8')
const docs = splitHtmlDocs(raw)

if (docs.length !== LESSON_IDS.length) {
  console.error(
    `Expected ${LESSON_IDS.length} HTML documents, found ${docs.length}. Update LESSON_IDS or source file.`,
  )
  process.exit(1)
}

fs.mkdirSync(OUT_DIR, { recursive: true })

for (let i = 0; i < docs.length; i++) {
  const id = LESSON_IDS[i]
  const file = path.join(OUT_DIR, `${id}.html`)
  fs.writeFileSync(file, cleanHtml(docs[i]), 'utf8')
  console.log('Wrote', path.relative(root, file))
}

console.log('Done:', docs.length, 'files')
