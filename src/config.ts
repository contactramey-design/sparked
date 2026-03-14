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

export interface AppConfig {
  appName: string
  welcomeMessage: string
  tagline: string
  theme: ThemeConfig
  parentResources: ParentResourcesConfig
  progress: ProgressConfig
  chat: ChatConfig
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
}
