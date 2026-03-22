import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

export type FootprintPost = {
  id: number
  textKey: string
  emoji: string
  safe: boolean
  consequenceKey: string
}

/** Source: Sparki crew Game 1 — Digital Footprint Challenge (PDF). Drag posts → Safe Forever / Delete It; auto results. */
export const DIGITAL_FOOTPRINT_POSTS: FootprintPost[] = [
  { id: 1, textKey: 'p1', emoji: '📍', safe: false, consequenceKey: 'c1' },
  { id: 2, textKey: 'p2', emoji: '😂', safe: true, consequenceKey: 'c2' },
  { id: 3, textKey: 'p3', emoji: '🔐', safe: false, consequenceKey: 'c3' },
  { id: 4, textKey: 'p4', emoji: '🏫', safe: false, consequenceKey: 'c4' },
  { id: 5, textKey: 'p5', emoji: '🎮', safe: true, consequenceKey: 'c5' },
  { id: 6, textKey: 'p6', emoji: '💳', safe: false, consequenceKey: 'c6' },
  { id: 7, textKey: 'p7', emoji: '📸', safe: true, consequenceKey: 'c7' },
  { id: 8, textKey: 'p8', emoji: '📞', safe: false, consequenceKey: 'c8' },
  { id: 9, textKey: 'p9', emoji: '🎨', safe: true, consequenceKey: 'c9' },
  { id: 10, textKey: 'p10', emoji: '😤', safe: false, consequenceKey: 'c10' },
]

export interface DigitalFootprintQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

type Zone = 'safe' | 'delete'

type Placed = {
  postId: number
  zone: Zone
  isCorrect: boolean
}

type DragState = {
  postId: number
  offsetX: number
  offsetY: number
  el: HTMLElement
  clone: HTMLElement
}

