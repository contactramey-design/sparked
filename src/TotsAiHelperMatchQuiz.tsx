import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

/** Sparki Tots — Game 4: AI Helper Match. Drag cards to basket in order Hospital → Farm → School. */
type TargetKey = 'Hospital' | 'Farm' | 'School'

const SEQUENCE: { name: TargetKey; cardEmoji: string; basketEmoji: string }[] = [
  { name: 'Hospital', cardEmoji: '🏥', basketEmoji: '🩹' },
  { name: 'Farm', cardEmoji: '🚜', basketEmoji: '🌾' },
  { name: 'School', cardEmoji: '🏫', basketEmoji: '📚' },
]

export interface TotsAiHelperMatchQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const TotsAiHelperMatchQuiz: React.FC<TotsAiHelperMatchQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const [matched, setMatched] = useState<Set<TargetKey>>(new Set())
  const matchedRef = useRef(matched)
  matchedRef.current = matched
  const [bubble, setBubble] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [basketOver, setBasketOver] = useState(false)
  const doneRef = useRef(done)
  doneRef.current = done

  const targetIndex = SEQUENCE.findIndex((s) => !matched.has(s.name))
  const current = targetIndex >= 0 ? SEQUENCE[targetIndex]! : null

  const onPointerDown = (e: React.PointerEvent, name: TargetKey) => {
    if (doneRef.current || matchedRef.current.has(name)) return
    e.preventDefault()
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    const clone = el.cloneNode(true) as HTMLElement
    clone.className =
      'fixed z-[1000] flex h-[120px] w-[120px] touch-none items-center justify-center rounded-[20px] border-[5px] border-white text-7xl shadow-xl'
    clone.style.left = `${e.clientX - offsetX}px`
    clone.style.top = `${e.clientY - offsetY}px`
    document.body.appendChild(clone)
    el.style.opacity = '0.7'

    const move = (ev: PointerEvent) => {
      ev.preventDefault()
      clone.style.left = `${ev.clientX - offsetX}px`
      clone.style.top = `${ev.clientY - offsetY}px`
      const b = document.getElementById('tots-helper-basket')
      if (b) {
        const r = b.getBoundingClientRect()
        setBasketOver(ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom)
      }
    }

    const up = (ev: PointerEvent) => {
      ev.preventDefault()
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      document.removeEventListener('pointercancel', up)
      setBasketOver(false)
      clone.remove()
      el.style.opacity = '1'

      if (doneRef.current || matchedRef.current.has(name)) return

      const expect = SEQUENCE.find((s) => !matchedRef.current.has(s.name))?.name
      if (!expect) return

      const b = document.getElementById('tots-helper-basket')
      let over = false
      if (b) {
        const r = b.getBoundingClientRect()
        over = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom
      }
      if (!over) return

      if (name !== expect) {
        playBeep(400, 0.2)
        setBubble(t('totsAiHelperMatch.wrongOrder'))
        speakPdfLine(t('totsAiHelperMatch.wrongOrder'), 0.8, 1.1)
        return
      }

      playBeep(1200, 0.28)
      const prevSize = matchedRef.current.size
      setMatched((prev) => new Set(prev).add(name))
      el.style.transition = 'all 0.4s ease'
      el.style.transform = 'scale(0)'
      el.style.opacity = '0'
      el.style.pointerEvents = 'none'
      const cheers = ['great1', 'great2', 'great3', 'great4'] as const
      const msg = t(`totsAiHelperMatch.${cheers[prevSize % cheers.length]}`)
      setBubble(msg)
      speakPdfLine(msg, 0.8, 1.2)

      const nextCount = prevSize + 1
      if (nextCount >= SEQUENCE.length) {
        setDone(true)
        onComplete(SEQUENCE.length)
        window.setTimeout(() => {
          setBubble(t('totsAiHelperMatch.winBubble'))
          speakPdfLine(t('totsAiHelperMatch.winSpeech'), 0.8, 1.2)
          playBeep(1500, 0.45)
        }, 600)
      }
    }

    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
    document.addEventListener('pointercancel', up)
    setBubble(t('totsAiHelperMatch.dragIntro'))
  }

  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  if (done) {
    return (
      <div className="font-pdf-fredoka pdf-kind-bg relative overflow-hidden rounded-3xl border-4 border-white p-8 text-center shadow-2xl">
        <h2 className="text-4xl font-bold text-white drop-shadow">{t('totsAiHelperMatch.winTitle')}</h2>
        <p className="mt-3 text-xl text-white">{t('totsAiHelperMatch.winBody')}</p>
        <p className="mt-4 font-bold text-amber-100">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="mt-4 inline-block primary-button">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="font-pdf-fredoka pdf-kind-bg relative min-h-[520px] overflow-auto rounded-3xl border-4 border-white py-6 shadow-xl">
      <h2 className="text-center text-4xl font-bold text-white drop-shadow">{t('totsAiHelperMatch.title')}</h2>
      <div className="mx-auto mt-3 max-w-xs rounded-2xl bg-white px-4 py-2 text-center text-base font-bold text-slate-800 shadow">
        {bubble ?? t('totsAiHelperMatch.startBubble')}
      </div>
      <p className="mt-2 text-center text-2xl font-bold text-white">
        {t('totsAiHelperMatch.score', { current: matched.size, total: SEQUENCE.length })}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-12 px-4">
        {SEQUENCE.map((s) =>
          matched.has(s.name) ? null : (
            <div
              key={s.name}
              role="button"
              tabIndex={0}
              onPointerDown={(e) => onPointerDown(e, s.name)}
              className={`flex h-[120px] w-[120px] cursor-grab touch-none items-center justify-center rounded-[20px] border-[5px] border-white text-7xl shadow-[0_8px_0_rgba(0,0,0,0.2)] active:cursor-grabbing ${
                s.name === 'Hospital'
                  ? 'bg-gradient-to-br from-[#FF6B6B] to-[#FF4444]'
                  : s.name === 'Farm'
                    ? 'bg-gradient-to-br from-[#43e97b] to-[#38a169]'
                    : 'bg-gradient-to-br from-[#4facfe] to-[#1e90ff]'
              }`}
            >
              {s.cardEmoji}
            </div>
          ),
        )}
      </div>

      <div className="mt-10 flex flex-col items-center pb-8">
        <p className="mb-2 text-2xl font-bold text-white drop-shadow">{t('totsAiHelperMatch.basketLabel')}</p>
        <div
          id="tots-helper-basket"
          className={`flex min-h-[150px] w-[200px] flex-col items-center justify-center rounded-[30px] border-[6px] border-[#F4A623] bg-gradient-to-br from-[#FFD93D] to-[#FFC700] shadow-lg transition-transform ${basketOver ? 'scale-110' : ''}`}
        >
          <span className="text-8xl">{current?.basketEmoji ?? '✨'}</span>
        </div>
      </div>
    </div>
  )
}

export default TotsAiHelperMatchQuiz
