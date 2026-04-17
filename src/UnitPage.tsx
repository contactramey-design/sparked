import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { curriculum, unitAgeBands } from './curriculum'
import { getPlayerStats, updateUnitAfterQuiz, getUnitStatus } from './progress'
import { useTranslation, useLocale } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'
import { useTranslatedUnit, useTranslatedTrack } from './hooks/useTranslatedCurriculum'
import CompletionCelebration from './CompletionCelebration'
import QuizPassSparkleBurst from './components/QuizPassSparkleBurst'
import GameQuiz from './GameQuiz'
import InstagramSafetyQuiz from './InstagramSafetyQuiz'
import TikTokSafetyQuiz from './TikTokSafetyQuiz'
import SnapchatSafetyQuiz from './SnapchatSafetyQuiz'
import RobloxSafetyQuiz from './RobloxSafetyQuiz'
import FortniteSafetyQuiz from './FortniteSafetyQuiz'
import RedditForumsSafetyQuiz from './RedditForumsSafetyQuiz'
import ExampleCollectorQuiz from './ExampleCollectorQuiz'
import BodyCodeChainQuiz from './BodyCodeChainQuiz'
import SoftwareExplorerQuiz from './SoftwareExplorerQuiz'
import WorldAIHelperQuiz from './WorldAIHelperQuiz'
import FairCodeAdventureQuiz from './FairCodeAdventureQuiz'
import DigitalFootprintQuiz from './DigitalFootprintQuiz'
import FairCodeBuilderQuiz from './FairCodeBuilderQuiz'
import AiSortCheerQuiz from './AiSortCheerQuiz'
import ClapHopQuiz from './ClapHopQuiz'
import TotsSoftwareButtonHuntQuiz from './TotsSoftwareButtonHuntQuiz'
import TotsAiHelperMatchQuiz from './TotsAiHelperMatchQuiz'
import KindOrNotKindQuiz from './KindOrNotKindQuiz'
import CrewAiFactOrMistakeQuiz from './CrewAiFactOrMistakeQuiz'
import CrewCodeLogicQuiz from './CrewCodeLogicQuiz'
import CrewSoftwareDetectiveQuiz from './CrewSoftwareDetectiveQuiz'
import CrewAiHumanHelperQuiz from './CrewAiHumanHelperQuiz'
import {
  FoundationsColorSortQuiz,
  FoundationsCountQuiz,
  FoundationsLetterQuiz,
  FoundationsPatternQuiz,
  FoundationsShapeMatchQuiz,
} from './FoundationsTotsQuizzes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ListenButton from './components/ListenButton'
import SparkiAvatar from './components/SparkiAvatar'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

function isYouTubeEmbedUrl(url: string): boolean {
  return /youtube\.com\/embed\/|youtu\.be\//i.test(url)
}

/** Parse contentBlocks into story (first Story/Historia) and rules (rest, with optional prefix label). */
function parseContentBlocks(blocks: string[]) {
  const storyPrefixes = [/^Story:\s*/i, /^Historia:\s*/i]
  const storyBlock = blocks.find((b) => storyPrefixes.some((re) => re.test(b)))
  let story: string | null = null
  if (storyBlock) {
    const prefix = storyPrefixes.find((re) => re.test(storyBlock))
    story = prefix ? storyBlock.replace(prefix, '').trim() : storyBlock.trim()
  }
  const ruleBlocks = blocks.filter((b) => !storyPrefixes.some((re) => re.test(b)))
  const rules = ruleBlocks.map((block) => {
    const match = block.match(/^(Rule|Safety|Kindness|Myth-buster|Idea|Feelings|Pause|Scenario|Examples|Game):\s*(.*)/i)
    const label = match ? match[1] : null
    const text = match ? match[2].trim() : block
    return { label, text }
  })
  return { story, rules }
}