const DigitalFootprintQuiz: React.FC<DigitalFootprintQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const posts = DIGITAL_FOOTPRINT_POSTS
  const [placed, setPlaced] = useState<Placed[]>([])
  const [phase, setPhase] = useState<'play' | 'results'>('play')
  const [hoverZone, setHoverZone] = useState<Zone | null>(null)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; ch: string }[]>([])
  const dragRef = useRef<DragState | null>(null)
  const sparkleId = useRef(0)
  const hasScored = useRef(false)
  const randomLessonKey = useMemo(() => (['l1', 'l2', 'l3', 'l4', 'l5'] as const)[Math.floor(Math.random() * 5)], [])

  const unsortedIds = useMemo(() => {
    const s = new Set(placed.map((p) => p.postId))
    return posts.filter((p) => !s.has(p.id)).map((p) => p.id)
  }, [placed, posts])

  const sortedCount = placed.length

  const spawnSparkles = useCallback((x: number, y: number, ch: string) => {
    const pool = [ch, '⭐', '🌟', '💫']
    const next: { id: number; x: number; y: number; ch: string }[] = []
    for (let i = 0; i < 12; i++) {
      next.push({
        id: sparkleId.current++,
        x,
        y,
        ch: pool[Math.floor(Math.random() * pool.length)]!,
      })
    }
    setSparkles((s) => [...s, ...next])
    setTimeout(() => setSparkles((s) => s.filter((n) => !next.some((x2) => x2.id === n.id))), 1300)
  }, [])

  useEffect(() => {
    const msg = t('digitalFootprint.welcomeSpeech')
    speakPdfLine(msg, 0.85, 1)
  }, [t])

  useEffect(() => {
    if (sortedCount < posts.length || phase !== 'play') return
    const snapshot = placed
    const tid = window.setTimeout(() => {
      setPhase('results')
      let correct = 0
      for (const row of snapshot) {
        const p = posts.find((x) => x.id === row.postId)
        if (!p) continue
        if (row.zone === 'safe' && p.safe) correct += 1
        else if (row.zone === 'delete' && !p.safe) correct += 1
      }
      if (!hasScored.current) {
        hasScored.current = true
        onComplete(correct)
      }
      const pct = Math.round((correct / posts.length) * 100)
      if (pct === 100) {
        playBeep(1500, 0.5)
        speakPdfLine(t('digitalFootprint.perfectSpeech'), 0.85, 1)
        if (typeof window !== 'undefined') {
          spawnSparkles(window.innerWidth / 2, window.innerHeight / 2, '🌟')
        }
      } else {
        speakPdfLine(t('digitalFootprint.scoreSpeech', { pct }), 0.85, 1)
      }
    }, 800)
    return () => clearTimeout(tid)
  }, [sortedCount, posts.length, phase, placed, onComplete, posts, t, spawnSparkles])

  const endDrag = useCallback(() => {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
    document.removeEventListener('pointercancel', onPointerUp)
  }, [])

  const onPointerMove = useCallback((e: PointerEvent) => {
    const st = dragRef.current
    if (!st) return
    e.preventDefault()
    st.clone.style.left = `${e.clientX - st.offsetX}px`
    st.clone.style.top = `${e.clientY - st.offsetY}px`
    const safe = document.getElementById('df-safe-zone')
    const del = document.getElementById('df-delete-zone')
    let hz: Zone | null = null
    if (safe) {
      const r = safe.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hz = 'safe'
    }
    if (!hz && del) {
      const r = del.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hz = 'delete'
    }
    setHoverZone(hz)
  }, [])

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      const st = dragRef.current
      if (!st) return
      e.preventDefault()
      endDrag()
      setHoverZone(null)
      st.clone.remove()
      st.el.style.opacity = '1'
      dragRef.current = null

      const post = posts.find((p) => p.id === st.postId)
      if (!post || phase !== 'play') return

      const safe = document.getElementById('df-safe-zone')
      const del = document.getElementById('df-delete-zone')
      let zone: Zone | null = null
      if (safe) {
        const r = safe.getBoundingClientRect()
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) zone = 'safe'
      }
      if (!zone && del) {
        const r = del.getBoundingClientRect()
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) zone = 'delete'
      }
      if (!zone) return

      const isCorrect = (zone === 'safe' && post.safe) || (zone === 'delete' && !post.safe)
      playBeep(isCorrect ? 1000 : 600, 0.2)
      spawnSparkles(e.clientX, e.clientY, isCorrect ? '✅' : '❌')
      speakPdfLine(isCorrect ? t('digitalFootprint.dropGood') : t('digitalFootprint.dropOops'), 0.85, 1)

      setPlaced((prev) => [...prev.filter((p) => p.postId !== post.id), { postId: post.id, zone, isCorrect }])
    },
    [endDrag, phase, posts, spawnSparkles, t],
  )

  const onPointerDownPost = useCallback(
    (e: React.PointerEvent, postId: number) => {
      if (phase !== 'play') return
      if (!unsortedIds.includes(postId)) return
      e.preventDefault()
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      const clone = el.cloneNode(true) as HTMLElement
      clone.className = 'fixed z-[1000] max-w-[240px] cursor-grabbing rounded-xl border-2 border-blue-500 p-3 text-sm font-bold text-sky-100 shadow-xl'
      clone.style.left = `${e.clientX - offsetX}px`
      clone.style.top = `${e.clientY - offsetY}px`
      clone.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.45), rgba(37,99,235,0.35))'
      document.body.appendChild(clone)
      el.style.opacity = '0.6'
      playBeep(600, 0.1)
      dragRef.current = { postId, offsetX, offsetY, el, clone }
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
      document.addEventListener('pointercancel', onPointerUp)
    },
    [onPointerMove, onPointerUp, phase, unsortedIds],
  )

  const reset = () => {
    setPlaced([])
    setPhase('play')
    hasScored.current = false
    speakPdfLine(t('digitalFootprint.welcomeSpeech'), 0.85, 1)
  }

  const submitOrNudge = () => {
    if (sortedCount >= posts.length) return
    const need = posts.length - sortedCount
    speakPdfLine(t('digitalFootprint.needMoreSpeech', { count: need }), 0.85, 1)
    playBeep(400, 0.2)
  }

  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  const safeItems = placed.filter((p) => p.zone === 'safe')
  const deleteItems = placed.filter((p) => p.zone === 'delete')

  let correct = 0
  for (const row of placed) {
    const p = posts.find((x) => x.id === row.postId)
    if (!p) continue
    if (row.zone === 'safe' && p.safe) correct += 1
    else if (row.zone === 'delete' && !p.safe) correct += 1
  }
  const pct = phase === 'results' ? Math.round((correct / posts.length) * 100) : 0
  const correctSafe = safeItems.filter((row) => posts.find((p) => p.id === row.postId)?.safe).length
  const correctDelete = deleteItems.filter((row) => {
    const p = posts.find((x) => x.id === row.postId)
    return p && !p.safe
  }).length

  const verdictTone =
    pct === 100 ? 'perfect' : pct >= 80 ? 'great' : pct >= 60 ? 'good' : 'learn'

  if (phase === 'results') {
    return (
      <div
        className="font-pdf-mono max-w-2xl rounded-3xl border-2 border-cyan-400/60 p-4 shadow-xl sm:p-6"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
        }}
      >
        <h2 className="text-center text-2xl font-bold text-cyan-300 sm:text-3xl">{t('digitalFootprint.resultsTitle')}</h2>
        <div className="mt-4 rounded-xl border-2 border-cyan-500/40 bg-slate-900/60 p-4">
          <p className={`text-center text-2xl font-bold ${verdictTone === 'perfect' ? 'text-emerald-400' : verdictTone === 'great' ? 'text-yellow-400' : verdictTone === 'good' ? 'text-amber-400' : 'text-red-400'}`}>
            {t(`digitalFootprint.verdictHeadline.${verdictTone}`)}
          </p>
          <p className="mt-2 text-center text-4xl font-black text-white">{pct}%</p>
          <p className="text-center text-sm text-slate-400">{t('digitalFootprint.correctChoicesLabel')}</p>
          <div className="mt-4 space-y-2 text-left text-sm text-slate-200">
            <p>
              ✅ {t('digitalFootprint.keptSafeLine', { correct: correctSafe, total: safeItems.length })}
            </p>
            <p>🗑 {t('digitalFootprint.deletedLine', { correct: correctDelete, total: deleteItems.length })}</p>
          </div>
          <p className="mt-4 text-left text-sm leading-relaxed text-slate-300">{t(`digitalFootprint.lessons.${randomLessonKey}`)}</p>
        </div>
        <p className="mt-4 text-center font-bold text-amber-200">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="mt-3 inline-block w-full text-center primary-button">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
        <button type="button" className="secondary-button mt-3 w-full border-emerald-500 text-emerald-200" onClick={reset}>
          {t('digitalFootprint.restartButton')}
        </button>
      </div>
    )
  }

  return (
    <div
      className="font-pdf-mono relative max-w-2xl overflow-hidden rounded-3xl border-2 border-cyan-400/50 p-4 shadow-xl sm:p-6"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute text-xl"
            style={{
              left: s.x,
              top: s.y,
              fontSize: 20 + Math.random() * 30,
              animation: 'pdf-sparkle-float 1s ease-out forwards',
            }}
          >
            {s.ch}
          </div>
        ))}
      </div>

      <h2 className="relative z-10 text-center text-3xl font-bold text-cyan-300 sm:text-4xl">{t('digitalFootprint.title')}</h2>
      <p className="relative z-10 mx-auto mb-4 max-w-lg text-center text-base font-bold text-sky-100">{t('digitalFootprint.introDrag')}</p>

      <div className="relative z-10 mb-4 flex flex-wrap justify-center gap-2">
        {posts.map((p) => {
          const isPlaced = placed.some((x) => x.postId === p.id)
          return (
            <div
              key={p.id}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                isPlaced ? 'border-emerald-400 bg-emerald-600 text-white' : 'border-cyan-400/60 bg-slate-800 text-cyan-300'
              }`}
            >
              {p.id}
            </div>
          )
        })}
      </div>

      <div className="relative z-10 rounded-2xl border-2 border-cyan-400/50 bg-slate-900/70 p-4">
        <div id="df-posts-container" className="mb-4 grid max-h-[220px] grid-cols-2 gap-3 overflow-y-auto">
          {unsortedIds.map((id) => {
            const p = posts.find((x) => x.id === id)!
            return (
              <div
                key={id}
                role="button"
                tabIndex={0}
                onPointerDown={(e) => onPointerDownPost(e, id)}
                className="cursor-grab touch-none rounded-xl border-2 border-blue-500 bg-gradient-to-br from-blue-600/30 to-blue-900/30 p-3 text-left text-sm font-semibold text-sky-100 transition-transform hover:scale-[1.02] active:cursor-grabbing"
              >
                <span className="mr-1 text-lg">{p.emoji}</span>
                {t(`digitalFootprint.posts.${p.textKey}`)}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            id="df-safe-zone"
            className={`min-h-[150px] rounded-xl border-[3px] border-dashed p-4 transition-all sm:border-4 ${
              hoverZone === 'safe' ? 'border-emerald-400 bg-emerald-900/40' : 'border-emerald-500/70 bg-emerald-950/30'
            }`}
          >
            <div className="text-center text-3xl">✅</div>
            <div className="mb-2 text-center font-bold text-emerald-400">{t('digitalFootprint.zoneSafePdf')}</div>
            <div className="flex flex-col gap-2">
              {safeItems.map((row) => {
                const p = posts.find((x) => x.id === row.postId)!
                return (
                  <div
                    key={row.postId}
                    className="flex items-center gap-2 rounded-lg border-2 px-2 py-2 text-xs text-sky-100"
                    style={{
                      borderColor: row.isCorrect ? '#10b981' : '#ef4444',
                      background: row.isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                    }}
                  >
                    <span>{row.isCorrect ? '✅' : '❌'}</span>
                    <span>
                      {p.emoji} {t(`digitalFootprint.posts.${p.textKey}`)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div
            id="df-delete-zone"
            className={`min-h-[150px] rounded-xl border-[3px] border-dashed p-4 transition-all sm:border-4 ${
              hoverZone === 'delete' ? 'border-red-400 bg-red-900/40' : 'border-red-500/70 bg-red-950/30'
            }`}
          >
            <div className="text-center text-3xl">🗑</div>
            <div className="mb-2 text-center font-bold text-red-400">{t('digitalFootprint.zoneDeletePdf')}</div>
            <div className="flex flex-col gap-2">
              {deleteItems.map((row) => {
                const p = posts.find((x) => x.id === row.postId)!
                return (
                  <div
                    key={row.postId}
                    className="flex items-center gap-2 rounded-lg border-2 px-2 py-2 text-xs text-sky-100"
                    style={{
                      borderColor: row.isCorrect ? '#10b981' : '#ef4444',
                      background: row.isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                    }}
                  >
                    <span>{row.isCorrect ? '✅' : '❌'}</span>
                    <span>
                      {p.emoji} {t(`digitalFootprint.posts.${p.textKey}`)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <p className="relative z-10 mt-4 text-center text-sm text-slate-400">{t('digitalFootprint.sortedCount', { current: sortedCount, total: posts.length })}</p>

        <button type="button" className="mt-4 w-full rounded-xl border-2 border-cyan-400 bg-gradient-to-r from-cyan-400 to-sky-500 py-3 text-lg font-bold text-slate-900 shadow-lg" onClick={submitOrNudge}>
          {t('digitalFootprint.checkButton')}
        </button>
      </div>
    </div>
  )
}

export default DigitalFootprintQuiz
