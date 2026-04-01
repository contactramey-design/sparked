/**
 * Image generation for homework adventure visuals.
 *
 * Phase 3 strategy (animation): Prefer Lottie or lightweight 2.5D (Spline) loops
 * over generated video for unit economics and COPPA-friendly delivery. Defer
 * Kling / Runway image-to-video until Phase 1 still-image costs and quality
 * are validated with real traffic.
 */

const FLUX_MODEL = 'fal-ai/flux-pro/v1.1'

/**
 * @param {unknown} data fal result.data
 * @returns {string|null}
 */
export function extractFirstImageUrl(data) {
  if (!data || typeof data !== 'object') return null
  const raw = data.images
  if (!Array.isArray(raw) || raw.length === 0) return null
  const first = raw[0]
  if (typeof first === 'string') return first
  if (first && typeof first === 'object') {
    if (typeof first.url === 'string') return first.url
    if (typeof first.file_url === 'string') return first.file_url
  }
  return null
}

/**
 * @param {string} prompt
 * @returns {Promise<string>} HTTPS URL of generated image
 */
export async function generateFluxSceneImage(prompt) {
  const key = process.env.FAL_KEY?.trim()
  if (!key) {
    throw new Error('FAL_KEY is not set')
  }
  const { fal } = await import('@fal-ai/client')
  fal.config({ credentials: key })

  const result = await fal.subscribe(FLUX_MODEL, {
    input: {
      prompt,
      image_size: 'landscape_16_9',
      num_images: 1,
      output_format: 'jpeg',
      safety_tolerance: 2,
      enhance_prompt: false,
    },
  })

  const url = extractFirstImageUrl(result?.data)
  if (!url) {
    throw new Error('Image provider returned no URL')
  }
  return url
}
