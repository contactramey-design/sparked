/**
 * Sparki Tots (3–5) — Foundational Learning track interactive games.
 */
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

export type FoundationVariant = 'tots' | 'crew'

type FoundationQuizProps = {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
  /** Crew gets more blocks / rounds / harder rules. */
  variant?: FoundationVariant
}

function WinShell({
  title,
  body,
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onAgain,
  againLabel,
}: {
  title: string
  body: string
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onAgain: () => void
  againLabel: string
}) {
  const { t } = useTranslation()
  const displaySparkles = earnedSparkles ?? unit.sparklesReward
  return (
    <div className="font-pdf-fredoka rounded-3xl border-4 border-white bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-400 p-8 text-center shadow-2xl">
      <div className="text-6xl">🎉</div>
      <h2 className="mt-4 text-3xl font-black text-white drop-shadow">{title}</h2>
      <p className="mt-3 text-xl font-semibold text-white">{body}</p>
      <p className="mt-4 font-bold text-amber-100">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
      {mastered && nextUnit && (
        <Link to={`/unit/${nextUnit.id}`} className="mt-4 inline-block primary-button">
          {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
        </Link>
      )}
      <button type="button" className="mt-4 block w-full max-w-xs mx-auto rounded-full bg-white/25 px-6 py-3 font-bold text-white" onClick={onAgain}>
        {againLabel}
      </button>
    </div>
  )
}

// ——— Unit 1: Colors (4 colors × 2 blocks) ———
type SortColor = 'red' | 'blue' | 'yellow' | 'green'
const FOUR_COLORS: SortColor[] = ['red', 'blue', 'yellow', 'green']
const COLOR_STYLES: Record<SortColor, { bg: string; border: string; emoji: string }> = {
  red: { bg: '#EF4444', border: '#B91C1C', emoji: '❤️' },
  blue: { bg: '#3B82F6', border: '#1D4ED8', emoji: '💙' },
  yellow: { bg: '#EAB308', border: '#CA8A04', emoji: '💛' },
  green: { bg: '#22C55E', border: '#15803D', emoji: '💚' },
}

type ColorBlock = { id: number; color: SortColor; sorted: boolean }

function genColorBlocks(perColor: number): ColorBlock[] {
  const list: ColorBlock[] = []
  let id = 0
  for (const c of FOUR_COLORS) {
    for (let i = 0; i < perColor; i++) {
      list.push({ id: id++, color: c, sorted: false })
    }
  }
  const shuffled = [...list]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = shuffled[i]!
    const b = shuffled[j]!
    shuffled[i] = b
    shuffled[j] = a
  }
  return shuffled
}

