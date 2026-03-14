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
