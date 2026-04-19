import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { books } from './books'
import { getAcademyCheckoutSessionId, getEbookCheckoutSessionId } from './progress'
import { useTranslation } from './contexts/LocaleContext'
import { useSchoolShopHidden } from './hooks/useSchoolMode'
import { Button } from '@/components/ui/button'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

// Vite bundler-friendly worker wiring.
// See: https://mozilla.github.io/pdf.js/getting_started/
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const EBOOK_CACHE_NAME = 'sparki-ebook-cache-v1'
function offlineEbookPath(ebookId: string) {
  return `/offline-ebooks/${encodeURIComponent(ebookId)}.pdf`
}

const EbookViewerPage: React.FC = () => {
  const { ebookId } = useParams<{ ebookId: string }>()
  const [searchParams] = useSearchParams()
  const ebookIdFromQuery = searchParams.get('ebookId')
  const { t } = useTranslation()
  const schoolShopHidden = useSchoolShopHidden()

  const ebook = useMemo(() => {
    const effectiveId = ebookId || ebookIdFromQuery
    if (!effectiveId) return null
    return books.find((b) => b.id === effectiveId) ?? null
  }, [ebookId, ebookIdFromQuery])

  const effectiveEbookId = (ebookId || ebookIdFromQuery || '').toString().trim()

  const checkoutSessionId = useMemo(() => {
    if (!effectiveEbookId) return null
    return getEbookCheckoutSessionId(effectiveEbookId) || getAcademyCheckoutSessionId()
  }, [effectiveEbookId])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const viewportContainerRef = useRef<HTMLDivElement | null>(null)

  const pdfDocRef = useRef<PDFDocumentProxy | null>(null)
  const renderTokenRef = useRef(0)

  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [rendering, setRendering] = useState(false)
  const [entitlementErrorKey, setEntitlementErrorKey] = useState<string | null>(null)
  const [offlineSaved, setOfflineSaved] = useState(false)
  const [offlineSaveError, setOfflineSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (schoolShopHidden) return

    setPageNumber(1)
    setNumPages(null)
    pdfDocRef.current = null
    setEntitlementErrorKey(null)
    setOfflineSaved(false)
    setOfflineSaveError(null)

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
      canvasRef.current?.classList.remove('ebook-canvas-flip')
      try {
        const url = isFreeTestEbook
          ? `/api/download-ebook?ebookId=${encodeURIComponent(safeEbookId)}`
          : `/api/download-ebook?ebookId=${encodeURIComponent(safeEbookId)}&checkout_session_id=${encodeURIComponent(
              safeCheckoutSessionId as string,
            )}`

        // Offline-first: if offline, try cache.
        if (typeof window !== 'undefined' && window.navigator && !window.navigator.onLine) {
          const cache = await caches.open(EBOOK_CACHE_NAME)
          const cached = await cache.match(offlineEbookPath(safeEbookId))
          if (!cached) throw new Error('OFFLINE_NOT_CACHED')
          setOfflineSaved(true)
          const arrayBuffer = await cached.arrayBuffer()
          if (cancelled) return
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
          const doc = await loadingTask.promise
          if (cancelled) return
          pdfDocRef.current = doc
          setNumPages(doc.numPages || null)
          setPageNumber(1)
          return
        }

        const res = await fetch(url)

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
          } else if (e.message === 'OFFLINE_NOT_CACHED') {
            setEntitlementErrorKey('ebookViewer.errors.offlineNotSaved')
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
  }, [ebookId, ebookIdFromQuery, effectiveEbookId, checkoutSessionId])

  const canSaveOffline = typeof window !== 'undefined' && !!effectiveEbookId && window.navigator?.onLine

  const saveForOffline = async () => {
    if (!effectiveEbookId) return
    setOfflineSaveError(null)
    try {
      const isFreeTestEbook = effectiveEbookId === 'ebook-1'
      const url = isFreeTestEbook
        ? `/api/download-ebook?ebookId=${encodeURIComponent(effectiveEbookId)}`
        : `/api/download-ebook?ebookId=${encodeURIComponent(effectiveEbookId)}&checkout_session_id=${encodeURIComponent(
            checkoutSessionId as string,
          )}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('DOWNLOAD_FAILED')
      const blob = await res.blob()
      const cache = await caches.open(EBOOK_CACHE_NAME)
      await cache.put(offlineEbookPath(effectiveEbookId), new Response(blob, { headers: { 'Content-Type': 'application/pdf' } }))
      setOfflineSaved(true)
    } catch {
      setOfflineSaveError('ebookViewer.errors.offlineSaveFailed')
    }
  }

  const renderPage = useCallback(async (n: number) => {
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
      await page.render({ canvasContext: ctx, viewport, canvas }).promise

      if (token !== renderTokenRef.current) return
    } catch {
      // If rendering fails, show the entitlement error only if we didn't have a doc.
      // Otherwise, keep UI usable.
      setEntitlementErrorKey('ebookViewer.errors.couldNotRender')
    } finally {
      if (token === renderTokenRef.current) setRendering(false)
    }
  }, [])

  useEffect(() => {
    if (schoolShopHidden) return
    if (!pdfDocRef.current) return
    if (pageNumber < 1) return
    if (numPages && pageNumber > numPages) return
    void renderPage(pageNumber)
  }, [pageNumber, numPages, renderPage, schoolShopHidden])

  if (schoolShopHidden) {
    return <Navigate to="/tracks" replace />
  }

  const isFreeTestEbook = effectiveEbookId === 'ebook-1'
  const canPrev = pageNumber > 1 && !loadingPdf
  const canNext = numPages ? pageNumber < numPages : false
  const canDownloadPdf = isFreeTestEbook || !!checkoutSessionId

  const handleDownloadPdf = () => {
    if (!effectiveEbookId) return
    const downloadUrl = isFreeTestEbook
      ? `/api/download-ebook?ebookId=${encodeURIComponent(effectiveEbookId)}`
      : `/api/download-ebook?ebookId=${encodeURIComponent(effectiveEbookId)}&checkout_session_id=${encodeURIComponent(
          checkoutSessionId as string,
        )}`

    window.location.assign(downloadUrl)
  }

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

  async function startAcademyCheckout() {
    if (!effectiveEbookId) return

    setEntitlementErrorKey(null)
    setLoadingPdf(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnTo: `/ebook?ebookId=${encodeURIComponent(effectiveEbookId)}` }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || typeof data?.url !== 'string') {
        throw new Error('CHECKOUT_FAILED')
      }

      window.location.assign(data.url)
    } catch {
      setEntitlementErrorKey('ebookViewer.errors.checkoutFailed')
      setLoadingPdf(false)
    }
  }

  if (entitlementErrorKey) {
    return (
      <AscentPageChrome
        title={ebookTitle}
        breadcrumb={[
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: t('footer.shop'), to: '/shop' },
          { label: ebookTitle },
        ]}
        contentMaxWidthClassName="max-w-2xl"
      >
        <div className="card rounded-2xl border border-teal-100/80 p-6" role="alert" aria-live="polite">
          <h3 className="m-0 font-heading text-lg text-teal-950">{t('ebookViewer.unlockToReadTitle')}</h3>
          <p>{t(entitlementErrorKey)}</p>
          <>
            {ebook ? (
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
                  } catch {
                    setEntitlementErrorKey('ebookViewer.errors.checkoutFailed')
                    setLoadingPdf(false)
                  }
                }}
              >
                {t('ebookViewer.buyForButton', { price: ebook.price })}
              </button>
            ) : null}

            <button
              type="button"
              className="secondary-button mt-3"
              onClick={() => void startAcademyCheckout()}
            >
              {t('ebookViewer.subscribeAcademyButton')}
            </button>
            <p className="login-coppa-note" style={{ marginTop: '0.75rem' }}>
              {t('ebookViewer.afterUnlockNote')}
            </p>
          </>
        </div>
      </AscentPageChrome>
    )
  }

  return (
    <AscentPageChrome
      title={ebookTitle}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('footer.shop'), to: '/shop' },
        { label: ebookTitle },
      ]}
      contentMaxWidthClassName="max-w-4xl"
    >
      <section className="lesson-page">
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
          {t('ebookViewer.toolbar.prev')}
        </button>
        <span className="ebook-page-label">
          {numPages
            ? t('ebookViewer.toolbar.pageOf', { page: pageNumber, numPages })
            : t('ebookViewer.toolbar.pageSolo', { page: pageNumber })}
        </span>
        <button
          type="button"
          className="secondary-button"
          onClick={() => handleDownloadPdf()}
          disabled={!canDownloadPdf}
        >
          {t('ebookViewer.toolbar.downloadPdf')}
        </button>
        <button type="button" className="secondary-button" onClick={handleNext} disabled={!canNext}>
          {t('ebookViewer.toolbar.next')}
        </button>
      </div>

      <div className="ebook-offline-row">
        <Button
          type="button"
          variant="secondary"
          disabled={!canSaveOffline}
          onClick={() => void saveForOffline()}
        >
          {offlineSaved ? t('ebookViewer.offline.savedButton') : t('ebookViewer.offline.saveButton')}
        </Button>
        {!canSaveOffline && (
          <span className="muted" style={{ fontSize: 12 }}>
            {t('ebookViewer.offline.saveHint')}
          </span>
        )}
      </div>
      {offlineSaveError ? (
        <p className="muted" role="status" aria-live="polite">
          {t(offlineSaveError)}
        </p>
      ) : null}

      {loadingPdf || rendering ? (
        <p className="login-coppa-note" aria-live="polite">
          {loadingPdf ? t('ebookViewer.loading.loadingEbook') : t('ebookViewer.loading.renderingPage')}
        </p>
      ) : null}
    </section>
    </AscentPageChrome>
  )
}

export default EbookViewerPage