/** MP4 slot with fallback; remount via `key` when unit/locale changes so failed state resets without an effect. */
function UnitMp4VideoSlot({
  videoSrc,
  fallbackVideo,
  posterUrl,
}: {
  videoSrc: string
  fallbackVideo: string
  posterUrl?: string
}) {
  const [videoFailed, setVideoFailed] = useState(false)
  const effectiveVideoSrc = videoFailed ? fallbackVideo : videoSrc
  return (
    <video
      controls
      width="100%"
      poster={posterUrl?.trim() ? posterUrl : VIDEO_POSTER_DATA_URL}
      preload="metadata"
      onError={() => setVideoFailed(true)}
    >
      <source src={effectiveVideoSrc} type="video/mp4" />
      Sorry, your browser does not support embedded videos.
    </video>
  )
}

const UnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { ageBand, recommendedAgesShort } = useAgeBand()
  const unit = curriculum.units.find((u) => u.id === unitId) ?? null
  const translatedUnit = useTranslatedUnit(unit)
  const track = unit ? curriculum.tracks.find((tr) => tr.id === unit.trackId) ?? null : null
  const translatedTrack = useTranslatedTrack(track)
  const displayTrack = translatedTrack ?? track

  const [selected, setSelected] = useState<number[]>(
    unit ? Array(unit.quizQuestions.length).fill(-1) : [],
  )
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [earnedSparkles, setEarnedSparkles] = useState<number | null>(null)

  const existingStatus = unit ? getUnitStatus(unit.id, ageBand) : null
  const wasAlreadyMastered = !!existingStatus?.mastered
  const [mastered, setMastered] = useState<boolean>(wasAlreadyMastered)

  // Video placeholder fallback:
  // If a unit-specific MP4 isn't available yet in `public/`, the player will error.
  // We swap to a shared placeholder so the video slot always renders and plays.
  const [showCelebration, setShowCelebration] = useState(false)
  const [showQuizPassSparkle, setShowQuizPassSparkle] = useState(false)
  const [showLessonBadgeOnReward, setShowLessonBadgeOnReward] = useState(false)

  const [showEndReward, setShowEndReward] = useState(false)
  const [endRewardSparkles, setEndRewardSparkles] = useState(0)
  const [endRewardStreakDays, setEndRewardStreakDays] = useState(0)
  const endRewardTimeoutRef = useRef<number | null>(null)

  const triggerEndReward = (sparkles: number) => {
    if (typeof window === 'undefined') return
    const stats = getPlayerStats(ageBand)
    setEndRewardSparkles(sparkles)
    setEndRewardStreakDays(stats.currentStreakDays)
    setShowEndReward(true)
    if (endRewardTimeoutRef.current) window.clearTimeout(endRewardTimeoutRef.current)
    endRewardTimeoutRef.current = window.setTimeout(() => setShowEndReward(false), 3200)
  }

  const [materialFinished, setMaterialFinished] = useState(false)
  const [instaSlide, setInstaSlide] = useState(0)
  const instaTouchStartXRef = useRef<number | null>(null)
  const instaTouchDeltaXRef = useRef(0)
  const [thinkPromptOpen, setThinkPromptOpen] = useState<number | null>(null)
  const materialEndRef = useRef<HTMLDivElement>(null)
  const quizSectionRef = useRef<HTMLDivElement>(null)

  const nextUnit =
    unit && unit.unlocksUnitId
      ? curriculum.units.find((u) => u.id === unit.unlocksUnitId)
      : null

  useEffect(() => {
    if (materialFinished && quizSectionRef.current) {
      // Scroll only enough to bring quiz into view; don't force it to top (avoids "page break" and cutting off content above)
      quizSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }
  }, [materialFinished])

  if (!unit) {
    navigate('/tracks', { replace: true })
    return null
  }

  if (!unitAgeBands(unit).includes(ageBand)) {
    return (
      <AscentPageChrome
        title={t('ageBand.unitNotInBandTitle')}
        breadcrumb={[
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: t('curriculum.chooseAdventure'), to: '/tracks' },
          { label: t('ageBand.unitNotInBandTitle') },
        ]}
        contentMaxWidthClassName="max-w-lg"
      >
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm">
          <p className="muted text-slate-700">{t('ageBand.unitNotInBandBody')}</p>
          <Link to="/" className="primary-button mt-4 inline-block">
            {t('ageBand.pickBandOnHome')}
          </Link>
        </div>
      </AscentPageChrome>
    )
  }

  const displayUnit = translatedUnit ?? unit
  const isAiUnit = unit.trackId === 'ai-coding' || unit.id.startsWith('ai-')

  const instaImages = [
    '/instasafetyillustration1.jpg',
    '/instagsafetyillustration2.jpg',
    '/instasafetyillustration3.png',
    '/instasafetyillustration4.png',
    '/instasafetyillustration5.png',
    // Filename in public/ is misspelled: illustartion (matches repo asset).
    '/instasafetyillustartion6.jpeg',
    '/instasafetyillustration7.png',
  ]

  const instaCaptionsEn = [
    'Sparki, Byte, and Zap enjoy a sunny picnic with their animal friends, laughing and sharing sandwiches together.',
    'Sparki, Byte, and Zap look at a cute picnic photo on the phone and think about posting it online.',
    'A sneaky stranger tries to follow their account, so Sparki’s heart glows red to warn the squad.',
    'Sparki taps the private settings and blocks the stranger while Byte and Zap cheer for the safety rules.',
    'Sparki, Byte, and Zap show the phone to a kind grown-up who helps them double-check the post.',
    'Together they post safely and only real friends leave kind, happy comments on the picnic photo.',
    'Sparki, Byte, and Zap celebrate staying safe online and promise to always check with a grown-up first.',
  ]
  const instaCaptionsEs = [
    'Sparki, Byte y Zap disfrutan de un picnic al sol con sus amigos animales, riendo y compartiendo sándwiches.',
    'Sparki, Byte y Zap miran una foto divertida del picnic en el teléfono y piensan si deberían publicarla.',
    'Un desconocido intenta seguir su cuenta y el corazón de Sparki se pone rojo para avisar a todo el equipo.',
    'Sparki activa la cuenta privada y bloquea al desconocido mientras Byte y Zap celebran las reglas de seguridad.',
    'Sparki, Byte y Zap le muestran el teléfono a un adulto de confianza que les ayuda a revisar la publicación.',
    'Juntos publican de forma segura y solo los amigos de verdad dejan comentarios amables en la foto del picnic.',
    'Sparki, Byte y Zap celebran que se cuidaron en internet y prometen preguntar siempre a un adulto primero.',
  ]

  const instaCaptions = locale === 'es' ? instaCaptionsEs : instaCaptionsEn
  const currentInstaImage = instaImages[instaSlide] ?? instaImages[0]
  const currentInstaCaption = instaCaptions[instaSlide] ?? ''
  const nextInstaSlide = () => setInstaSlide((prev) => (prev + 1) % instaImages.length)
  const prevInstaSlide = () => setInstaSlide((prev) => (prev - 1 + instaImages.length) % instaImages.length)

  const onInstaTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    instaTouchStartXRef.current = event.touches[0]?.clientX ?? null
    instaTouchDeltaXRef.current = 0
  }

  const onInstaTouchMove: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (instaTouchStartXRef.current === null) return
    const currentX = event.touches[0]?.clientX ?? instaTouchStartXRef.current
    instaTouchDeltaXRef.current = currentX - instaTouchStartXRef.current
  }

  const onInstaTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (instaTouchStartXRef.current === null) return
    if (instaTouchDeltaXRef.current <= -40) nextInstaSlide()
    if (instaTouchDeltaXRef.current >= 40) prevInstaSlide()
    instaTouchStartXRef.current = null
    instaTouchDeltaXRef.current = 0
  }

  const handleChange = (qIndex: number, optionIndex: number) => {
    const next = [...selected]
    next[qIndex] = optionIndex
    setSelected(next)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setError(null)

    if (selected.some((i) => i === -1)) {
      setError(t('unit.answerAllFirst'))
      return
    }

    let correct = 0
    unit.quizQuestions.forEach((q, idx) => {
      if (selected[idx] === q.correctIndex) correct += 1
    })
    setScore(correct)

    const totalQ = unit.quizQuestions.length
    if (totalQ > 0 && correct / totalQ >= 0.8) {
      setShowQuizPassSparkle(true)
      setShowLessonBadgeOnReward(true)
    } else {
      setShowLessonBadgeOnReward(false)
    }

    const result = updateUnitAfterQuiz(unit, correct, totalQ, ageBand)
    setEarnedSparkles(result.earnedThisAttempt)
    triggerEndReward(result.earnedThisAttempt)

    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)

    if (justMastered) {
      setShowCelebration(true)
    }
  }

  const recordQuizResult = (correctCount: number, totalQuestions: number) => {
    if (totalQuestions > 0 && correctCount / totalQuestions >= 0.8) {
      setShowQuizPassSparkle(true)
      setShowLessonBadgeOnReward(true)
    } else {
      setShowLessonBadgeOnReward(false)
    }
    const result = updateUnitAfterQuiz(unit, correctCount, totalQuestions, ageBand)
    setEarnedSparkles(result.earnedThisAttempt)
    triggerEndReward(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (justMastered) {
      setShowCelebration(true)
    }
  }

  const handleDigitalFootprintComplete = (correctCount: number) => recordQuizResult(correctCount, 10)

  const handleSafeAppComplete = (correctCount: number) => recordQuizResult(correctCount, 8)

  const handleTikTokComplete = (correctCount: number) => recordQuizResult(correctCount, 8)

  const handleSnapchatComplete = (correctCount: number) => recordQuizResult(correctCount, 8)

  const handleRobloxComplete = (correctCount: number) => recordQuizResult(correctCount, 8)

  const handleFortniteComplete = (correctCount: number) => recordQuizResult(correctCount, 6)

  const handleRedditComplete = (correctCount: number) => recordQuizResult(correctCount, 8)

  const handleAiSortCheerComplete = (correctCount: number) => recordQuizResult(correctCount, 6)

  const handleAI1Complete = (correctCount: number) => recordQuizResult(correctCount, 10)

  const handleAI2Complete = (correctCount: number) => recordQuizResult(correctCount, 5)

  const handleAI3Complete = (correctCount: number) => recordQuizResult(correctCount, 6)

  const handleAI4Complete = (correctCount: number) => recordQuizResult(correctCount, 6)

  const handleFairBuilderComplete = (correctCount: number) => recordQuizResult(correctCount, 5)

  const handleAI5Complete = (correctCount: number) => recordQuizResult(correctCount, 6)

  const correctCountText =
    score !== null
      ? t('aiCodingGames.gameQuiz.scoreSummary', { score, total: unit.quizQuestions.length })
      : ''

  // Always show the video "slot" at the top of every unit page.
  // If a unit doesn't have its own `videoUrl` configured yet, we fall back to the shared placeholder.
  const fallbackVideo = '/Unit1b_intro_.mp4'
  const videoSrc =
    locale === 'es' && unit.videoUrlEs
      ? unit.videoUrlEs
      : (unit.videoUrl ?? fallbackVideo)
  const showVideo = !!videoSrc

  const foundationVariant = ageBand === 'crew' ? 'crew' : 'tots'
  const showFoundationsQuiz = ageBand === 'tots' || ageBand === 'crew'

  return (
    <AscentPageChrome
      title={displayUnit.title}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('curriculum.chooseAdventure'), to: '/tracks' },
        { label: displayTrack?.title ?? unit.trackId, to: `/track/${unit.trackId}` },
        { label: displayUnit.title },
      ]}
      contentMaxWidthClassName="max-w-3xl"
    >
    <section className="lesson-page unit-page-single">
      <div className="unit-cyber-layer">
        <div className="unit-grid-plane" />
        <div className="unit-polygon" />
        <div className="unit-polygon" />
        <div className="unit-polygon" />
      </div>

      {showCelebration && (
        <CompletionCelebration
          explorerName={
            typeof window !== 'undefined'
              ? window.localStorage.getItem('spark_academy_username') || 'Explorer'
              : 'Explorer'
          }
          unitTitle={displayUnit.title}
          onClose={() => setShowCelebration(false)}
        />
      )}

      <QuizPassSparkleBurst active={showQuizPassSparkle} onDone={() => setShowQuizPassSparkle(false)} />

      {showEndReward && (
        <div className="end-reward-overlay" role="status" aria-live="polite">
          <div className="end-reward-modal card">
            <button
              type="button"
              className="end-reward-close"
              aria-label="Close reward"
              onClick={() => setShowEndReward(false)}
            >
              ×
            </button>
            <h3 className="end-reward-title">{t('unitReward.youEarned', { count: endRewardSparkles })}</h3>
            {showLessonBadgeOnReward && (
              <p className="end-reward-badge font-semibold text-amber-700">{t('unitReward.lessonBadge')}</p>
            )}
            <p className="end-reward-sub">{t('unitReward.comeBackTomorrow')}</p>
            <p className="end-reward-streak">{t('unitReward.currentStreak', { days: endRewardStreakDays })}</p>
          </div>
        </div>
      )}

      <Dialog open={thinkPromptOpen !== null} onOpenChange={(open) => !open && setThinkPromptOpen(null)}>
        <DialogContent className="max-w-md" aria-describedby="think-prompt-desc">
          {displayUnit.thinkPrompts && thinkPromptOpen !== null && displayUnit.thinkPrompts[thinkPromptOpen] && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{displayUnit.thinkPrompts[thinkPromptOpen].label}</DialogTitle>
                  <ListenButton
                    text={`${displayUnit.thinkPrompts[thinkPromptOpen].label}. ${displayUnit.thinkPrompts[thinkPromptOpen].text}`}
                    ariaLabel={t('listenButton.question')}
                    size="sm"
                  />
                </div>
                <DialogDescription id="think-prompt-desc">{displayUnit.thinkPrompts[thinkPromptOpen].text}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setThinkPromptOpen(null)}>{t('curriculum.okThoughtAboutIt')}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <header className="lesson-header">
        <div className="flex flex-wrap items-center gap-3">
          <SparkiAvatar size="md" />
          <div>
            {displayTrack && <p className="welcome-subtitle m-0 font-heading text-base font-bold text-teal-900">{displayTrack.title}</p>}
            <p className="unit-age-disclaimer muted mt-2 text-sm">
              {t('curriculum.ageDisclaimer', { ages: recommendedAgesShort })}
            </p>
          </div>
        </div>
      </header>

      {unit.parentEbook ? (
        <div className="unit-parent-ebook-cta mx-auto mb-4 max-w-4xl rounded-2xl border border-sky-200 bg-sky-50/90 px-4 py-3 shadow-sm sm:px-5 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="m-0 text-sm text-slate-700 sm:max-w-[28rem]">{t('unit.parentEbookHint')}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Link
                to={`/ebook?ebookId=${encodeURIComponent(unit.parentEbook.catalogId)}`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-sky-500 bg-white px-4 py-2 text-center text-sm font-bold text-sky-800 shadow-sm transition-colors hover:bg-sky-100"
              >
                {t('unit.parentEbookCta', {
                  platform: t(`unit.parentEbookPlatform.${unit.parentEbook.platformKey}`),
                })}
              </Link>
              <Link to="/shop" className="text-center text-sm font-semibold text-sky-700 underline-offset-2 hover:underline">
                {t('unit.parentEbookSeeShop')}
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="unit-material-section rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg sm:p-6 md:p-8">
        {showVideo && (
          <div className="video-wrapper mb-8">
            {videoSrc && isYouTubeEmbedUrl(videoSrc) ? (
              <iframe
                src={videoSrc}
                title={`Video for ${displayUnit.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="unit-video-iframe"
              />
            ) : (
              <UnitMp4VideoSlot
                key={`${unit.id}-${locale}`}
                videoSrc={videoSrc}
                fallbackVideo={fallbackVideo}
                posterUrl={unit.videoPosterUrl}
              />
            )}
          </div>
        )}

        {isAiUnit && (
          <Card className="mb-8 border-2 border-amber-200 bg-amber-50/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-xl text-amber-900 md:text-2xl">{t('unit.aiDisclosure.title')}</CardTitle>
                <ListenButton
                  text={t('unit.aiDisclosure.listenText')}
                  ariaLabel={t('unit.aiDisclosure.listenAria')}
                  size="sm"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-base leading-relaxed text-slate-800 md:text-lg">{t('unit.aiDisclosure.body')}</p>
              <ul className="list-disc pl-6 text-slate-800">
                <li>{t('unit.aiDisclosure.bullet1')}</li>
                <li>{t('unit.aiDisclosure.bullet2')}</li>
                <li>{t('unit.aiDisclosure.bullet3')}</li>
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h2 className="text-3xl font-bold text-center text-blue-600 md:text-4xl" style={{ fontSize: 'min(1.75rem, 5vw)' }}>
              {t('curriculum.learnWithSparkiHeading')}
            </h2>
            <ListenButton text={t('curriculum.learnWithSparkiHeading')} ariaLabel={t('listenButton.heading')} size="sm" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <p className="text-center text-lg text-slate-700 md:text-xl" style={{ minHeight: '1.25rem' }}>
              {displayUnit.summary}
            </p>
            <ListenButton text={displayUnit.summary} ariaLabel={t('listenButton.summary')} size="sm" />
          </div>

          {(() => {
            const { story, rules } = parseContentBlocks(displayUnit.contentBlocks)
            return (
              <>
                {rules.length > 0 && (
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {rules.map((rule, index) => {
                      const ruleText = rule.label ? `${rule.label}: ${rule.text}` : rule.text
                      return (
                        <Card key={index} className="border-2 border-blue-100 bg-blue-50/50 shadow-sm">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="flex items-start gap-2 text-left text-lg text-blue-900 flex-1">
                                <span className="mt-0.5 text-2xl" role="img" aria-hidden>🤖</span>
                                <span>
                                  {rule.label && <span className="font-extrabold">{rule.label}: </span>}
                                  {rule.text}
                                </span>
                              </CardTitle>
                              <ListenButton
                                text={ruleText}
                                ariaLabel={t('listenButton.rule', { n: index + 1 })}
                                size="sm"
                                className="flex-shrink-0"
                              />
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {story && (
                  <Card className="border-2 border-pink-200 bg-pink-50/60 shadow-md rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-pink-900 md:text-2xl">
                          {t('curriculum.storyTimeWithSparki')}
                        </CardTitle>
                        <ListenButton
                          text={
                            unit.id === 'safety-instagram' && currentInstaCaption
                              ? `${t('curriculum.storyTimeWithSparki')}. ${story} ${currentInstaCaption}`
                              : `${t('curriculum.storyTimeWithSparki')}. ${story}`
                          }
                          ariaLabel={t('listenButton.story')}
                          size="sm"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-base leading-relaxed text-slate-800 md:text-lg" style={{ fontSize: 'min(1.25rem, 4vw)' }}>
                        {story}
                      </p>
                      {unit.id === 'safety-instagram' ? (
                        <div className="space-y-3 max-w-xl mx-auto text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-full max-w-md relative mx-auto storyboard-card">
                              <div className="storyboard-sparkles" aria-hidden />
                              <div
                                key={currentInstaImage}
                                className="overflow-hidden rounded-3xl border-2 border-pink-200 bg-white shadow-md storyboard-main-slide"
                                onTouchStart={onInstaTouchStart}
                                onTouchMove={onInstaTouchMove}
                                onTouchEnd={onInstaTouchEnd}
                              >
                                <img
                                  src={currentInstaImage}
                                  alt={`Instagram safety illustration ${instaSlide + 1}`}
                                  className="block w-full max-h-64 object-cover storyboard-main-image"
                                />
                              </div>
                            </div>
                            {currentInstaCaption && (
                              <p className="text-sm text-pink-800 text-center px-4 break-words">
                                {currentInstaCaption}
                              </p>
                            )}
                          </div>
                          <div className="overflow-x-auto">
                            <div className="flex gap-3 w-max pr-1">
                              {instaImages.map((src, index) => (
                                <button
                                  key={src}
                                  type="button"
                                  onClick={() => setInstaSlide(index)}
                                  className={`rounded-xl border-2 bg-white/80 shadow-sm overflow-hidden transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 storyboard-thumb ${
                                    instaSlide === index ? 'border-pink-400 scale-[1.02]' : 'border-pink-200 opacity-60'
                                  }`}
                                  style={{ width: 120, flex: '0 0 auto' }}
                                  aria-label={`Instagram safety illustration ${index + 1}`}
                                >
                                  <img
                                    src={src}
                                    alt={`Instagram safety thumbnail ${index + 1}`}
                                    className={`block w-full h-24 object-cover ${
                                      instaSlide === index ? '' : 'blur-[1px]'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <Button type="button" variant="secondary" size="sm" onClick={prevInstaSlide}>
                              {t('schoolGeneratedUnit.prev')}
                            </Button>
                            <Button type="button" variant="secondary" size="sm" onClick={nextInstaSlide}>
                              {t('schoolGeneratedUnit.next')}
                            </Button>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            {instaImages.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setInstaSlide(index)}
                                className={`h-2.5 w-2.5 rounded-full ${
                                  instaSlide === index ? 'bg-pink-500' : 'bg-pink-200'
                                }`}
                                aria-label={`Go to illustration ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )}
              </>
            )
          })()}

          {displayUnit.thinkPrompts && displayUnit.thinkPrompts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 md:text-2xl">{t('curriculum.pauseAndThink')}</h3>
              <div className="flex flex-wrap gap-3">
                {displayUnit.thinkPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    className="min-h-[3rem] border-2 border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    onClick={() => setThinkPromptOpen(index)}
                    aria-label={`Open: ${prompt.label}`}
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Card className="border-2 border-yellow-200 bg-yellow-50/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl text-yellow-900 md:text-2xl">{t('curriculum.unitActivity')}</CardTitle>
                <ListenButton
                  text={`${t('curriculum.unitActivity')}. ${displayUnit.activity.description}`}
                  ariaLabel={t('listenButton.activity')}
                  size="sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-slate-800 md:text-lg" style={{ fontSize: 'min(1.25rem, 4vw)' }}>
                {displayUnit.activity.description}
              </p>
            </CardContent>
          </Card>

          <div ref={materialEndRef} className="unit-material-end w-full flex flex-col items-center justify-center border-t-2 border-dashed border-slate-200 pt-8">
            <Button
              size="lg"
              className="w-full min-h-[3.5rem] max-w-md text-lg shrink-0"
              onClick={() => setMaterialFinished(true)}
              aria-label={t('curriculum.finishedShowQuiz')}
            >
              {t('curriculum.finishedShowQuiz')}
            </Button>
          </div>
        </div>
      </div>

      {materialFinished && (
        <div ref={quizSectionRef} className="unit-quiz-section mt-6" style={{ scrollMarginTop: '1.5rem', scrollMarginBottom: '1.5rem' }}>
      {unit.id === 'safety-instagram' && ageBand === 'crew' && (
        <div className="unit-quiz-section mt-6">
          <DigitalFootprintQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleDigitalFootprintComplete}
          />
        </div>
      )}
      {unit.id === 'safety-instagram' && ageBand !== 'crew' && (
        <div className="unit-quiz-section mt-6">
          <InstagramSafetyQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleSafeAppComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'safety-tiktok' && (
        <div className="unit-quiz-section mt-6">
          <TikTokSafetyQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleTikTokComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'safety-snapchat' && (
        <div className="unit-quiz-section mt-6">
          <SnapchatSafetyQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleSnapchatComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'safety-roblox' && (
        <div className="unit-quiz-section mt-6">
          <RobloxSafetyQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleRobloxComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'safety-fortnite' && (
        <div className="unit-quiz-section mt-6">
          <FortniteSafetyQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleFortniteComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'safety-reddit' && (
        <div className="unit-quiz-section mt-6">
          <RedditForumsSafetyQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleRedditComplete}
          />
        </div>
      )}
      {materialFinished && showFoundationsQuiz && unit.id === 'found-1-colors-sorting' && (
        <div className="unit-quiz-section mt-6">
          <FoundationsColorSortQuiz
            variant={foundationVariant}
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, foundationVariant === 'crew' ? 12 : 8)}
          />
        </div>
      )}
      {materialFinished && showFoundationsQuiz && unit.id === 'found-2-shapes-matching' && (
        <div className="unit-quiz-section mt-6">
          <FoundationsShapeMatchQuiz
            variant={foundationVariant}
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, foundationVariant === 'crew' ? 5 : 3)}
          />
        </div>
      )}
      {materialFinished && showFoundationsQuiz && unit.id === 'found-3-numbers-counting' && (
        <div className="unit-quiz-section mt-6">
          <FoundationsCountQuiz
            variant={foundationVariant}
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, foundationVariant === 'crew' ? 9 : 6)}
          />
        </div>
      )}
      {materialFinished && showFoundationsQuiz && unit.id === 'found-4-letters-sounds' && (
        <div className="unit-quiz-section mt-6">
          <FoundationsLetterQuiz
            variant={foundationVariant}
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, foundationVariant === 'crew' ? 7 : 3)}
          />
        </div>
      )}
      {materialFinished && showFoundationsQuiz && unit.id === 'found-5-patterns-sequences' && (
        <div className="unit-quiz-section mt-6">
          <FoundationsPatternQuiz
            variant={foundationVariant}
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, foundationVariant === 'crew' ? 3 : 2)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-1-what-is-ai' && ageBand === 'tots' && (
        <div className="unit-quiz-section mt-6">
          <AiSortCheerQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAiSortCheerComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-1-what-is-ai' && ageBand === 'crew' && (
        <div className="unit-quiz-section mt-6">
          <CrewAiFactOrMistakeQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 6)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-1-what-is-ai' && ageBand === 'kids' && (
        <div className="unit-quiz-section mt-6">
          <ExampleCollectorQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI1Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-2-coding-games' && ageBand === 'tots' && (
        <div className="unit-quiz-section mt-6">
          <ClapHopQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 5)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-2-coding-games' && ageBand === 'crew' && (
        <div className="unit-quiz-section mt-6">
          <CrewCodeLogicQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 4)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-2-coding-games' && ageBand === 'kids' && (
        <div className="unit-quiz-section mt-6">
          <BodyCodeChainQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI2Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-3-software-explorers' && ageBand === 'tots' && (
        <div className="unit-quiz-section mt-6">
          <TotsSoftwareButtonHuntQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 4)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-3-software-explorers' && ageBand === 'crew' && (
        <div className="unit-quiz-section mt-6">
          <CrewSoftwareDetectiveQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 5)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-3-software-explorers' && ageBand === 'kids' && (
        <div className="unit-quiz-section mt-6">
          <SoftwareExplorerQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI3Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-4-ai-in-the-world' && ageBand === 'tots' && (
        <div className="unit-quiz-section mt-6">
          <TotsAiHelperMatchQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 3)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-4-ai-in-the-world' && ageBand === 'crew' && (
        <div className="unit-quiz-section mt-6">
          <CrewAiHumanHelperQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 8)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-4-ai-in-the-world' && ageBand === 'kids' && (
        <div className="unit-quiz-section mt-6">
          <WorldAIHelperQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI4Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-5-ethical-coding' && ageBand === 'crew' && (
        <div className="unit-quiz-section mt-6">
          <FairCodeBuilderQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleFairBuilderComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-5-ethical-coding' && ageBand === 'tots' && (
        <div className="unit-quiz-section mt-6">
          <KindOrNotKindQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={(c) => recordQuizResult(c, 4)}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-5-ethical-coding' && ageBand === 'kids' && (
        <div className="unit-quiz-section mt-6">
          <FairCodeAdventureQuiz
            unit={displayUnit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI5Complete}
          />
        </div>
      )}
      {unit.id !== 'safety-instagram' && unit.id !== 'safety-tiktok' && unit.id !== 'safety-snapchat' && unit.id !== 'safety-roblox' && unit.id !== 'safety-fortnite' && unit.id !== 'safety-reddit' && unit.id !== 'ai-1-what-is-ai' && unit.id !== 'ai-2-coding-games' && unit.id !== 'ai-3-software-explorers' && unit.id !== 'ai-4-ai-in-the-world' && unit.id !== 'ai-5-ethical-coding' && !unit.id.startsWith('found-') && (
        <div className="unit-quiz-section mt-6">
          <GameQuiz
            unit={displayUnit}
            selected={selected}
            onAnswer={handleChange}
            onSubmit={handleSubmit}
            score={score}
            error={error}
            earnedSparkles={earnedSparkles}
            wasAlreadyMastered={wasAlreadyMastered}
            mastered={mastered}
            nextUnit={nextUnit ?? null}
            correctCountText={correctCountText}
          />
        </div>
      )}
        </div>
      )}
    </section>
    </AscentPageChrome>
  )
}

export default UnitPage
