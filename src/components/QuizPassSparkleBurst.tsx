import React, { useEffect } from 'react'

/** Full-screen sparkle burst when a quiz attempt scores ≥ passing threshold (non-blocking). */
const QuizPassSparkleBurst: React.FC<{ active: boolean; onDone: () => void }> = ({ active, onDone }) => {
  useEffect(() => {
    if (!active) return
    const id = window.setTimeout(onDone, 2400)
    return () => window.clearTimeout(id)
  }, [active, onDone])

  if (!active) return null

  return (
    <div className="quiz-sparkle-burst-root" aria-hidden="true">
      <div className="quiz-sparkle-burst-glow" />
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="quiz-sparkle-burst-particle"
          style={{
            ['--d' as string]: `${0.8 + Math.random() * 1.4}s`,
            ['--x' as string]: `${(Math.random() - 0.5) * 200}px`,
            ['--y' as string]: `${-80 - Math.random() * 220}px`,
            ['--rot' as string]: `${Math.random() * 360}deg`,
            left: `${8 + Math.random() * 84}%`,
            bottom: '18%',
          }}
        >
          {i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}
        </span>
      ))}
    </div>
  )
}

export default QuizPassSparkleBurst
