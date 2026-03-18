export interface BookConfig {
  id: string
  title: string
  blurb: string
  price: string
  storeLabel: string
  url: string
  coverSrc: string
}

/**
 * Digital bookcase inventory.
 *
 * Replace `url` and `coverSrc` with your real product links + cover images.
 * Cover images should live in `public/` so they can be referenced by absolute paths.
 */
export const books: BookConfig[] = [
  {
    id: 'ebook-1',
    title: 'Staying Safe on Instagram',
    blurb: 'Learn how to keep profiles private, ask a grown-up before posting, and stay kind online.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-1',
    coverSrc: '/bookcase/ebook-1.png',
  },
  {
    id: 'ebook-2',
    title: 'Kind & Safe TikTok',
    blurb: 'Practice video privacy, blocking strangers, and handling mean comments with kindness.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-2',
    coverSrc: '/bookcase/ebook-2.png',
  },
  {
    id: 'ebook-3',
    title: 'Snaps, Streaks & Safety',
    blurb: 'Learn how snaps can be saved, why feelings come first, and what to do if something feels off.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-3',
    coverSrc: '/bookcase/ebook-3.png',
  },
  {
    id: 'ebook-4',
    title: 'Safe Play on Roblox',
    blurb: 'Explore game chat boundaries, block strangers, and learn safe rules for playing with friends.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-4',
    coverSrc: '/bookcase/ebook-4.png',
  },
  {
    id: 'ebook-5',
    title: 'Fortnite & Voice Chat Boundaries',
    blurb: 'Practice muting, leaving, and setting kind safety rules for voice chat conversations.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-5',
    coverSrc: '/bookcase/ebook-5.png',
  },
  {
    id: 'ebook-6',
    title: 'Reading Safely on Reddit & Forums',
    blurb: 'Learn how not everything online is true, how to use safe spaces, and when to ask a grown-up.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-6',
    coverSrc: '/bookcase/ebook-6.png',
  },
  {
    id: 'bundle',
    title: 'All 6 Safety Ebooks + Homework Adventure Trial',
    blurb: 'Unlock the full ebook set and start a 30-day trial that brings Homework Adventure to life.',
    price: '$24.99',
    storeLabel: 'TikTok Shop / Amazon Bundle',
    url: 'https://example.com/bundle',
    coverSrc: '/bookcase/bundle.png',
  },
]