export const FoundationsColorSortQuiz: React.FC<FoundationQuizProps> = (props) => {
  const { t } = useTranslation()
  const perColor = props.variant === 'crew' ? 3 : 2
  const total = FOUR_COLORS.length * perColor
  const [blocks, setBlocks] = useState<ColorBlock[]>(() => genColorBlocks(perColor))
  const [sortedCount, setSortedCount] = useState(0)
  const [won, setWon] = useState(false)
  const [hover, setHover] = useState<SortColor | null>(null)
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks
  const dragRef = useRef<{ id: number; ox: number; oy: number; el: HTMLElement; clone: HTMLElement } | null>(null)
  const blockSize = props.variant === 'crew' ? 'h-14 w-14 text-2xl' : 'h-[72px] w-[72px] text-3xl'
  const basketW = props.variant === 'crew' ? 72 : 88

  const endDrag = () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
    document.removeEventListener('pointercancel', onUp)
  }

  const onMove = (e: PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    e.preventDefault()
    d.clone.style.left = `${e.clientX - d.ox}px`
    d.clone.style.top = `${e.clientY - d.oy}px`
    let h: SortColor | null = null
    for (const c of FOUR_COLORS) {
      const el = document.getElementById(`found-basket-${c}`)
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        h = c
        break
      }
    }
    setHover(h)
  }

  const onUp = (e: PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    e.preventDefault()
    endDrag()
    setHover(null)
    d.clone.remove()
    d.el.style.opacity = '1'
    dragRef.current = null

    const block = blocksRef.current.find((b) => b.id === d.id && !b.sorted)
    if (!block) return

    let target: SortColor | null = null
    for (const c of FOUR_COLORS) {
      const el = document.getElementById(`found-basket-${c}`)
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        target = c
        break
      }
    }
    if (!target) return
    if (target !== block.color) {
      playBeep(400, 0.15)
      speakPdfLine(t('foundations.color.tryBasket'), 0.85, 1.05)
      return
    }
    playBeep(900, 0.12)
    setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, sorted: true } : b)))
    setSortedCount((n) => {
      const next = n + 1
      if (next >= total) {
        setWon(true)
        props.onComplete(total)
        playBeep(1500, 0.35)
        speakPdfLine(t('foundations.color.winSpeech'), 0.85, 1.1)
      }
      return next
    })
    d.el.style.transform = 'scale(0)'
    d.el.style.opacity = '0'
    d.el.style.pointerEvents = 'none'
    speakPdfLine(t('foundations.color.nice'), 0.85, 1.1)
  }

  const onDown = (e: React.PointerEvent, block: ColorBlock) => {
    if (won || block.sorted) return
    e.preventDefault()
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const ox = e.clientX - rect.left
    const oy = e.clientY - rect.top
    const clone = el.cloneNode(true) as HTMLElement
    clone.className = `fixed z-[1000] flex touch-none items-center justify-center rounded-2xl shadow-xl ${blockSize}`
    clone.style.left = `${e.clientX - ox}px`
    clone.style.top = `${e.clientY - oy}px`
    const st = COLOR_STYLES[block.color]
    clone.style.background = st.bg
    clone.style.border = `4px solid ${st.border}`
    document.body.appendChild(clone)
    el.style.opacity = '0.35'
    dragRef.current = { id: block.id, ox, oy, el, clone }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
    speakPdfLine(t(`foundations.color.hint_${block.color}`), 0.8, 1.05)
  }

  const reset = () => {
    setBlocks(genColorBlocks(perColor))
    setSortedCount(0)
    setWon(false)
  }

  if (won) {
    return (
      <WinShell
        title={t('foundations.color.winTitle')}
        body={t('foundations.color.winBody')}
        unit={props.unit}
        nextUnit={props.nextUnit}
        earnedSparkles={props.earnedSparkles}
        mastered={props.mastered}
        onAgain={reset}
        againLabel={t('foundations.playAgain')}
      />
    )
  }

  const active = blocks.filter((b) => !b.sorted)

  return (
    <div className="font-pdf-fredoka pdf-ai-sort-bg relative min-h-[480px] overflow-hidden rounded-3xl border-4 border-white/80 p-4 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-white drop-shadow">{t('foundations.color.title')}</h2>
      <p className="mt-2 text-center text-lg text-white/95">{t('foundations.color.subtitle')}</p>
      <p className="mt-1 text-center font-bold text-amber-200">
        {t('foundations.color.score', { current: sortedCount, total })}
      </p>
      <div className="mt-4 flex min-h-[120px] flex-wrap justify-center gap-3">
        {active.map((b) => {
          const st = COLOR_STYLES[b.color]
          return (
            <div
              key={b.id}
              role="button"
              tabIndex={0}
              onPointerDown={(e) => onDown(e, b)}
              className={`flex cursor-grab touch-none items-center justify-center rounded-2xl active:cursor-grabbing ${blockSize}`}
              style={{
                background: st.bg,
                border: `4px solid ${st.border}`,
                boxShadow: `0 6px 0 ${st.border}`,
              }}
            >
              {st.emoji}
            </div>
          )
        })}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3 px-2">
        {FOUR_COLORS.map((c) => {
          const st = COLOR_STYLES[c]
          return (
            <div key={c} id={`found-basket-${c}`} className={`flex flex-col items-center transition-transform ${hover === c ? 'scale-110' : ''}`}>
              <svg viewBox="0 0 120 100" width={basketW} height={Math.round(basketW * 0.82)} aria-hidden>
                <path d="M 10 20 L 20 90 Q 60 100 100 90 L 110 20 Z" fill={st.bg} stroke={st.border} strokeWidth="3" />
                <ellipse cx="60" cy="20" rx="50" ry="10" fill="none" stroke={st.border} strokeWidth="2" />
              </svg>
              <span className="text-xs font-bold text-white">{t(`foundations.color.basket_${c}`)}</span>
            </div>
          )
        })}
      </div>
      <p className="mt-3 pb-2 text-center text-sm text-white/90">{t('foundations.color.dragHint')}</p>
    </div>
  )
}

