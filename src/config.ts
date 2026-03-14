export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}

export interface ParentResourcesConfig {
  handbookPdfUrl: string
}

export interface ProgressConfig {
  totalSparksStorageKey: string
  completedLessonsStorageKey: string
  usernameStorageKey: string
}

export interface ChatConfig {
  baseUrl: string
  model: string
  systemPrompt: string
}

/** Optional cloud TTS (e.g. ElevenLabs) for better voice. Backend must accept POST { text } and return audio (e.g. audio/mpeg). */
export interface TtsConfig {
  /** Set to true to use cloud TTS when endpoint is set */
  useCloud?: boolean
  /** Your backend URL that proxies to ElevenLabs/other TTS (hides API key). POST body: { text: string }, response: audio stream */
  endpoint?: string
}

export interface AppConfig {
  appName: string
  welcomeMessage: string
  tagline: string
  theme: ThemeConfig
  parentResources: ParentResourcesConfig
  progress: ProgressConfig
  chat: ChatConfig
  /** Optional: better read-aloud voice via cloud TTS (e.g. ElevenLabs). Leave unset to use browser voices only. */
  tts?: TtsConfig
}

export const appConfig: AppConfig = {
  appName: "SpArki's Adventures Academy",
  welcomeMessage: 'Welcome, Junior AI Explorer!',
  tagline: 'Learning AI the safe, playful, and human-first way.',
  theme: {
    primaryColor: '#2563eb',   // bright blue
    secondaryColor: '#facc15', // bright yellow
    backgroundColor: '#fef3c7',
    textColor: '#1e293b',
    accentColor: '#ef4444',    // bright red accent
  },
  parentResources: {
    handbookPdfUrl: 'https://example.com/parents-handbook.pdf',
  },
  progress: {
    totalSparksStorageKey: 'spark_academy_total_sparks',
    completedLessonsStorageKey: 'spark_academy_completed_lessons',
    usernameStorageKey: 'spark_academy_username',
  },
  chat: {
    baseUrl: '/api/chat',
    model: 'gpt-4o-mini',
    systemPrompt:
      'You are SpArki, a friendly blue teddy-bear robot teacher for kids ages 5–10. ' +
      'You explain AI, coding, and digital safety in simple, gentle language. ' +
      'You keep kids safe, never ask for private information, and always remind them that ' +
      'human curiosity, kindness, and grown-up guidance come first.',
  },
  // Cloud TTS: add ELEVENLABS_API_KEY to .env (dev) or Vercel env (prod). Falls back to browser voice if API unavailable.
  tts: { useCloud: true, endpoint: '/api/tts' },
}
