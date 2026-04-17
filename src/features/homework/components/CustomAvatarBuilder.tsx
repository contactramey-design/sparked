import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'
import type { CustomAvatarState, HairStyle, ShirtHue, SkinTone } from '../lib/homeworkAvatarSession'
import {
  loadCustomAvatarState,
  saveCustomAvatarState,
  getUseCustomAvatar,
  setUseCustomAvatar,
  saveAvatarPreviewDataUrl,
} from '../lib/homeworkAvatarSession'

function drawAvatarPreview(canvas: HTMLCanvasElement, state: CustomAvatarState) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  const skin: Record<SkinTone, string> = {
    light: '#fcd5b8',
    medium: '#d4a574',
    deep: '#8d5524',
    deepBrown: '#5c3a21',
  }
  const shirt: Record<ShirtHue, string> = {
    yellow: '#facc15',
    teal: '#14b8a6',
    red: '#ef4444',
    purple: '#a855f7',
    green: '#22c55e',
    orange: '#f97316',
  }
  ctx.fillStyle = shirt[state.shirtHue]
  ctx.fillRect(w * 0.2, h * 0.52, w * 0.6, h * 0.38)
  ctx.fillStyle = skin[state.skinTone]
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.38, w * 0.22, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1e293b'
  const hairY = h * 0.22
  if (state.hairStyle === 'short') {
    ctx.fillRect(w * 0.32, hairY, w * 0.36, h * 0.2)
  } else if (state.hairStyle === 'curly') {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.arc(w * (0.3 + i * 0.1), hairY + 8, 10, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (state.hairStyle === 'ponytail') {
    ctx.fillRect(w * 0.32, hairY, w * 0.36, h * 0.16)
    ctx.beginPath()
    ctx.arc(w * 0.78, h * 0.35, w * 0.08, 0, Math.PI * 2)
    ctx.fill()
  } else if (state.hairStyle === 'puffs') {
    ctx.beginPath()
    ctx.arc(w * 0.35, hairY + 10, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(w * 0.65, hairY + 10, 14, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillRect(w * 0.28, hairY, w * 0.44, h * 0.18)
  }
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(w * 0.42, h * 0.36, 3, 0, Math.PI * 2)
  ctx.arc(w * 0.58, h * 0.36, 3, 0, Math.PI * 2)
  ctx.fill()
}

type Props = {
  disabled?: boolean
  onChange?: () => void
}

export function CustomAvatarBuilder({ disabled, onChange }: Props) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<CustomAvatarState>(() => loadCustomAvatarState())
  const [useCustom, setUseCustom] = useState(() => getUseCustomAvatar())

  const paint = (next: CustomAvatarState) => {
    const c = canvasRef.current
    if (c) {
      drawAvatarPreview(c, next)
      try {
        saveAvatarPreviewDataUrl(c.toDataURL('image/png'))
      } catch {
        saveAvatarPreviewDataUrl(null)
      }
    }
  }

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    c.width = 140
    c.height = 140
    paint(state)
  }, [state])

  const update = (partial: Partial<CustomAvatarState>) => {
    const next = { ...state, ...partial }
    setState(next)
    saveCustomAvatarState(next)
    onChange?.()
  }

  const toggleUse = (checked: boolean) => {
    setUseCustomAvatar(checked)
    setUseCustom(checked)
    onChange?.()
  }

  const hairOptions: HairStyle[] = ['short', 'curly', 'ponytail', 'puffs', 'wavy']
  const skinOptions: SkinTone[] = ['light', 'medium', 'deep', 'deepBrown']
  const shirtOptions: ShirtHue[] = ['yellow', 'teal', 'red', 'purple', 'green', 'orange']

  return (
    <div className="homework-custom-avatar mt-4 rounded-xl border border-blue-100 bg-sky-50/50 p-4">
      <label className="flex items-center gap-2 cursor-pointer font-semibold text-blue-900">
        <input
          type="checkbox"
          checked={useCustom}
          disabled={disabled}
          onChange={(e) => toggleUse(e.target.checked)}
        />
        {t('homeworkFeature.customAvatarUseToggle')}
      </label>
      <p className="text-sm text-slate-600 mt-1 mb-3">{t('homeworkFeature.customAvatarHint')}</p>

      <div className="flex flex-wrap gap-4 items-start">
        <canvas
          ref={canvasRef}
          className="rounded-xl border-2 border-white shadow-md bg-white shrink-0"
          aria-hidden
        />
        <div className="flex-1 min-w-[200px] space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              {t('homeworkFeature.customAvatarHair')}
            </p>
            <select
              className="w-full rounded-lg border border-blue-200 px-2 py-2 text-sm"
              disabled={disabled || !useCustom}
              value={state.hairStyle}
              onChange={(e) => update({ hairStyle: e.target.value as HairStyle })}
            >
              {hairOptions.map((h) => (
                <option key={h} value={h}>
                  {t(`homeworkFeature.hairStyle.${h}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              {t('homeworkFeature.customAvatarSkin')}
            </p>
            <select
              className="w-full rounded-lg border border-blue-200 px-2 py-2 text-sm"
              disabled={disabled || !useCustom}
              value={state.skinTone}
              onChange={(e) => update({ skinTone: e.target.value as SkinTone })}
            >
              {skinOptions.map((s) => (
                <option key={s} value={s}>
                  {t(`homeworkFeature.skinTone.${s}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              {t('homeworkFeature.customAvatarShirt')}
            </p>
            <select
              className="w-full rounded-lg border border-blue-200 px-2 py-2 text-sm"
              disabled={disabled || !useCustom}
              value={state.shirtHue}
              onChange={(e) => update({ shirtHue: e.target.value as ShirtHue })}
            >
              {shirtOptions.map((sh) => (
                <option key={sh} value={sh}>
                  {t(`homeworkFeature.shirtHue.${sh}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
