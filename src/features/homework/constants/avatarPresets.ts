/**
 * Preset learner looks for story scene art (text-only prompts; no real faces).
 * Descriptions are English for consistent Flux results regardless of UI locale.
 */
export type AvatarPreset = {
  id: string
  /** i18n key for short label */
  labelKey: string
  /** Passed to /api/generate-visuals as avatar_description */
  imagePromptDescription: string
}

export const HOMEWORK_AVATAR_PRESETS: readonly AvatarPreset[] = [
  {
    id: 'curly-hoodie',
    labelKey: 'homeworkFeature.avatarPresetCurly',
    imagePromptDescription:
      'cartoon child with curly brown hair, warm medium skin, big friendly eyes, wearing a sunny yellow hoodie',
  },
  {
    id: 'ponytail-teal',
    labelKey: 'homeworkFeature.avatarPresetPonytail',
    imagePromptDescription:
      'cartoon child with dark hair in a ponytail, light brown skin, glasses, wearing a teal T-shirt',
  },
  {
    id: 'short-blonde',
    labelKey: 'homeworkFeature.avatarPresetShortBlonde',
    imagePromptDescription:
      'cartoon child with short blonde hair, fair skin, freckles, wearing a red backpack and green shirt',
  },
  {
    id: 'puffs-purple',
    labelKey: 'homeworkFeature.avatarPresetPuffs',
    imagePromptDescription:
      'cartoon child with two puffs hairstyle, deep brown skin, bright smile, wearing a purple sweater',
  },
  {
    id: 'wavy-cap',
    labelKey: 'homeworkFeature.avatarPresetCap',
    imagePromptDescription:
      'cartoon child with wavy black hair under a blue cap, olive skin, wearing an orange jacket',
  },
] as const

export function getAvatarPreset(id: string | undefined): AvatarPreset {
  const found = HOMEWORK_AVATAR_PRESETS.find((p) => p.id === id)
  return found ?? HOMEWORK_AVATAR_PRESETS[0]
}