// ——— Unit 2: Shapes ———
type ShapeId = 'circle' | 'square' | 'triangle'
const SHAPES: ShapeId[] = ['circle', 'square', 'triangle']

export const FoundationsShapeMatchQuiz: React.FC<FoundationQuizProps> = (props) => {
  const { t } = useTranslation()
  const roundTotal = props.variant === 'crew' ? 5 : 3
  const [order] = useState(() => {
    if (props.variant === 'crew') {
      const o: ShapeId[] = []
      for (let i = 0; i < roundTotal; i++) {
        o.push(SHAPES[Math.floor(Math.random() * SHAPES.length)]!)
      }
      return o
    }
    const o = [...SHAPES]
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const a = o[i]!
      const b = o[j]!
      o[i] = b
      o[j] = a
    }
    return o
  })
  const [idx, setIdx] = useState(0)
  const [won, setWon] = useState(false)

  const target = order[idx]!

  const select = (s: ShapeId) => {
    if (won) return
    if (s !== target) {
      playBeep(400, 0.15)
      speakPdfLine(t('foundations.shape.tryAgain'), 0.85, 1)
      return
    }
    playBeep(1000, 0.15)
    speakPdfLine(t('foundations.shape.great'), 0.85, 1.1)
    if (idx + 1 >= order.length) {
      setWon(true)
      props.onComplete(roundTotal)
      playBeep(1500, 0.35)
      speakPdfLine(t('foundations.shape.winSpeech'), 0.85, 1.1)
    } else {
      setIdx((i) => i + 1)
    }
  }

  const shapeEmoji = (s: ShapeId) => (s === 'circle' ? '⭕' : s === 'square' ? '🟦' : '🔺')

  if (won) {
    return (
      <WinShell
        title={t('foundations.shape.winTitle')}
        body={t('foundations.shape.winBody')}
        unit={props.unit}
        nextUnit={props.nextUnit}
        earnedSparkles={props.earnedSparkles}
        mastered={props.mastered}
        onAgain={() => {
          setIdx(0)
          setWon(false)
        }}
        againLabel={t('foundations.playAgain')}
      />
    )
  }

  return (
    <div className="font-pdf-fredoka rounded-3xl border-4 border-sky-300 bg-gradient-to-b from-sky-500 to-indigo-700 p-6 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-white">{t('foundations.shape.title')}</h2>
      <p className="mt-2 text-center text-lg text-sky-100">{t('foundations.shape.subtitle')}</p>
      <p className="mt-2 text-center text-amber-200 font-bold">{t('foundations.shape.round', { current: idx + 1, total: roundTotal })}</p>
      {props.variant === 'crew' && (
        <p className="mt-1 text-center text-sm font-semibold text-amber-200/90">{t('foundations.shape.crewHint')}</p>
      )}
      <div className="mx-auto mt-6 max-w-xs rounded-2xl border-4 border-dashed border-amber-200 bg-white/15 p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-amber-100">{t('foundations.shape.findThis')}</p>
        <div className="mt-2 text-7xl">{shapeEmoji(target)}</div>
        <p className="mt-2 text-lg font-black text-white">{t(`foundations.shape.name_${target}`)}</p>
      </div>
      <p className="mt-6 text-center text-xl font-bold text-white">{t('foundations.shape.tapPrompt', { shape: t(`foundations.shape.name_${target}`) })}</p>
      <div className="mt-4 flex justify-center gap-4">
        {SHAPES.map((s) => (
          <button
            key={s}
            type="button"
            className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white text-4xl shadow-lg"
            style={{ background: 'linear-gradient(145deg, #fef3c7, #fde68a)' }}
            onClick={() => select(s)}
          >
            {shapeEmoji(s)}
          </button>
        ))}
      </div>
    </div>
  )
}

