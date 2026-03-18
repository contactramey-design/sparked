import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import { books } from './books'
import { getSafetyPassCheckoutSessionId } from './progress'

// Vite bundler-friendly worker wiring.
// See: https://mozilla.github.io/pdf.js/getting_started/
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

type PdfDoc = any

const EbookViewerPage: React.FC = () => {
  const { ebookId } = useParams<{ ebookId: string }>()

  const ebook = useMemo(() => {
    if (!ebookId) return null
    return books.find((b) => b.id === ebookId) ?? null
  }, [ebookId])

  const checkoutSessionId = getSafetyPassCheckoutSessionId()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const viewportContainerRef = useRef<HTMLDivElement | null>(null)

  const pdfDocRef = useRef<PdfDoc | null>(null)
  const renderTokenRef = useRef(0)

  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [rendering, setRendering] = useState(false)
  const [entitlementError, setEntitlementError] = useState<string | null>(null)

  useEffect(() => {
    setPageNumber(1)
    setNumPages(null)
    pdfDocRef.current = null
    setEntitlementError(null)

    if (!ebookId) {
      setEntitlementError('Missing ebook id.')
      return
    }

    if (!checkoutSessionId) {
      setEntitlementError('Start the trial to access ebooks.')
      return
    }

    const safeEbookId: string = ebookId
    const safeCheckoutSessionId: string = checkoutSessionId

    let cancelled = false

    async function load() {
      setLoadingPdf(true)
      try {
        const res = await fetch(
          `/api/download-ebook?ebookId=${encodeURIComponent(
            safeEbookId,
          )}&checkout_session_id=${encodeURIComponent(safeCheckoutSessionId)}`,
        )

        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('You need to unlock ebooks to read this PDF.')
          }
          throw new Error('Could not load the ebook. Please try again.')
        }

        const arrayBuffer = await res.arrayBuffer()
        if (cancelled) return

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const doc = await loadingTask.promise
        if (cancelled) return

        pdfDocRef.current = doc
        setNumPages(doc.numPages || null)
        setPageNumber(1)
      } catch (e) {
        if (cancelled) return
        setEntitlementError(e instanceof Error ? e.message : 'Could not load the ebook.')
      } finally {
        if (!cancelled) setLoadingPdf(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [ebookId, checkoutSessionId])

  const renderPage = async (n: number) => {
    const doc = pdfDocRef.current
    const canvas = canvasRef.current
    const container = viewportContainerRef.current
    if (!doc || !canvas || !container) return

    const token = ++renderTokenRef.current
    setRendering(true)

    try {
      const page = await doc.getPage(n)

      const dpr = window.devicePixelRatio || 1
      const containerWidth = Math.max(320, container.clientWidth)
      const unscaled = page.getViewport({ scale: 1 })
      const scale = containerWidth / unscaled.width
      const viewport = page.getViewport({ scale: scale * dpr })

      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No canvas context')

      // Render the page into the canvas.
      await page.render({ canvasContext: ctx, viewport }).promise

      if (token !== renderTokenRef.current) return
    } catch (e) {
      // If rendering fails, show the entitlement error only if we didn't have a doc.
      // Otherwise, keep UI usable.
      setEntitlementError(e instanceof Error ? e.message : 'Could not render this page.')
    } finally {
      if (token === renderTokenRef.current) setRendering(false)
    }
  }

  useEffect(() => {
    if (!pdfDocRef.current) return
    if (pageNumber < 1) return
    if (numPages && pageNumber > numPages) return
    void renderPage(pageNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, numPages])

  const canPrev = pageNumber > 1 && !loadingPdf
  const canNext = numPages ? pageNumber < numPages : false

  const handlePrev = () => {
    if (!canPrev) return
    setPageNumber((p) => Math.max(1, p - 1))
  }

  const handleNext = () => {
    if (!canNext) return
    setPageNumber((p) => Math.min(numPages ?? p, p + 1))
  }

  const touchStartX = useRef<number | null>(null)
  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }
  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const startX = touchStartX.current
    touchStartX.current = null
    if (startX == null) return
    const endX = e.changedTouches[0]?.clientX ?? startX
    const dx = endX - startX
    if (dx <= -60) handleNext()
    if (dx >= 60) handlePrev()
  }

  async function startTrial() {
    if (!ebookId) return

    setEntitlementError(null)
    setLoadingPdf(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnTo: `/ebook/${ebookId}` }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || typeof data?.url !== 'string') {
        throw new Error(typeof data?.error === 'string' ? data.error : 'Checkout failed.')
      }

      window.location.assign(data.url)
    } catch (e) {
      setEntitlementError(e instanceof Error ? e.message : 'Checkout failed.')
      setLoadingPdf(false)
    }
  }

  if (entitlementError) {
    return (
      <section className="lesson-page">
        <header className="lesson-header">
          <h2>{ebook?.title ?? 'Ebook'}</h2>
          <Link to="/shop" className="link-back">
            Back to shop
          </Link>
        </header>

        <div className="lesson-media card" role="alert" aria-live="polite">
          <h3 style={{ marginTop: 0 }}>Unlock to read</h3>
          <p>{entitlementError}</p>
          {ebook && ebook.id !== 'bundle' ? (
            <button
              type="button"
              className="primary-button"
              onClick={async () => {
                setEntitlementError(null)
                setLoadingPdf(true)
                try {
                  const res = await fetch('/api/create-ebook-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ebookId: ebook.id, returnTo: `/ebook/${ebook.id}` }),
                  })
                  const data = await res.json().catch(() => ({}))
                  if (!res.ok || typeof data?.url !== 'string') {
                    throw new Error(typeof data?.error === 'string' ? data.error : 'Checkout failed.')
                  }
                  window.location.assign(data.url)
                } catch (e) {
                  setEntitlementError(e instanceof Error ? e.message : 'Checkout failed.')
                  setLoadingPdf(false)
                }
              }}
            >
              Buy for {ebook.price}
            </button>
          ) : (
            <button type="button" className="primary-button" onClick={() => void startTrial()}>
              Start 30-day free trial
            </button>
          )}

          <button type="button" className="secondary-button mt-3" onClick={() => void startTrial()}>
            Or unlock the bundle for $9.99/mo (trial)
          </button>
          <p className="login-coppa-note" style={{ marginTop: '0.75rem' }}>
            After you unlock, the ebook will open on page 1 automatically.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <h2>{ebook?.title ?? 'Ebook reader'}</h2>
        <Link to="/shop" className="link-back">
          Back to shop
        </Link>
      </header>

      <div
        className="ebook-viewer-wrap"
        ref={viewportContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="ebook-canvas" />
      </div>

      <div className="ebook-toolbar">
        <button type="button" className="secondary-button" onClick={handlePrev} disabled={!canPrev}>
          Prev
        </button>
        <span className="ebook-page-label">
          Page {pageNumber}
          {numPages ? ` of ${numPages}` : ''}
        </span>
        <button type="button" className="secondary-button" onClick={handleNext} disabled={!canNext}>
          Next
        </button>
      </div>

      {loadingPdf || rendering ? (
        <p className="login-coppa-note" aria-live="polite">
          {loadingPdf ? 'Loading ebook…' : 'Rendering page…'}
        </p>
      ) : null}
    </section>
  )
}

export default EbookViewerPage

