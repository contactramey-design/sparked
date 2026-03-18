import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import { books } from './books'
import { getSafetyPassCheckoutSessionId } from './progress'
import { useTranslation } from './contexts/LocaleContext'

// Vite bundler-friendly worker wiring.
// See: https://mozilla.github.io/pdf.js/getting_started/
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

type PdfDoc = any

const EbookViewerPage: React.FC = () => {
  const { ebookId } = useParams<{ ebookId: string }>()
  const [searchParams] = useSearchParams()
  const ebookIdFromQuery = searchParams.get('ebookId')
  const { t } = useTranslation()

  const ebook = useMemo(() => {
    const effectiveId = ebookId || ebookIdFromQuery
    if (!effectiveId) return null
    return books.find((b) => b.id === effectiveId) ?? null
  }, [ebookId, ebookIdFromQuery])

  const effectiveEbookId = (ebookId || ebookIdFromQuery || '').toString().trim()

  const checkoutSessionId = getSafetyPassCheckoutSessionId()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const viewportContainerRef = useRef<HTMLDivElement | null>(null)

  const pdfDocRef = useRef<PdfDoc | null>(null)
  const renderTokenRef = useRef(0)

  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [rendering, setRendering] = useState(false)
  const [entitlementErrorKey, setEntitlementErrorKey] = useState<string | null>(null)

  useEffect(() => {
    setPageNumber(1)
    setNumPages(null)
    pdfDocRef.current = null
    setEntitlementErrorKey(null)

    if (!effectiveEbookId) {
      setEntitlementErrorKey('ebookViewer.errors.missingEbookId')
      return
    }

    const isFreeTestEbook = effectiveEbookId === 'ebook-1'

    if (!checkoutSessionId && !isFreeTestEbook) {
      setEntitlementErrorKey('ebookViewer.errors.startTrial')
      return
    }

    const safeEbookId: string = effectiveEbookId
    const safeCheckoutSessionId: string | null = checkoutSessionId

    let cancelled = false

    async function load() {
      setLoadingPdf(true)
      try {
        const res = await fetch(
          isFreeTestEbook
            ? `/api/download-ebook?ebookId=${encodeURIComponent(safeEbookId)}`
            : `/api/download-ebook?ebookId=${encodeURIComponent(safeEbookId)}&checkout_session_id=${encodeURIComponent(
                safeCheckoutSessionId as string,
              )}`,
        )

        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('FORBIDDEN_DOWNLOAD')
          }
          throw new Error('DOWNLOAD_FAILED')
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
        if (e instanceof Error) {
          if (e.message === 'FORBIDDEN_DOWNLOAD') {
            setEntitlementErrorKey('ebookViewer.errors.unlockRequired')
          } else {
            setEntitlementErrorKey('ebookViewer.errors.couldNotLoad')
          }
        } else {
          setEntitlementErrorKey('ebookViewer.errors.couldNotLoad')
        }
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
    // Page-turn-ish animation whenever we render a new page.
    // (We only use CSS animation; PDF.js still renders to the same canvas.)
    canvas.classList.remove('ebook-canvas-flip')
    setRendering(true)
    // Force reflow so the animation restarts reliably.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    canvas.offsetHeight
    canvas.classList.add('ebook-canvas-flip')

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
      setEntitlementErrorKey('ebookViewer.errors.couldNotRender')
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

  const bundle = books.find((b) => b.id === 'bundle') ?? null
  const bundlePrice = bundle?.price ?? '$9.99/mo'
  const ebookTitle = ebook ? t(ebook.titleKey) : t('ebookViewer.readerTitle')

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
    if (!effectiveEbookId) return

    setEntitlementErrorKey(null)
    setLoadingPdf(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnTo: `/ebook?ebookId=${effectiveEbookId}` }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || typeof data?.url !== 'string') {
        throw new Error('CHECKOUT_FAILED')
      }

      window.location.assign(data.url)
    } catch (e) {
      setEntitlementErrorKey('ebookViewer.errors.checkoutFailed')
      setLoadingPdf(false)
    }
  }

  if (entitlementErrorKey) {
    return (
      <section className="lesson-page">
        <header className="lesson-header">
          <h2>{ebookTitle}</h2>
          <Link to="/shop" className="link-back">
            {t('ebookViewer.backToShop')}
          </Link>
        </header>

        <div className="lesson-media card" role="alert" aria-live="polite">
          <h3 style={{ marginTop: 0 }}>{t('ebookViewer.unlockToReadTitle')}</h3>
          <p>{t(entitlementErrorKey)}</p>
          {ebook && ebook.id !== 'bundle' ? (
            <button
              type="button"
              className="primary-button"
              onClick={async () => {
                setEntitlementErrorKey(null)
                setLoadingPdf(true)
                try {
                  const res = await fetch('/api/create-ebook-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ebookId: ebook.id,
                      returnTo: `/ebook?ebookId=${encodeURIComponent(ebook.id)}`,
                    }),
                  })
                  const data = await res.json().catch(() => ({}))
                  if (!res.ok || typeof data?.url !== 'string') {
                    throw new Error('CHECKOUT_FAILED')
                  }
                  window.location.assign(data.url)
                } catch (e) {
                  setEntitlementErrorKey('ebookViewer.errors.checkoutFailed')
                  setLoadingPdf(false)
                }
              }}
            >
              {t('ebookViewer.buyForButton', { price: ebook.price })}
            </button>
          ) : (
            <button type="button" className="primary-button" onClick={() => void startTrial()}>
              {t('ebookViewer.startTrialButton')}
            </button>
          )}

          <button type="button" className="secondary-button mt-3" onClick={() => void startTrial()}>
            {t('ebookViewer.bundleUnlockButton', { price: bundlePrice })}
          </button>
          <p className="login-coppa-note" style={{ marginTop: '0.75rem' }}>
            {t('ebookViewer.afterUnlockNote')}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <h2>{ebookTitle}</h2>
        <Link to="/shop" className="link-back">
          {t('ebookViewer.backToShop')}
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
        <span className="ebook-page-label">
          {numPages
            ? t('ebookViewer.toolbar.pageOf', { page: pageNumber, numPages })
            : t('ebookViewer.toolbar.pageSolo', { page: pageNumber })}
        </span>
        <button type="button" className="secondary-button" onClick={handleNext} disabled={!canNext}>
          {t('ebookViewer.toolbar.next')}
        </button>
      </div>

      {loadingPdf || rendering ? (
        <p className="login-coppa-note" aria-live="polite">
          {loadingPdf ? t('ebookViewer.loading.loadingEbook') : t('ebookViewer.loading.renderingPage')}
        </p>
      ) : null}
    </section>
  )
}

export default EbookViewerPage

