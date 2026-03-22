import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

/**
 * Source: PDF export — Kind or Not Kind (Game 5 in TOTS pack). Drag happy faces to Kind Basket; 4 matches to win.
 */
const FACE_CARDS: { emoji: string; kind: boolean }[] = [
  { emoji: '😊', kind: true },
  { emoji: '😢', kind: false },
  { emoji: '😄', kind: true },
  { emoji: '😠', kind: false },
  { emoji: '🥰', kind: true },
  { emoji: '😍', kind: true },
]

const KIND_TARGET = 4

const CELEBRATION_KEYS = ['celebrate1', 'celebrate2', 'celebrate3', 'celebrate4'] as const

type DragState = {
  cardIdx: number
  offsetX: number
  offsetY: number
  el: HTMLElement
  clone: HTMLElement
}

function SparkiFace({ className, size = 100 }: { className?: string; size?: number }) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        <circle cx="50" cy="55" r="32" fill="#FFD93D" stroke="#F4A623" strokeWidth="3" />
        <circle cx="38" cy="48" r="6" fill="#333" />
        <circle cx="62" cy="48" r="6" fill="#333" />
        <circle cx="40" cy="46" r="2" fill="#fff" />
        <circle cx="64" cy="46" r="2" fill="#fff" />
        <path id="sparki-mouth" d="M 35 62 Q 50 78 65 62" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="58" r="5" fill="#FFB5B5" opacity={0.6} />
        <circle cx="72" cy="58" r="5" fill="#FFB5B5" opacity={0.6} />
        <line x1="50" y1="23" x2="50" y2="10" stroke="#F4A623" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="8" r="5" fill="#FF6B6B" />
        <path d="M 20 55 Q 8 50 5 40" stroke="#F4A623" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 80 55 Q 92 50 95 40" stroke="#F4A623" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export interface KindOrNotKindQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const KindOrNotKindQuiz: React.FC<KindOrNotKindQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [matchedCount, setMatchedCount] = useState(0)
  const [bubbleText, setBubbleText] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [basketDragOver, setBasketDragOver] = useState(false)
  const [sparkleNodes, setSparkleNodes] = useState<{ id: number; x: number; y: number; ch: string; delay: number }[]>([])
  const [heartBeat, setHeartBeat] = useState(false)
  const [basketShake, setBasketShake] = useState(false)

  const dragRef = useRef<DragState | null>(null)
  const matchedRef = useRef(matched)
  matchedRef.current = matched
  const celebrationIndex = useRef(0)
  const sparkleId = useRef(0)
  const hasCompleted = useRef(false)

  const spawnSparkles = useCallback((x: number, y: number) => {
    const pool = ['✨', '⭐', '🌟', '💫', '🎉', '💖']
    const next: { id: number; x: number; y: number; ch: string; delay: number }[] = []
    for (let i = 0; i < 25; i++) {
      next.push({
        id: sparkleId.current++,
        x,
        y,
        ch: pool[Math.floor(Math.random() * pool.length)]!,
        delay: i * 0.05,
      })
    }
    setSparkleNodes((s) => [...s, ...next])
    setTimeout(() => setSparkleNodes((s) => s.filter((n) => !next.some((x2) => x2.id === n.id))), 1500)
  }, [])

  useEffect(() => {
    const tid = setTimeout(() => {
      const msg = t('kindOrNotKind.welcomeSpeech')
      setBubbleText(msg)
      speakPdfLine(msg, 0.8, 1.2)
    }, 800)
    return () => clearTimeout(tid)
  }, [t])

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
    const basket = document.getElementById('kind-basket-zone')
    if (basket) {
      const r = basket.getBoundingClientRect()
      setBasketDragOver(e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom)
    }
  }, [])

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      const st = dragRef.current
      if (!st) return
      e.preventDefault()
      endDrag()
      setBasketDragOver(false)
      st.clone.remove()
      st.el.style.opacity = '1'
      dragRef.current = null

      const idx = st.cardIdx
      if (matchedRef.current.has(idx) || done) return

      const basket = document.getElementById('kind-basket-zone')
      let overBasket = false
      if (basket) {
        const r = basket.getBoundingClientRect()
        overBasket = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      }

      if (!overBasket) return

      const card = FACE_CARDS[idx]
      if (!card) return

      if (!card.kind) {
        playBeep(400, 0.2)
        setBasketShake(true)
        setTimeout(() => setBasketShake(false), 300)
        const msg = t('kindOrNotKind.tryHappy')
        setBubbleText(msg)
        speakPdfLine(msg, 0.8, 1.2)
        return
      }

      playBeep(1200, 0.3)
      spawnSparkles(e.clientX, e.clientY)
      setMatched((prev) => new Set(prev).add(idx))
      st.el.style.transition = 'all 0.4s ease'
      st.el.style.transform = 'scale(0)'
      st.el.style.opacity = '0'
      st.el.style.pointerEvents = 'none'

      setHeartBeat(true)
      setTimeout(() => setHeartBeat(false), 600)

      const cKey = CELEBRATION_KEYS[celebrationIndex.current % CELEBRATION_KEYS.length]!
      celebrationIndex.current++
      const msg = t(`kindOrNotKind.${cKey}`)
      setBubbleText(msg)
      speakPdfLine(msg, 0.8, 1.2)

      setMatchedCount((mc) => {
        const nextCount = mc + 1
        if (nextCount >= KIND_TARGET) {
          if (!hasCompleted.current) {
            hasCompleted.current = true
            onComplete(KIND_TARGET)
          }
          window.setTimeout(() => {
            const winMsg = t('kindOrNotKind.youWon')
            setBubbleText(winMsg)
            speakPdfLine(t('kindOrNotKind.winSpeech'), 0.8, 1.2)
            playBeep(1500, 0.5)
            setDone(true)
          }, 2000)
        }
        return nextCount
      })
    },
    [done, endDrag, onComplete, spawnSparkles, t],
  )

  const onPointerDownCard = useCallback(
    (e: React.PointerEvent, idx: number) => {
      if (done || matched.has(idx)) return
      e.preventDefault()
      try {
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      const clone = el.cloneNode(true) as HTMLElement
      clone.className = 'fixed z-[1000] touch-none rounded-[25px] border-[6px] border-white bg-white shadow-lg'
      clone.style.width = '140px'
      clone.style.height = '140px'
      clone.style.left = `${e.clientX - offsetX}px`
      clone.style.top = `${e.clientY - offsetY}px`
      clone.style.display = 'flex'
      clone.style.alignItems = 'center'
      clone.style.justifyContent = 'center'
      clone.style.fontSize = '100px'
      clone.style.cursor = 'grabbing'
      document.body.appendChild(clone)
      el.style.opacity = '0.7'
      dragRef.current = { cardIdx: idx, offsetX, offsetY, el, clone }
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
      document.addEventListener('pointercancel', onPointerUp)
    },
    [done, matched, onPointerMove, onPointerUp],
  )

  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  if (done) {
    return (
      <div className="pdf-kind-bg font-pdf-fredoka relative overflow-hidden rounded-3xl border-4 border-white p-6 text-center shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          {sparkleNodes.map((s) => (
            <div
              key={s.id}
              className="absolute text-2xl"
              style={{
                left: s.x,
                top: s.y,
                fontSize: 20 + Math.random() * 50,
                animation: 'pdf-sparkle-float 1.2s ease-out forwards',
                animationDelay: `${s.delay}s`,
              }}
            >
              {s.ch}
            </div>
          ))}
        </div>
        <h2 className="relative z-10 text-3xl font-extrabold text-white drop-shadow-md">{t('kindOrNotKind.winTitle')}</h2>
        <p className="relative z-10 mt-2 text-xl font-bold text-white">{t('kindOrNotKind.winBody')}</p>
        <p className="relative z-10 mt-4 font-bold text-amber-100">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="relative z-10 mt-4 inline-block primary-button">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="pdf-kind-bg font-pdf-fredoka relative min-h-[520px] overflow-auto rounded-3xl border-4 border-white py-6 shadow-xl">
      <div className="pointer-events-none absolute inset-0">
        {sparkleNodes.map((s) => (
          <div
            key={s.id}
            className="absolute"
            style={{
              left: s.x,
              top: s.y,
              fontSize: 20 + Math.random() * 50,
              animation: 'pdf-sparkle-float 0.8s ease-out forwards',
              animationDelay: `${s.delay}s`,
            }}
          >
            {s.ch}
          </div>
        ))}
      </div>

      <div className="relative z-10 mb-4 flex justify-center">
        <div className={heartBeat ? 'pdf-heart-beat-once' : 'pdf-sparki-idle'}>
          <SparkiFace size={100} />
        </div>
      </div>

      <h2 className="relative z-10 mb-3 text-center text-4xl font-bold text-white drop-shadow">{t('kindOrNotKind.title')}</h2>

      <div className="relative z-10 mx-auto mb-6 max-w-[280px] rounded-[20px] bg-white px-5 py-3 text-center text-xl font-bold text-slate-800 shadow-lg">
        {bubbleText ?? t('kindOrNotKind.dragIntro')}
      </div>

      <p className="relative z-10 mb-4 text-center text-3xl font-bold text-white drop-shadow">
        {t('kindOrNotKind.score', { current: matchedCount, total: KIND_TARGET })}
      </p>

      <div className="relative z-10 mb-10 flex flex-wrap justify-center gap-10 px-4">
        {FACE_CARDS.map((c, idx) => {
          if (matched.has(idx)) return null
          return (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onPointerDown={(e) => onPointerDownCard(e, idx)}
              className="face-card flex h-[140px] w-[140px] cursor-grab touch-none select-none items-center justify-center rounded-[25px] border-[6px] border-white bg-white text-[100px] shadow-[0_8px_0_rgba(0,0,0,0.2)] active:scale-105 active:cursor-grabbing"
            >
              {c.emoji}
            </div>
          )
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center pb-6">
        <div className="mb-2 text-2xl font-bold text-white drop-shadow">{t('kindOrNotKind.basketLabel')}</div>
        <div
          id="kind-basket-zone"
          className={`flex h-[150px] w-[200px] items-center justify-center rounded-[30px] border-[6px] border-[#CC0000] text-7xl shadow-[0_8px_20px_rgba(0,0,0,0.25),inset_0_2px_0_rgba(255,255,255,0.5)] transition-transform ${basketDragOver ? 'scale-110' : ''} ${basketShake ? 'pdf-wiggle' : ''}`}
          style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FF4444)',
          }}
        >
          😊
        </div>
        <p className="mt-3 max-w-xs text-center text-sm text-white/90">{t('kindOrNotKind.dragHint')}</p>
      </div>
    </div>
  )
}

export default KindOrNotKindQuiz
