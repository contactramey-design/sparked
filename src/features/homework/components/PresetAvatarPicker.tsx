import { useTranslation } from '@/contexts/LocaleContext'
import { HOMEWORK_AVATAR_PRESETS, getAvatarPreset, type AvatarPreset } from '../constants/avatarPresets'

type Props = {
  valueId: string | undefined
  onChange: (preset: AvatarPreset) => void
  disabled?: boolean
}

export function PresetAvatarPicker({ valueId, onChange, disabled }: Props) {
  const { t } = useTranslation()
  const current = getAvatarPreset(valueId)

  return (
    <div className="homework-avatar-picker" role="group" aria-label={t('homeworkFeature.avatarPickerAria')}>
      <p className="text-sm font-semibold text-blue-900 mb-2">{t('homeworkFeature.avatarPickerHeading')}</p>
      <div className="flex flex-wrap gap-2">
        {HOMEWORK_AVATAR_PRESETS.map((preset) => {
          const active = preset.id === current.id
          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(preset)}
              className={`homework-avatar-preset ${active ? 'homework-avatar-preset--active' : ''}`}
              aria-pressed={active}
              aria-label={t(preset.labelKey)}
            >
              <span className="homework-avatar-preset__face" data-preset={preset.id} aria-hidden />
              <span className="homework-avatar-preset__label">{t(preset.labelKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
