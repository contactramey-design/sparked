/**
 * Ephemeral homework "hero" look for scene generation — sessionStorage only (no server kid profiles).
 */
const STORAGE_CUSTOM = 'sparki_homework_custom_avatar_v1'
const STORAGE_USE_CUSTOM = 'sparki_homework_use_custom_avatar_v1'
const STORAGE_PREVIEW = 'sparki_homework_avatar_preview_v1'

export type HairStyle = 'short' | 'curly' | 'ponytail' | 'puffs' | 'wavy'
export type SkinTone = 'light' | 'medium' | 'deep' | 'deepBrown'
export type ShirtHue = 'yellow' | 'teal' | 'red' | 'purple' | 'green' | 'orange'

export type CustomAvatarState = {
  hairStyle: HairStyle
  skinTone: SkinTone
  shirtHue: ShirtHue
}

const DEFAULT_CUSTOM: CustomAvatarState = {
  hairStyle: 'short',
  skinTone: 'medium',
  shirtHue: 'teal',
}

function readJson<T>(key: string): T | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function loadCustomAvatarState(): CustomAvatarState {
  return readJson<CustomAvatarState>(STORAGE_CUSTOM) ?? { ...DEFAULT_CUSTOM }
}

export function saveCustomAvatarState(state: CustomAvatarState): void {
  try {
    sessionStorage.setItem(STORAGE_CUSTOM, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

export function getUseCustomAvatar(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(STORAGE_USE_CUSTOM) === '1'
}

export function setUseCustomAvatar(use: boolean): void {
  try {
    if (use) sessionStorage.setItem(STORAGE_USE_CUSTOM, '1')
    else sessionStorage.removeItem(STORAGE_USE_CUSTOM)
  } catch {
    /* ignore */
  }
}

/** English prompt fragment for Flux (consistent with preset style). */
export function customAvatarToPrompt(state: CustomAvatarState): string {
  const hair: Record<HairStyle, string> = {
    short: 'short neat hair',
    curly: 'curly hair',
    ponytail: 'hair in a ponytail',
    puffs: 'two puffs hairstyle',
    wavy: 'wavy hair',
  }
  const skin: Record<SkinTone, string> = {
    light: 'light skin tone',
    medium: 'warm medium skin tone',
    deep: 'deep brown skin',
    deepBrown: 'rich deep brown skin',
  }
  const shirt: Record<ShirtHue, string> = {
    yellow: 'a sunny yellow hoodie',
    teal: 'a teal T-shirt',
    red: 'a red shirt',
    purple: 'a purple sweater',
    green: 'a green shirt',
    orange: 'an orange jacket',
  }
  return `cartoon child with ${hair[state.hairStyle]}, ${skin[state.skinTone]}, big friendly eyes, wearing ${shirt[state.shirtHue]} — Pixar-style 3D co-hero, not photorealistic, no identifiable real person`
}

export function saveAvatarPreviewDataUrl(dataUrl: string | null): void {
  try {
    if (dataUrl) sessionStorage.setItem(STORAGE_PREVIEW, dataUrl)
    else sessionStorage.removeItem(STORAGE_PREVIEW)
  } catch {
    /* quota — preview optional */
  }
}

export function loadAvatarPreviewDataUrl(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    return sessionStorage.getItem(STORAGE_PREVIEW)
  } catch {
    return null
  }
}

/** Effective description for /api/generate-visuals */
export function getAvatarDescriptionForGeneration(presetImagePrompt: string): string {
  if (getUseCustomAvatar()) {
    const st = loadCustomAvatarState()
    return customAvatarToPrompt(st)
  }
  return presetImagePrompt
}