// ——— Unit 3: Counting ———
export const FoundationsCountQuiz: React.FC<FoundationQuizProps> = (props) => {
  const { t } = useTranslation()
  const maxTap = props.variant === 'crew' ? 8 : 5
  const blueAnswer = props.variant === 'crew' ? 6 : 3
  const quizTotal = maxTap + 1
  const [phase, setPhase] = useState<'tap' | 'quiz'>('tap')
  const [nextTap, setNextTap] = useState(1)
  const [won, setWon] = useState(false)

  const onTapNum = (n: number) => {
    if (phase !== 'tap' || won) return
    if (n !== nextTap) {
      playBeep(400, 0.12)
      return
    }
    playBeep(700 + n * 80, 0.12)
    speakPdfLine(String(n), 0.9, 1)
    if (n === maxTap) {
      setPhase('quiz')
      speakPdfLine(t('foundations.count.nowQuiz'), 0.85, 1.05)
    } else {
      setNextTap(n + 1)
    }
  }

  const answerQuiz = (choice: number) => {
    if (won || phase !== 'quiz') return
    if (choice !== blueAnswer) {
      playBeep(400, 0.15)
      speakPdfLine(t('foundations.count.countBlues'), 0.85, 1)
      return
    }
    setWon(true)
    props.onComplete(quizTotal)
    playBeep(1500, 0.35)
    speakPdfLine(t('foundations.count.winSpeech'), 0.85, 1.1)
  }

  const reset = () => {
    setPhase('tap')
    setNextTap(1)
    setWon(false)
  }

  const tapNumbers = Array.from({ length: maxTap }, (_, i) => i + 1)

  if (won) {
    return (
      <WinShell
        title={t('foundations.count.winTitle')}
        body={t('foundations.count.winBody')}
        unit={props.unit}
        nextUnit={props.nextUnit}
        earnedSparkles={props.earnedSparkles}
        mastered={props.mastered}
        onAgain={reset}
        againLabel={t('foundations.playAgain')}
      />
    )
  }

  return (
    <div className="font-pdf-fredoka rounded-3xl border-4 border-emerald-300 bg-gradient-to-b from-emerald-500 to-teal-800 p-6 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-white">{t('foundations.count.title')}</h2>
      {phase === 'tap' ? (
        <>
          <p className="mt-3 text-center text-lg text-emerald-100">
            {t('foundations.count.tapInOrder', { max: maxTap })}
          </p>
          <p className="text-center font-bold text-amber-200">{t('foundations.count.nextIs', { n: nextTap })}</p>
          <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2 sm:gap-3 mx-auto">
            {tapNumbers.map((n) => (
              <button
                key={n}
                type="button"
                className={`flex items-center justify-center rounded-2xl border-4 border-white bg-white/90 font-black text-emerald-800 shadow-lg ${props.variant === 'crew' ? 'h-14 w-14 text-2xl' : 'h-16 w-16 text-3xl'}`}
                onClick={() => onTapNum(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-center text-xl font-bold text-white">{t('foundations.count.howManyBlue')}</p>
          <div className="mt-4 flex max-w-sm flex-wrap justify-center gap-1 text-3xl sm:text-4xl" aria-hidden>
            {props.variant === 'crew' ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={`b${i}`}>🔵</span>
                ))}
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={`r${i}`}>🔴</span>
                ))}
              </>
            ) : (
              <>
                <span>🔵</span>
                <span>🔵</span>
                <span>🔵</span>
                <span>🔴</span>
                <span>🔴</span>
              </>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(props.variant === 'crew' ? [5, 6, 7] : [2, 3, 4]).map((n) => (
              <button
                key={n}
                type="button"
                className="rounded-2xl border-4 border-white bg-white/20 px-6 py-4 text-2xl font-black text-white"
                onClick={() => answerQuiz(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ——— Unit 4: Letters ———
const LETTERS_TOTS = ['A', 'B', 'C'] as const
const LETTERS_CREW = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const

function letterPrompt(t: (k: string, v?: Record<string, string | number>) => string, letter: string): string {
  const key = `foundations.letters.prompt_${letter}`
  const msg = t(key)
  if (msg !== key) return msg
  return t('foundations.letters.prompt_fallback', { letter })
}

export const FoundationsLetterQuiz: React.FC<FoundationQuizProps> = (props) => {
  const { t } = useTranslation()
  const pool = props.variant === 'crew' ? [...LETTERS_CREW] : [...LETTERS_TOTS]
  const [rounds] = useState(() => {
    const r = [...pool]
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const a = r[i]!
      const b = r[j]!
      r[i] = b
      r[j] = a
    }
    return r
  })
  const [idx, setIdx] = useState(0)
  const [won, setWon] = useState(false)
  const letter = rounds[idx]!

  useEffect(() => {
    if (won) return
    const tid = window.setTimeout(() => speakPdfLine(letterPrompt(t, letter), 0.85, 1.05), 400)
    return () => window.clearTimeout(tid)
  }, [letter, t, won])

  const pick = (L: string) => {
    if (won) return
    if (L !== letter) {
      playBeep(400, 0.12)
      speakPdfLine(t('foundations.letters.tryAgain'), 0.85, 1)
      return
    }
    playBeep(1100, 0.15)
    speakPdfLine(t('foundations.letters.yes'), 0.85, 1.1)
    if (idx + 1 >= rounds.length) {
      setWon(true)
      props.onComplete(rounds.length)
      playBeep(1500, 0.35)
      speakPdfLine(t('foundations.letters.winSpeech'), 0.85, 1.1)
    } else {
      setIdx((i) => i + 1)
    }
  }

  if (won) {
    return (
      <WinShell
        title={t('foundations.letters.winTitle')}
        body={t('foundations.letters.winBody')}
        unit={props.unit}
        nextUnit={props.nextUnit}
        earnedSparkles={props.earnedSparkles}
        mastered={props.mastered}
        onAgain={() => {
          setIdx(0)
          setWon(false)
        }}
        againLabel={t('foundations.playAgain')}
      />
    )
  }

  return (
    <div className="font-pdf-fredoka rounded-3xl border-4 border-amber-300 bg-gradient-to-b from-amber-400 to-orange-600 p-6 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-white drop-shadow">{t('foundations.letters.title')}</h2>
      <p className="mt-2 text-center text-lg text-amber-950/90">{t('foundations.letters.subtitle')}</p>
      <p className="mt-2 text-center font-bold text-white">{t('foundations.letters.round', { current: idx + 1, total: rounds.length })}</p>
      <p className="mt-6 text-center text-2xl font-black text-white drop-shadow">
        {(() => {
          const k = `foundations.letters.ask_${letter}`
          const v = t(k)
          return v !== k ? v : t('foundations.letters.ask_fallback', { letter })
        })()}
      </p>
      <div className="mt-8 flex max-w-lg flex-wrap justify-center gap-2 sm:gap-3">
        {pool.map((L) => (
          <button
            key={L}
            type="button"
            className={`flex items-center justify-center rounded-2xl border-4 border-white bg-white/95 font-black text-orange-700 shadow-xl ${props.variant === 'crew' ? 'h-16 w-14 text-3xl' : 'h-24 w-20 text-5xl'}`}
            onClick={() => pick(L)}
          >
            {L}
          </button>
        ))}
      </div>
    </div>
  )
}

// ——— Unit 5: Patterns ———
type Pat = { seq: ('r' | 'b')[]; options: ('r' | 'b')[]; correct: 'r' | 'b' }

export const FoundationsPatternQuiz: React.FC<FoundationQuizProps> = (props) => {
  const { t } = useTranslation()
  const [rounds] = useState<Pat[]>(() => {
    const base: Pat[] = [
      { seq: ['r', 'b', 'r', 'b'], options: ['r', 'b', 'r'], correct: 'r' },
      { seq: ['b', 'b', 'r', 'b', 'b', 'r'], options: ['r', 'b', 'b'], correct: 'r' },
    ]
    if (props.variant === 'crew') {
      base.push({ seq: ['r', 'r', 'b', 'r', 'r', 'b'], options: ['b', 'r', 'r'], correct: 'r' })
    }
    return base
  })
  const [idx, setIdx] = useState(0)
  const [won, setWon] = useState(false)
  const cur = rounds[idx]!

  const dot = (c: 'r' | 'b') => (
    <span
      className="inline-block h-12 w-12 rounded-lg border-2 border-white shadow-md"
      style={{ background: c === 'r' ? '#EF4444' : '#3B82F6' }}
    />
  )

  const pick = (c: 'r' | 'b') => {
    if (won) return
    if (c !== cur.correct) {
      playBeep(400, 0.12)
      speakPdfLine(t('foundations.pattern.tryAgain'), 0.85, 1)
      return
    }
    playBeep(1100, 0.15)
    if (idx + 1 >= rounds.length) {
      setWon(true)
      props.onComplete(rounds.length)
      playBeep(1500, 0.35)
      speakPdfLine(t('foundations.pattern.winSpeech'), 0.85, 1.1)
    } else {
      setIdx((i) => i + 1)
      speakPdfLine(t('foundations.pattern.next'), 0.85, 1.05)
    }
  }

  if (won) {
    return (
      <WinShell
        title={t('foundations.pattern.winTitle')}
        body={t('foundations.pattern.winBody')}
        unit={props.unit}
        nextUnit={props.nextUnit}
        earnedSparkles={props.earnedSparkles}
        mastered={props.mastered}
        onAgain={() => {
          setIdx(0)
          setWon(false)
        }}
        againLabel={t('foundations.playAgain')}
      />
    )
  }

  return (
    <div className="font-pdf-fredoka rounded-3xl border-4 border-fuchsia-300 bg-gradient-to-b from-fuchsia-600 to-purple-900 p-6 shadow-xl">
      <h2 className="text-center text-2xl font-bold text-white">{t('foundations.pattern.title')}</h2>
      <p className="mt-2 text-center text-fuchsia-100">{t('foundations.pattern.subtitle')}</p>
      <p className="mt-2 text-center font-bold text-amber-200">{t('foundations.pattern.round', { current: idx + 1, total: rounds.length })}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {cur.seq.map((c, i) => (
          <span key={i}>{dot(c)}</span>
        ))}
        <span className="text-3xl font-black text-white">?</span>
      </div>
      <p className="mt-6 text-center text-xl font-bold text-white">{t('foundations.pattern.whichNext')}</p>
      <div className="mt-4 flex justify-center gap-4">
        {cur.options.map((c, i) => (
          <button key={i} type="button" className="rounded-2xl border-4 border-white p-2 shadow-lg" onClick={() => pick(c)}>
            {dot(c)}
          </button>
        ))}
      </div>
    </div>
  )
}
