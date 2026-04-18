import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { getHomeworkCheckoutSessionId } from '@/progress'

type CharacterId = 'sparki' | 'byte' | 'pixel' | 'zap'

type CharacterDef = {
  name: string
  emoji: string
  color: string
  accent: string
  bg: string
  video: string
  personality: string
}

const CHARACTERS: Record<CharacterId, CharacterDef> = {
  sparki: {
    name: 'Sparki',
    emoji: '🤖',
    color: '#00D4FF',
    accent: '#0A7E8C',
    bg: '#0D1B3E',
    video: '/characters/sparki.mp4',
    personality: 'warm, encouraging, excited',
  },
  byte: {
    name: 'Byte',
    emoji: '🦫',
    color: '#4CAF50',
    accent: '#2E7D32',
    bg: '#0A1F0A',
    video: '/characters/byte.mp4',
    personality: 'clever, methodical, builder',
  },
  pixel: {
    name: 'Pixel',
    emoji: '🐶',
    color: '#FFB300',
    accent: '#E65100',
    bg: '#1F1500',
    video: '/characters/pixel.mp4',
    personality: 'hyper, fun, never gives up',
  },
  zap: {
    name: 'Zap',
    emoji: '🐿️',
    color: '#9C27B0',
    accent: '#4A148C',
    bg: '#150020',
    video: '/characters/zap.mp4',
    personality: 'alert, protective, sharp',
  },
}

type AdventureScene = {
  title: string
  narration: string
  visual: string
  fact: string
}

function parseScript(raw: string): { title?: string; scenes?: AdventureScene[] } | null {
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim()) as { title?: string; scenes?: AdventureScene[] }
  } catch {
    const m = raw.match(/\{[\s\S]*\}/)
    if (m) {
      try {
        return JSON.parse(m[0]) as { title?: string; scenes?: AdventureScene[] }
      } catch {
        return null
      }
    }
    return null
  }
}

function extractAnthropicText(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const content = (data as { content?: unknown }).content
  if (!Array.isArray(content)) return ''
  for (const block of content) {
    if (block && typeof block === 'object' && (block as { type?: string }).type === 'text') {
      const t = (block as { text?: string }).text
      if (typeof t === 'string') return t
    }
  }
  return ''
}

type ScenePlayerProps = {
  scenes: AdventureScene[]
  character: CharacterId
  onFinish?: () => void
}

