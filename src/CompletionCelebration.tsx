import React, { useEffect, useRef } from 'react'
import './CompletionCelebration.css'

interface CompletionCelebrationProps {
  explorerName: string
  unitTitle: string
  onClose: () => void
}

const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  explorerName,
  unitTitle,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = (canvas.width = 280)
    const height = (canvas.height = 280)

    ctx.clearRect(0, 0, width, height)

    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      140,
    )
    gradient.addColorStop(0, '#f97316')
    gradient.addColorStop(1, '#facc15')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, 130, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#fef3c7'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, 118, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#0f172a'
    ctx.textAlign = 'center'
    ctx.font = 'bold 24px system-ui'
    ctx.fillText('SpArki Badge', width / 2, height / 2 - 20)

    ctx.font = 'bold 18px system-ui'
    const name = explorerName || 'Explorer'
    ctx.fillText(name, width / 2, height / 2 + 10)

    ctx.font = '14px system-ui'
    ctx.fillText('Unit Star', width / 2, height / 2 + 34)
  }, [explorerName])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    const safeName = explorerName || 'explorer'
    link.download = `${safeName}-sparki-badge.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="completion-celebration-overlay">
      <div className="completion-celebration-confetti" aria-hidden="true" />
      <div className="completion-celebration-modal card">
        <button
          type="button"
          className="completion-close-button"
          onClick={onClose}
          aria-label="Close celebration"
        >
          ×
        </button>
        <div className="completion-certificate">
          <h2>Certificate of Awesomeness</h2>
          <p className="certificate-subtitle">presented to</p>
          <p className="certificate-name">{explorerName || 'Explorer'}</p>
          <p className="certificate-body">
            for bravely completing the SpArki unit
          </p>
          <p className="certificate-unit">“{unitTitle}”</p>
          <p className="certificate-footer">
            Keep shining bright and learning with SpArki!
          </p>
        </div>

        <div className="completion-badge-section">
          <h3>Your SpArki Badge</h3>
          <canvas
            ref={canvasRef}
            className="completion-badge-canvas"
            aria-label="SpArki completion badge"
          />
          <button
            type="button"
            className="secondary-button"
            onClick={handleDownload}
          >
            Download badge
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompletionCelebration

import React, { useRef, useEffect } from 'react'
import { appConfig } from './config'
import './CompletionCelebration.css'

export interface CompletionCelebrationProps {
  unitTitle: string
  trackTitle?: string
  explorerName?: string
  onClose: () => void
}

const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  unitTitle,
  trackTitle,
  explorerName,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 200
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#fefce8'
    ctx.strokeStyle = '#0ea5e9'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(100, 100, 90, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 18px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(unitTitle, 100, 95)
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillText('Mastered!', 100, 118)
  }, [unitTitle])

  return (
    <div className="completion-celebration-overlay" role="dialog" aria-label="Unit completed">
      <div className="completion-celebration-confetti" aria-hidden />
      <div className="completion-celebration-modal card">
        <h2 className="completion-celebration-title">You did it!</h2>
        <p className="completion-celebration-subtitle">
          {explorerName || 'Explorer'} mastered <strong>{unitTitle}</strong>
          {trackTitle ? ` in ${trackTitle}` : ''}.
        </p>

        <div className="completion-celebration-certificate">
          <h3>{appConfig.appName}</h3>
          <p className="certificate-label">Certificate of Completion</p>
          <p>This certifies that <strong>{explorerName || 'Explorer'}</strong> has completed the unit</p>
          <p><strong>{unitTitle}</strong></p>
          {trackTitle && <p>{trackTitle}</p>}
        </div>

        <div className="completion-celebration-badge-wrap">
          <canvas ref={canvasRef} className="completion-celebration-badge" aria-label="Completion badge" />
          <a
            href="#"
            className="secondary-button"
            onClick={(e) => {
              e.preventDefault()
              const canvas = canvasRef.current
              if (canvas) {
                const link = document.createElement('a')
                link.download = `sparki-badge-${unitTitle.replace(/\s+/g, '-').toLowerCase()}.png`
                link.href = canvas.toDataURL('image/png')
                link.click()
              }
            }}
          >
            Save badge
          </a>
        </div>

        <button type="button" className="primary-button" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default CompletionCelebration
