/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Optional: YouTube, embed URL, or direct .mp4/.webm for the ~60s school pilot demo (e.g. HeyGen export). */
  readonly VITE_SCHOOL_DEMO_VIDEO_URL?: string
  /** Homepage + funnel demo video (falls back to VITE_SCHOOL_DEMO_VIDEO_URL). */
  readonly VITE_TUTOR_FUNNEL_DEMO_VIDEO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

