import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

export type SortColor = 'red' | 'blue' | 'yellow'

export type SortBlock = { id: number; color: SortColor; sorted: boolean }

const COLORS: SortColor[] = ['red', 'blue', 'yellow']

/** Source: GAME 1 SPARKI TOTS — AI Sort & Cheer (PDF). 2 blocks per color, shuffled, pointer drag + clone. */
const TOTAL_BLOCKS = 6

function generateBlocks(): SortBlock[] {
  const list: SortBlock[] = []
  let id = 0
  for (const color of COLORS) {
    for (let i = 0; i < 2; i++) {
      list.push({ id: id++, color, sorted: false })
    }
  }
  const shuffled = [...list]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const COLOR_STYLES: Record<
  SortColor,
  { bg: string; border: string; emoji: string; labelKey: string }
> = {
  red: { bg: '#EF4444', border: '#DC2626', emoji: '❤️', labelKey: 'red' },
  blue: { bg: '#3B82F6', border: '#2563EB', emoji: '💙', labelKey: 'blue' },
  yellow: { bg: '#EAB308', border: '#CA8A04', emoji: '💛', labelKey: 'yellow' },
}

type DragState = {
  blockId: number
  offsetX: number
  offsetY: number
  el: HTMLElement
  clone: HTMLElement
}

function SparkiIdle({ className, size = 80 }: { className?: string; size?: number }) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        <circle cx="50" cy="55" r="32" fill="#FFD93D" stroke="#F4A623" strokeWidth="3" />
        <circle cx="38" cy="48" r="6" fill="#333" />
        <circle cx="62" cy="48" r="6" fill="#333" />
        <circle cx="40" cy="46" r="2" fill="#fff" />
        <circle cx="64" cy="46" r="2" fill="#fff" />
        <path d="M 35 62 Q 50 78 65 62" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
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

function SparkiWinDance({ size = 120 }: { size?: number }) {
  return (
    <div className="pdf-sparki-dance mx-auto mb-4" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        <circle cx="50" cy="55" r="32" fill="#FFD93D" stroke="#F4A623" strokeWidth="3" />
        <circle cx="38" cy="48" r="6" fill="#333" />
        <circle cx="62" cy="48" r="6" fill="#333" />
        <circle cx="40" cy="46" r="2" fill="#fff" />
        <circle cx="64" cy="46" r="2" fill="#fff" />
        <path d="M 32 60 Q 50 82 68 60" stroke="#333" strokeWidth="3" fill="#FF6B6B" strokeLinecap="round" />
        <circle cx="28" cy="58" r="5" fill="#FFB5B5" opacity={0.6} />
        <circle cx="72" cy="58" r="5" fill="#FFB5B5" opacity={0.6} />
        <line x1="50" y1="23" x2="50" y2="10" stroke="#F4A623" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="8" r="5" fill="#FF6B6B" />
        <path d="M 18 48 Q 2 30 8 15" stroke="#F4A623" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 82 48 Q 98 30 92 15" stroke="#F4A623" strokeWidth="4" fill="none" strokeLinecap="round" />
        <polygon points="35,25 40,15 45,22 50,10 55,22 60,15 65,25" fill="#FFD700" stroke="#F4A623" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export interface AiSortCheerQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const AiSortCheerQuiz: React.FC<AiSortCheerQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const [blocks, setBlocks] = useState<SortBlock[]>(() => generateBlocks())
  const [score, setScore] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [bubbleText, setBubbleText] = useState<string | null>(null)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [glowingBasket, setGlowingBasket] = useState<SortColor | null>(null)
  const [hoverBasket, setHoverBasket] = useState<SortColor | null>(null)
  const [sparkiCheer, setSparkiCheer] = useState(false)
  const [wiggleId, setWiggleId] = useState<number | null>(null)
  const [stars, setStars] = useState<{ id: number; x: number; y: number; sx: string; sy: string; ch: string }[]>([])
  const [confetti, setConfetti] = useState<{ id: number; left: string; color: string; shape: string; size: number; dur: number; delay: number }[]>([])

  const dragRef = useRef<DragState | null>(null)
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks
  const appRef = useRef<HTMLDivElement>(null)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const starId = useRef(0)
  const confettiId = useRef(0)
  const hasAnnouncedWin = useRef(false)

  const showSpeech = useCallback((text: string) => {
    setBubbleText(text)
    setBubbleVisible(true)
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => setBubbleVisible(false), 3000)
  }, [])

  useEffect(() => {
    const tid = setTimeout(() => {
      showSpeech(t('aiSortCheer.start'))
      speakPdfLine(t('aiSortCheer.start'), 0.8, 1.2)
    }, 400)
    return () => {
      clearTimeout(tid)
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    }
  }, [showSpeech, t])

  const spawnStarBurst = useCallback((basketEl: HTMLElement) => {
    const app = appRef.current
    if (!app) return
    const br = basketEl.getBoundingClientRect()
    const ar = app.getBoundingClientRect()
    const cx = br.left + br.width / 2 - ar.left
    const cy = br.top + br.height / 2 - ar.top
    const pool = ['⭐', '✨', '🌟', '💫']
    const next: { id: number; x: number; y: number; sx: string; sy: string; ch: string }[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const dist = 40 + Math.random() * 30
      next.push({
        id: starId.current++,
        x: cx,
        y: cy,
        sx: `${Math.cos(angle) * dist}px`,
        sy: `${Math.sin(angle) * dist}px`,
        ch: pool[Math.floor(Math.random() * pool.length)]!,
      })
    }
    setStars((s) => [...s, ...next])
    setTimeout(() => setStars((s) => s.filter((x) => !next.some((n) => n.id === x.id))), 900)
  }, [])

  const spawnConfettiFx = useCallback(() => {
    const colors = ['#EF4444', '#3B82F6', '#EAB308', '#10B981', '#F472B6', '#A78BFA', '#FB923C']
    const shapes = ['●', '■', '▲', '★', '♦']
    const next: { id: number; left: string; color: string; shape: string; size: number; dur: number; delay: number }[] = []
    for (let i = 0; i < 60; i++) {
      next.push({
        id: confettiId.current++,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)]!,
        shape: shapes[Math.floor(Math.random() * shapes.length)]!,
        size: 12 + Math.random() * 16,
        dur: 2 + Math.random() * 2,
        delay: Math.random() * 1.5,
      })
    }
    setConfetti(next)
    setTimeout(() => setConfetti([]), 4500)
  }, [])

  const endDragListeners = useCallback(() => {
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
    let hb: SortColor | null = null
    for (const c of COLORS) {
      const z = document.getElementById(`pdf-basket-${c}`)
      if (!z) continue
      const r = z.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        hb = c
        break
      }
    }
    setHoverBasket(hb)
  }, [])

  const triggerWin = useCallback(() => {
    setGameWon(true)
    showSpeech(t('aiSortCheer.win'))
    speakPdfLine(t('aiSortCheer.win'), 0.8, 1.2)
    spawnConfettiFx()
    if (!hasAnnouncedWin.current) {
      hasAnnouncedWin.current = true
      onComplete(TOTAL_BLOCKS)
    }
  }, [onComplete, showSpeech, spawnConfettiFx, t])

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      const st = dragRef.current
      if (!st) return
      e.preventDefault()
      endDragListeners()
      setHoverBasket(null)
      st.clone.remove()
      st.el.style.opacity = '1'
      dragRef.current = null

      const curBlocks = blocksRef.current
      const block = curBlocks.find((b) => b.id === st.blockId && !b.sorted)
      if (!block || gameWon) return

      let dropped: SortColor | null = null
      for (const c of COLORS) {
        const z = document.getElementById(`pdf-basket-${c}`)
        if (!z) continue
        const r = z.getBoundingClientRect()
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          dropped = c
          break
        }
      }

      if (dropped === block.color) {
        const next = curBlocks.map((b) => (b.id === block.id ? { ...b, sorted: true } : b))
        setBlocks(next)
        const nextScore = next.filter((b) => b.sorted).length
        setScore(nextScore)
        playBeep(1200, 0.25)
        setSparkiCheer(true)
        setTimeout(() => setSparkiCheer(false), 600)
        const greatKeys = ['great1', 'great2', 'great3', 'great4', 'great5'] as const
        const msg = t(`aiSortCheer.${greatKeys[Math.floor(Math.random() * greatKeys.length)]}`)
        showSpeech(msg)
        speakPdfLine(msg, 0.8, 1.2)
        setGlowingBasket(block.color)
        setTimeout(() => setGlowingBasket(null), 1200)
        const basketInner = document.querySelector(`#pdf-basket-${block.color} .pdf-basket-svg-wrap`)
        if (basketInner instanceof HTMLElement) spawnStarBurst(basketInner)
        if (nextScore >= TOTAL_BLOCKS) {
          setTimeout(() => triggerWin(), 600)
        }
      } else if (dropped) {
        playBeep(400, 0.2)
        const tryKeys = ['try1', 'try2', 'try3'] as const
        const msg = t(`aiSortCheer.${tryKeys[Math.floor(Math.random() * tryKeys.length)]}`)
        showSpeech(msg)
        speakPdfLine(msg, 0.85, 1)
        setWiggleId(block.id)
        setTimeout(() => setWiggleId(null), 500)
      }
    },
    [endDragListeners, gameWon, showSpeech, spawnStarBurst, t, triggerWin],
  )

  const onPointerDownBlock = useCallback(
    (e: React.PointerEvent, block: SortBlock) => {
      if (gameWon || block.sorted) return
      e.preventDefault()
      e.stopPropagation()
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      const clone = el.cloneNode(true) as HTMLElement
      clone.className = 'pdf-pop-in fixed z-[1000] pointer-events-none'
      clone.style.width = '80px'
      clone.style.height = '80px'
      clone.style.left = `${e.clientX - offsetX}px`
      clone.style.top = `${e.clientY - offsetY}px`
      clone.style.transition = 'none'
      clone.style.transform = 'scale(1.15) rotate(3deg)'
      document.body.appendChild(clone)
      el.style.opacity = '0.3'
      const colorKey = `instruction_${block.color}` as const
      showSpeech(t(`aiSortCheer.${colorKey}`))
      playBeep(500, 0.08)
      dragRef.current = { blockId: block.id, offsetX, offsetY, el, clone }
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
      document.addEventListener('pointercancel', onPointerUp)
    },
    [gameWon, onPointerMove, onPointerUp, showSpeech, t],
  )

  const resetGame = useCallback(() => {
    setBlocks(generateBlocks())
    setScore(0)
    setGameWon(false)
    hasAnnouncedWin.current = false
    setConfetti([])
    setStars([])
    showSpeech(t('aiSortCheer.start'))
    speakPdfLine(t('aiSortCheer.start'), 0.8, 1.2)
  }, [showSpeech, t])

  const displaySparkles = earnedSparkles ?? unit.sparklesReward
  const active = blocks.filter((b) => !b.sorted)

  if (gameWon) {
    return (
      <div
        ref={appRef}
        className="pdf-ai-sort-bg font-pdf-fredoka relative flex min-h-[420px] flex-col items-center overflow-hidden rounded-3xl border-4 border-white/80 p-4 shadow-xl"
      >
        <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute -top-5"
              style={{
                left: c.left,
                color: c.color,
                fontSize: c.size,
                animation: `pdf-confetti-drop ${c.dur}s ease-in forwards`,
                animationDelay: `${c.delay}s`,
              }}
            >
              {c.shape}
            </div>
          ))}
        </div>
        <div className="relative z-50 flex w-full max-w-md flex-col items-center justify-center rounded-2xl bg-black/20 px-4 py-8 backdrop-blur-sm">
          <SparkiWinDance />
          <div className="mb-2 text-5xl font-bold text-white drop-shadow-lg">🎉 {t('aiSortCheer.winTitle')} 🎉</div>
          <div className="mb-6 text-2xl font-semibold text-white drop-shadow">{t('aiSortCheer.winBody')}</div>
          <p className="mb-4 font-bold text-amber-200">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
          {mastered && nextUnit && (
            <Link to={`/unit/${nextUnit.id}`} className="primary-button mb-3 bg-white text-slate-900">
              {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
            </Link>
          )}
          <button
            type="button"
            className="rounded-full px-8 py-4 text-2xl font-bold text-white shadow-lg active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FFD93D, #4ECDC4)',
              boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
            }}
            onClick={resetGame}
          >
            {t('aiSortCheer.playAgain')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={appRef}
      className="pdf-ai-sort-bg font-pdf-fredoka relative flex min-h-[480px] flex-col items-center overflow-hidden rounded-3xl border-4 border-white/80 shadow-xl"
    >
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute text-2xl"
            style={{
              left: s.x,
              top: s.y,
              ['--sx' as string]: s.sx,
              ['--sy' as string]: s.sy,
              animation: 'pdf-star-burst 0.7s ease-out forwards',
            }}
          >
            {s.ch}
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 top-2 z-50 -translate-x-1/2">
        <div className={sparkiCheer ? 'pdf-sparki-cheer-once' : 'pdf-sparki-idle'}>
          <SparkiIdle size={80} />
        </div>
      </div>

      <div
        className={`instruction-bubble absolute z-40 mt-2 rounded-3xl bg-white/95 px-5 py-2 text-center shadow-lg backdrop-blur transition-opacity duration-300 ${bubbleVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ top: 88, left: '50%', transform: 'translateX(-50%)', maxWidth: 'min(90vw, 420px)' }}
      >
        <span className="text-lg font-bold text-violet-900">{bubbleText ?? '\u00a0'}</span>
      </div>

      <div className="mt-24 w-full px-2 text-center">
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">{t('aiSortCheer.title')}</h2>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-lg text-white">⭐</span>
          <span className="text-xl font-bold text-white drop-shadow">
            {t('aiSortCheer.score', { current: score, total: TOTAL_BLOCKS })}
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex min-h-[140px] max-w-[500px] flex-wrap justify-center gap-4 px-4">
        {active.map((block, idx) => {
          const st = COLOR_STYLES[block.color]
          return (
            <div
              key={block.id}
              role="button"
              tabIndex={0}
              onPointerDown={(e) => onPointerDownBlock(e, block)}
              className={`block-shadow pdf-pop-in flex h-[72px] w-[72px] cursor-grab touch-none items-center justify-center rounded-2xl text-3xl active:cursor-grabbing ${wiggleId === block.id ? 'pdf-wiggle' : ''}`}
              style={{
                background: st.bg,
                border: `4px solid ${st.border}`,
                boxShadow: `0 6px 0 ${st.border}, 0 8px 16px rgba(0,0,0,0.2)`,
                animationDelay: `${idx * 0.08}s`,
              }}
            >
              <span className="pointer-events-none">{st.emoji}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-auto flex w-full justify-center gap-5 px-4 pb-4 pt-2">
        {COLORS.map((c) => {
          const st = COLOR_STYLES[c]
          const id = `pdf-basket-${c}`
          return (
            <div
              key={c}
              id={id}
              className={`flex flex-col items-center transition-transform ${hoverBasket === c ? 'scale-110' : ''}`}
            >
              <div className={`pdf-basket-svg-wrap relative ${glowingBasket === c ? 'pdf-basket-glow' : ''}`}>
                <svg viewBox="0 0 120 100" width={100} height={80} aria-hidden>
                  <path d="M 10 20 L 20 90 Q 60 100 100 90 L 110 20 Z" fill={st.bg} stroke={st.border} strokeWidth="3" />
                  <path d="M 10 20 Q 60 30 110 20 Q 60 10 10 20" fill={st.bg} opacity={0.85} />
                  <ellipse cx="60" cy="20" rx="50" ry="10" fill="none" stroke={st.border} strokeWidth="2" />
                </svg>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ paddingTop: 12 }}
                >
                  <div
                    className="rounded"
                    style={{
                      width: 20,
                      height: 20,
                      background: c === 'red' ? '#FCA5A5' : c === 'blue' ? '#93C5FD' : '#FEF08A',
                      border: `2px solid ${st.border}`,
                    }}
                  />
                </div>
              </div>
              <span className="mt-1 text-sm font-bold text-white drop-shadow">{t(`aiSortCheer.basket.${st.labelKey}`)}</span>
            </div>
          )
        })}
      </div>

      <p className="pb-3 text-center text-xs text-white/90">{t('aiSortCheer.dragHint')}</p>
    </div>
  )
}

export default AiSortCheerQuiz
