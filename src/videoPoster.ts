/**
 * Default poster shown before video plays. Inline SVG data URL so it loads
 * immediately with no extra request—video area is never blank.
 */
const POSTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#dbeafe"/>
      <stop offset="100%" style="stop-color:#fce7f3"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <circle cx="320" cy="180" r="70" fill="white" opacity="0.95"/>
  <path d="M290 150 L290 210 L350 180 Z" fill="#2563eb"/>
</svg>`

export const VIDEO_POSTER_DATA_URL =
  `data:image/svg+xml,${encodeURIComponent(POSTER_SVG)}`