function ScenePlayer({ scenes, character, onFinish }: ScenePlayerProps) {
  const char = CHARACTERS[character]
  const [sceneIdx, setSceneIdx] = useState(0)
  const [phase, setPhase] = useState<'intro' | 'playing' | 'done'>('intro')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [videoBroken, setVideoBroken] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scene = scenes[sceneIdx]

  useEffect(() => {
    setVideoBroken(false)
  }, [character])

  useEffect(() => {
    if (!scene) return
    setLoadingAudio(true)
    setAudioUrl((prev) => {
      if (prev && prev !== 'error') URL.revokeObjectURL(prev)
      return null
    })

    let createdUrl: string | null = null
    let cancelled = false
    const checkoutSessionId = getHomeworkCheckoutSessionId() ?? ''
    fetch('/api/homework-adventure-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: scene.narration, character, checkout_session_id: checkoutSessionId }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.blob()
      })
      .then((blob) => {
        if (cancelled) return
        createdUrl = URL.createObjectURL(blob)
        setAudioUrl(createdUrl)
      })
      .catch(() => {
        if (!cancelled) setAudioUrl('error')
      })
      .finally(() => {
        if (!cancelled) setLoadingAudio(false)
      })

    return () => {
      cancelled = true
      if (createdUrl) URL.revokeObjectURL(createdUrl)
    }
  }, [sceneIdx, character, scene?.narration])

  useEffect(() => {
    if (!audioUrl || audioUrl === 'error' || !audioRef.current) return
    void audioRef.current.play().catch(() => {})
  }, [audioUrl])

  const handleAudioEnd = () => {
    if (sceneIdx < scenes.length - 1) {
      setSceneIdx((i) => i + 1)
    } else {
      setPhase('done')
      onFinish?.()
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        background: char.bg,
        minHeight: 520,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'rgba(255,255,255,0.1)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: '100%',
            background: char.color,
            width: `${((sceneIdx + 1) / scenes.length) * 100}%`,
            transition: 'width 0.4s ease',
            borderRadius: 2,
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          zIndex: 10,
          fontSize: 13,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {sceneIdx + 1} / {scenes.length}
      </div>

      {phase === 'done' ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 48,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Adventure Complete!</div>
          <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
            {char.name} is so proud of you! 🌟
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '28px 32px 0', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-block',
                background: `${char.color}22`,
                border: `1.5px solid ${char.color}55`,
                borderRadius: 20,
                padding: '6px 16px',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: char.color,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                {char.emoji} Scene {sceneIdx + 1}
              </span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>
              {scene?.title}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              gap: 0,
              padding: '16px 32px 0',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ flexShrink: 0, width: 180, position: 'relative' }}>
              {videoBroken ? (
                <div
                  style={{
                    width: '100%',
                    minHeight: 200,
                    borderRadius: '16px 16px 0 0',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 64,
                  }}
                  aria-hidden
                >
                  {char.emoji}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={char.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setVideoBroken(true)}
                  style={{ width: '100%', borderRadius: '16px 16px 0 0', display: 'block' }}
                />
              )}
              {audioUrl && !loadingAudio && audioUrl !== 'error' ? (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 3,
                    alignItems: 'flex-end',
                  }}
                  aria-hidden
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        borderRadius: 2,
                        background: char.color,
                        animation: `hwSoundwave${i} 0.6s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                        height: 10,
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div
              style={{
                flex: 1,
                marginLeft: 20,
                marginBottom: 0,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '16px 16px 0 0',
                padding: '20px 24px',
                border: '1.5px solid rgba(255,255,255,0.1)',
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12, lineHeight: 1 }}>{scene?.visual}</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: 700, lineHeight: 1.7 }}>
                {scene?.fact}
              </div>
            </div>
          </div>

          <div
            style={{
              margin: '0 32px',
              background: `${char.color}18`,
              border: `1.5px solid ${char.color}44`,
              borderRadius: '0 0 16px 16px',
              padding: '16px 20px',
              marginBottom: 24,
            }}
          >
            {loadingAudio ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `3px solid ${char.color}`,
                    borderTopColor: 'transparent',
                    animation: 'hwSpin 0.8s linear infinite',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                  {char.name} is getting ready...
                </span>
              </div>
            ) : (
              <div style={{ fontSize: 15, color: '#fff', fontWeight: 700, lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;{scene?.narration}&rdquo;
              </div>
            )}
          </div>

          {audioUrl && audioUrl !== 'error' ? (
            <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnd} style={{ display: 'none' }}>
              <track kind="captions" />
            </audio>
          ) : null}

          {audioUrl === 'error' ? (
            <div style={{ padding: '0 32px 24px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Audio unavailable</div>
              <button
                type="button"
                onClick={handleAudioEnd}
                style={{
                  padding: '8px 20px',
                  background: char.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Next Scene →
              </button>
            </div>
          ) : null}
        </div>
      )}

      <style>
        {`
        @keyframes hwSpin { to { transform: rotate(360deg); } }
        @keyframes hwSoundwave1 { 0%,100%{height:6px} 50%{height:16px} }
        @keyframes hwSoundwave2 { 0%,100%{height:10px} 50%{height:22px} }
        @keyframes hwSoundwave3 { 0%,100%{height:8px} 50%{height:18px} }
        @keyframes hwSoundwave4 { 0%,100%{height:4px} 50%{height:12px} }
      `}
      </style>
    </div>
  )
}

export default function HomeworkAdventureVideoPage() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [character, setCharacter] = useState<CharacterId>('sparki')
  const [grade, setGrade] = useState('2')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [scenes, setScenes] = useState<AdventureScene[] | null>(null)
  const [adventureTitle, setAdventureTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const char = CHARACTERS[character]

  const handleFile = useCallback((f: File | null | undefined) => {
    if (!f) return
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'].includes(f.type)) {
      setError(t('homeworkFeature.adventureVideoFileError'))
      return
    }
    setFile(f)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const r = e.target?.result
      if (typeof r === 'string') {
        const base64 = r.split(',')[1]
        setFileData(base64 ?? null)
        setFileType(f.type)
      }
    }
    reader.readAsDataURL(f)
  }, [t])

  const generate = async () => {
    if (!fileData || !fileType) {
      setError(t('homeworkFeature.adventureVideoNeedUpload'))
      return
    }
    setLoading(true)
    setError(null)
    setScenes(null)
    setFinished(false)

    try {
      setLoadingMsg(t('homeworkFeature.adventureVideoPhaseReading'))
      const charInfo = CHARACTERS[character]
      const checkoutSessionId = getHomeworkCheckoutSessionId() ?? ''

      const mediaType =
        fileType === 'application/pdf' ? 'application/pdf' : fileType === 'image/jpg' ? 'image/jpeg' : fileType

      const res = await fetch('/api/homework-adventure-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkout_session_id: checkoutSessionId,
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a children's adventure script writer for Sparki Academy. You create short video adventure scripts for children ages 3-11. The host character is ${charInfo.name} (${charInfo.personality}).

Analyze the homework and return ONLY valid JSON:
{
  "title": "Adventure title (fun, max 6 words)",
  "subject": "detected subject",
  "scenes": [
    {
      "title": "Scene title (3-5 words)",
      "narration": "${charInfo.name} speaking directly to the child about this part of the homework topic. Max 2 sentences. Warm, exciting, age-appropriate. Written as spoken word.",
      "visual": "Single emoji that represents this scene visually",
      "fact": "One fun, simple fact about this topic for the child to read on screen. Max 15 words."
    }
  ]
}

Create exactly 4 scenes that walk through the homework topic step by step. Make it feel like a magical guided tour. Return ONLY the JSON.`,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: fileType === 'application/pdf' ? 'document' : 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: fileData,
                  },
                },
                {
                  type: 'text',
                  text: `Create a ${charInfo.name} video adventure for Grade ${grade === 'K' ? 'Kindergarten' : grade} based on this homework.`,
                },
              ],
            },
          ],
        }),
      })

      setLoadingMsg(t('homeworkFeature.adventureVideoPhaseBuilding', { name: charInfo.name }))
      const data = (await res.json()) as { error?: string | { message?: string }; content?: unknown }
      if (!res.ok) {
        const errMsg =
          typeof data.error === 'string'
            ? data.error
            : data.error && typeof data.error === 'object' && typeof data.error.message === 'string'
              ? data.error.message
              : 'Error'
        throw new Error(errMsg)
      }

      const raw = extractAnthropicText(data)
      const parsed = parseScript(raw)
      if (!parsed?.scenes?.length) {
        throw new Error(t('homeworkFeature.adventureVideoParseError'))
      }

      setAdventureTitle(parsed.title || '')
      setScenes(parsed.scenes)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('homeworkFeature.adventureVideoGenericError'))
    } finally {
      setLoading(false)
      setLoadingMsg('')
    }
  }

  const restart = () => {
    setScenes(null)
    setFile(null)
    setFileData(null)
    setFileType(null)
    setError(null)
    setFinished(false)
    setAdventureTitle('')
  }

  return (
    <>
      <p className="mb-4 text-sm text-slate-600">
        <Link to="/homework" className="font-semibold text-sky-800 underline-offset-2 hover:underline">
          {t('homeworkFeature.adventureVideoBack')}
        </Link>
      </p>

      <div
        style={{
          minHeight: '60vh',
          background: 'linear-gradient(135deg,#0D1B3E 0%,#1B2D5B 50%,#0A1F2E 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: '32px 20px',
          borderRadius: 16,
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 44, display: 'inline-block' }} aria-hidden>
              🤖
            </span>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
              {t('homeworkFeature.adventureVideoBrand')}
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#00D4FF',
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              {t('homeworkFeature.adventureVideoTagline')}
            </div>
          </div>

          {scenes ? (
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 20 }}>
                {char.emoji} {adventureTitle}
              </div>
              <ScenePlayer scenes={scenes} character={character} onFinish={() => setFinished(true)} />
              {finished ? (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={restart}
                    style={{
                      padding: '14px 36px',
                      background: char.color,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 14,
                      fontSize: 18,
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    {t('homeworkFeature.adventureVideoRestart')}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <div
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  borderRadius: 22,
                  padding: '28px 32px',
                  marginBottom: 20,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div style={{ fontSize: 19, fontWeight: 900, color: '#1B2D5B', marginBottom: 4 }}>
                  {t('homeworkFeature.adventureVideoUploadTitle')}
                </div>
                <div style={{ fontSize: 13, color: '#777', fontWeight: 600, marginBottom: 18 }}>
                  {t('homeworkFeature.adventureVideoUploadHint')}
                </div>
                {!file ? (
                  <div
                    role="button"
                    tabIndex={0}
                    style={{
                      border: `3px dashed ${dragging ? '#00D4FF' : '#CBD5E1'}`,
                      borderRadius: 14,
                      padding: '32px 20px',
                      textAlign: 'center',
                      background: dragging ? 'rgba(0,212,255,0.04)' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 10,
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click()
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragging(false)
                      handleFile(e.dataTransfer.files[0])
                    }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <span style={{ fontSize: 44 }} aria-hidden>
                      📄
                    </span>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#1B2D5B' }}>
                      {t('homeworkFeature.adventureVideoDrop')}
                    </div>
                    <div style={{ fontSize: 12, color: '#999', fontWeight: 600 }}>JPG · PNG · WEBP · PDF</div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#E6F9FF',
                      borderRadius: 12,
                      padding: '13px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{fileType === 'application/pdf' ? '📑' : '🖼️'}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#0A3D4A', flex: 1 }}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        setFileData(null)
                        setFileType(null)
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#aaa' }}
                      aria-label={t('homeworkFeature.adventureVideoRemoveFile')}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  borderRadius: 22,
                  padding: '28px 32px',
                  marginBottom: 20,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div style={{ fontSize: 19, fontWeight: 900, color: '#1B2D5B', marginBottom: 16 }}>
                  {t('homeworkFeature.adventureVideoGrade')}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {(['K', '1', '2', '3', '4', '5', '6'] as const).map((g) => {
                    const sel = grade === g
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 20,
                          border: `2px solid ${sel ? '#1B2D5B' : '#E2E8F0'}`,
                          background: sel ? '#1B2D5B' : '#F8FAFC',
                          color: sel ? '#fff' : '#555',
                          fontWeight: 800,
                          fontSize: 14,
                          cursor: 'pointer',
                        }}
                      >
                        {g === 'K' ? t('homeworkFeature.adventureVideoK') : t('homeworkFeature.adventureVideoGradeN', { n: g })}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  borderRadius: 22,
                  padding: '28px 32px',
                  marginBottom: 20,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div style={{ fontSize: 19, fontWeight: 900, color: '#1B2D5B', marginBottom: 6 }}>
                  {t('homeworkFeature.adventureVideoHostTitle')}
                </div>
                <div style={{ fontSize: 13, color: '#777', fontWeight: 600, marginBottom: 18 }}>
                  {t('homeworkFeature.adventureVideoHostHint')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                  {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => {
                    const c = CHARACTERS[id]
                    const sel = character === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCharacter(id)}
                        style={{
                          border: `3px solid ${sel ? c.color : '#E2E8F0'}`,
                          borderRadius: 16,
                          padding: '14px 16px',
                          cursor: 'pointer',
                          background: sel ? `${c.color}12` : '#F8FAFC',
                          textAlign: 'left',
                          position: 'relative',
                          transform: sel ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: sel ? `0 4px 20px ${c.color}40` : 'none',
                          transition: 'all 0.18s',
                        }}
                      >
                        {sel ? (
                          <div
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: c.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              color: '#fff',
                              fontWeight: 900,
                            }}
                          >
                            ✓
                          </div>
                        ) : null}
                        <span style={{ fontSize: 32, display: 'block', marginBottom: 6 }}>{c.emoji}</span>
                        <div style={{ fontSize: 17, fontWeight: 900, color: sel ? c.accent : '#1B2D5B' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginTop: 2 }}>{c.personality}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  borderRadius: 22,
                  padding: '28px 32px',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
                }}
              >
                {error ? (
                  <div
                    style={{
                      background: '#FFF0F0',
                      border: '2px solid #F44336',
                      borderRadius: 10,
                      padding: '14px 18px',
                      color: '#C62828',
                      fontWeight: 700,
                      fontSize: 14,
                      marginBottom: 16,
                    }}
                  >
                    ⚠️ {error}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => void generate()}
                  disabled={loading || !fileData}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: !fileData || loading ? '#CBD5E1' : `linear-gradient(135deg,${char.accent},${char.color})`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    fontSize: 19,
                    fontWeight: 900,
                    cursor: !fileData || loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {loading ? (
                    <>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          border: '3px solid rgba(255,255,255,0.4)',
                          borderTopColor: '#fff',
                          animation: 'hwSpin 0.8s linear infinite',
                        }}
                      />
                      {loadingMsg}
                    </>
                  ) : (
                    `${char.emoji} ${t('homeworkFeature.adventureVideoStart')}`
                  )}
                </button>
                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: '#888', fontWeight: 700 }}>
                  {t('homeworkFeature.adventureVideoStartHint', { name: char.name })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes hwSpin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
