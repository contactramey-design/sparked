import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { curriculum } from './curriculum'
import { updateUnitAfterQuiz, getUnitStatus, getHasSafetyPass } from './progress'
import CompletionCelebration from './CompletionCelebration'
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
import { VIDEO_POSTER_DATA_URL } from './videoPoster'

function isYouTubeEmbedUrl(url: string): boolean {
  return /youtube\.com\/embed\/|youtu\.be\//i.test(url)
}

/** Parse contentBlocks into story (first "Story:") and rules (rest, with optional prefix label). */
function parseContentBlocks(blocks: string[]) {
  const storyBlock = blocks.find((b) => /^Story:/i.test(b))
  const story = storyBlock ? storyBlock.replace(/^Story:\s*/i, '').trim() : null
  const ruleBlocks = blocks.filter((b) => !/^Story:/i.test(b))
  const rules = ruleBlocks.map((block) => {
    const match = block.match(/^(Rule|Safety|Kindness|Myth-buster|Idea|Feelings|Pause|Scenario|Examples|Game):\s*(.*)/i)
    const label = match ? match[1] : null
    const text = match ? match[2].trim() : block
    return { label, text }
  })
  return { story, rules }
}

const UnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const unit = curriculum.units.find((u) => u.id === unitId)

  const [selected, setSelected] = useState<number[]>(
    unit ? Array(unit.quizQuestions.length).fill(-1) : [],
  )
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [earnedSparkles, setEarnedSparkles] = useState<number | null>(null)

  const existingStatus = unit ? getUnitStatus(unit.id) : null
  const wasAlreadyMastered = !!existingStatus?.mastered
  const [mastered, setMastered] = useState<boolean>(wasAlreadyMastered)
  const [showCelebration, setShowCelebration] = useState(false)
  const hasSafetyPass = getHasSafetyPass()

  const [materialFinished, setMaterialFinished] = useState(false)
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

  const track = curriculum.tracks.find((t) => t.id === unit.trackId)

  const isPaidSafety =
    unit.trackId === 'social-safety' && !unit.isFree
  const lockedByPayment = isPaidSafety && !hasSafetyPass

  const handleChange = (qIndex: number, optionIndex: number) => {
    const next = [...selected]
    next[qIndex] = optionIndex
    setSelected(next)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setError(null)

    if (selected.some((i) => i === -1)) {
      setError('Please answer all questions before checking your score.')
      return
    }

    let correct = 0
    unit.quizQuestions.forEach((q, idx) => {
      if (selected[idx] === q.correctIndex) correct += 1
    })
    setScore(correct)

    const result = updateUnitAfterQuiz(unit, correct, unit.quizQuestions.length)
    setEarnedSparkles(result.earnedThisAttempt)

    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)

    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleSafeAppComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleTikTokComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleSnapchatComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleRobloxComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleFortniteComplete = (correctCount: number) => {
    const total = 6
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleRedditComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleAI1Complete = (correctCount: number) => {
    const total = 10
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleAI2Complete = (correctCount: number) => {
    const total = 5
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleAI3Complete = (correctCount: number) => {
    const total = 6
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleAI4Complete = (correctCount: number) => {
    const total = 6
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleAI5Complete = (correctCount: number) => {
    const total = 6
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const correctCountText =
    score !== null
      ? `You got ${score} out of ${unit.quizQuestions.length} correct.`
      : ''

  const videoSrc = unit.videoUrl ?? (unit.id === 'ai-1-what-is-ai' ? '/Unit1b_intro_.mp4' : undefined)
  const showVideo = !!videoSrc

  if (lockedByPayment) {
    return (
      <section className="lesson-page unit-page-single">
        <div className="unit-cyber-layer">
          <div className="unit-grid-plane" />
          <div className="unit-polygon" />
          <div className="unit-polygon" />
          <div className="unit-polygon" />
        </div>

        <header className="lesson-header">
          <div>
            <h2>{unit.title}</h2>
            {track && <p className="welcome-subtitle">{track.title}</p>}
          </div>
          <Link to={`/track/${unit.trackId}`} className="link-back">
            ← Back to Track
          </Link>
        </header>

        <div className="unit-material-section card">
          <h3>Locked for kids</h3>
          <p>
            This safety lesson is available when a grown-up turns on the Safety Pass
            in the Parent area. One safety unit is always free so kids can learn core
            rules without any purchase.
          </p>
          <Link to="/parent" className="secondary-button">
            Grown-up? Open Parent view
          </Link>
        </div>
      </section>
    )
  }

  return (
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
          unitTitle={unit.title}
          onClose={() => setShowCelebration(false)}
        />
      )}

      <Dialog open={thinkPromptOpen !== null} onOpenChange={(open) => !open && setThinkPromptOpen(null)}>
        <DialogContent className="max-w-md" aria-describedby="think-prompt-desc">
          {unit.thinkPrompts && thinkPromptOpen !== null && unit.thinkPrompts[thinkPromptOpen] && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{unit.thinkPrompts[thinkPromptOpen].label}</DialogTitle>
                  <ListenButton
                    text={`${unit.thinkPrompts[thinkPromptOpen].label}. ${unit.thinkPrompts[thinkPromptOpen].text}`}
                    ariaLabel="Listen to this question"
                    size="sm"
                  />
                </div>
                <DialogDescription id="think-prompt-desc">{unit.thinkPrompts[thinkPromptOpen].text}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setThinkPromptOpen(null)}>OK, I thought about it!</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <header className="lesson-header">
        <div>
          <h2>{unit.title}</h2>
          {track && <p className="welcome-subtitle">{track.title}</p>}
        </div>
        <Link to={`/track/${unit.trackId}`} className="link-back">
          ← Back to Track
        </Link>
      </header>

      <div className="unit-material-section rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg md:p-8">
        {showVideo && (
          <div className="video-wrapper mb-8">
            {videoSrc && isYouTubeEmbedUrl(videoSrc) ? (
              <iframe
                src={videoSrc}
                title={`Video for ${unit.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="unit-video-iframe"
              />
            ) : (
              <video controls width="100%" poster={VIDEO_POSTER_DATA_URL} preload="metadata">
                <source src={videoSrc} type="video/mp4" />
                Sorry, your browser does not support embedded videos.
              </video>
            )}
          </div>
        )}

        <div className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <h2 className="text-3xl font-bold text-center text-blue-600 md:text-4xl" style={{ fontSize: 'min(1.75rem, 5vw)' }}>
              Learn with SpArki
            </h2>
            <ListenButton text="Learn with SpArki" ariaLabel="Listen to heading" size="sm" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <p className="text-center text-lg text-slate-700 md:text-xl" style={{ minHeight: '1.25rem' }}>
              {unit.summary}
            </p>
            <ListenButton text={unit.summary} ariaLabel="Listen to summary" size="sm" />
          </div>

          {(() => {
            const { story, rules } = parseContentBlocks(unit.contentBlocks)
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
                              <ListenButton text={ruleText} ariaLabel={`Listen to rule ${index + 1}`} size="sm" className="flex-shrink-0" />
                            </div>
                          </CardHeader>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {story && (
                  <Card className="border-2 border-pink-200 bg-pink-50/60 shadow-md">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-pink-900 md:text-2xl">Story Time with SpArki</CardTitle>
                        <ListenButton text={`Story Time with SpArki. ${story}`} ariaLabel="Listen to story" size="sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-base leading-relaxed text-slate-800 md:text-lg" style={{ fontSize: 'min(1.25rem, 4vw)' }}>
                        {story}
                      </p>
                      <div className="h-24 rounded-lg border-2 border-dashed border-pink-200 bg-pink-100/50 flex items-center justify-center text-pink-600 text-sm font-medium" aria-hidden>
                        Illustration placeholder
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )
          })()}

          {unit.thinkPrompts && unit.thinkPrompts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 md:text-2xl">Pause & Think</h3>
              <div className="flex flex-wrap gap-3">
                {unit.thinkPrompts.map((prompt, index) => (
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
                <CardTitle className="text-xl text-yellow-900 md:text-2xl">Unit Activity</CardTitle>
                <ListenButton text={`Unit Activity. ${unit.activity.description}`} ariaLabel="Listen to activity" size="sm" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-slate-800 md:text-lg" style={{ fontSize: 'min(1.25rem, 4vw)' }}>
                {unit.activity.description}
              </p>
            </CardContent>
          </Card>

          <div ref={materialEndRef} className="unit-material-end w-full flex flex-col items-center justify-center border-t-2 border-dashed border-slate-200 pt-8">
            <Button
              size="lg"
              className="w-full min-h-[3.5rem] max-w-md text-lg shrink-0"
              onClick={() => setMaterialFinished(true)}
              aria-label="Finished, show quiz"
            >
              Finished, show quiz
            </Button>
          </div>
        </div>
      </div>

      {materialFinished && (
        <div ref={quizSectionRef} className="unit-quiz-section mt-6" style={{ scrollMarginTop: '1.5rem', scrollMarginBottom: '1.5rem' }}>
      {unit.id === 'safety-instagram' && (
        <div className="unit-quiz-section mt-6">
          <InstagramSafetyQuiz
            unit={unit}
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
            unit={unit}
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
            unit={unit}
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
            unit={unit}
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
            unit={unit}
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
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleRedditComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-1-what-is-ai' && (
        <div className="unit-quiz-section mt-6">
          <ExampleCollectorQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI1Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-2-coding-games' && (
        <div className="unit-quiz-section mt-6">
          <BodyCodeChainQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI2Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-3-software-explorers' && (
        <div className="unit-quiz-section mt-6">
          <SoftwareExplorerQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI3Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-4-ai-in-the-world' && (
        <div className="unit-quiz-section mt-6">
          <WorldAIHelperQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI4Complete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'ai-5-ethical-coding' && (
        <div className="unit-quiz-section mt-6">
          <FairCodeAdventureQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleAI5Complete}
          />
        </div>
      )}
      {unit.id !== 'safety-instagram' && unit.id !== 'safety-tiktok' && unit.id !== 'safety-snapchat' && unit.id !== 'safety-roblox' && unit.id !== 'safety-fortnite' && unit.id !== 'safety-reddit' && unit.id !== 'ai-1-what-is-ai' && unit.id !== 'ai-2-coding-games' && unit.id !== 'ai-3-software-explorers' && unit.id !== 'ai-4-ai-in-the-world' && unit.id !== 'ai-5-ethical-coding' && (
        <div className="unit-quiz-section mt-6">
          <GameQuiz
            unit={unit}
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
  )
}

export default UnitPage
