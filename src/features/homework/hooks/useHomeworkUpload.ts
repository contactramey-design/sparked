import { useCallback, useState } from 'react'

export function useHomeworkUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
  }, [])

  const onFileChange = useCallback((chosen: File | null, tInvalid?: string) => {
    setError(null)
    if (!chosen) {
      setFile(null)
      setPreviewUrl(null)
      return
    }
    if (!chosen.type.startsWith('image/')) {
      setError(tInvalid ?? 'Please choose an image file.')
      setFile(null)
      setPreviewUrl(null)
      return
    }
    setFile(chosen)
    const url = URL.createObjectURL(chosen)
    setPreviewUrl(url)
  }, [])

  return { file, previewUrl, error, setError, onFileChange, reset, setFile }
}
