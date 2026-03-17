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
    title: 'SpArki Safety Ebook #1',
    blurb: 'A gentle, kid-friendly safety story for families.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-1',
    coverSrc: '/bookcase/ebook-1.png',
  },
  {
    id: 'ebook-2',
    title: 'SpArki Safety Ebook #2',
    blurb: 'Practice safe sharing, kind choices, and asking a grown-up first.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-2',
    coverSrc: '/bookcase/ebook-2.png',
  },
  {
    id: 'ebook-3',
    title: 'SpArki Safety Ebook #3',
    blurb: 'A warm story that teaches privacy and healthy boundaries online.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-3',
    coverSrc: '/bookcase/ebook-3.png',
  },
  {
    id: 'ebook-4',
    title: 'SpArki Safety Ebook #4',
    blurb: 'Kids learn “pause & think” skills in a fun adventure.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-4',
    coverSrc: '/bookcase/ebook-4.png',
  },
  {
    id: 'ebook-5',
    title: 'SpArki Safety Ebook #5',
    blurb: 'A cozy story that models kind comments and safe app use.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-5',
    coverSrc: '/bookcase/ebook-5.png',
  },
  {
    id: 'ebook-6',
    title: 'SpArki Safety Ebook #6',
    blurb: 'A playful lesson about trust, consent, and telling a grown-up.',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-6',
    coverSrc: '/bookcase/ebook-6.png',
  },
  {
    id: 'bundle',
    title: '6‑Ebook Safety Bundle + 1 Month Free Academy',
    blurb: 'All 6 ebooks plus a free month of Sparki Academy adventures.',
    price: '$24.99',
    storeLabel: 'TikTok Shop / Amazon Bundle',
    url: 'https://example.com/bundle',
    coverSrc: '/bookcase/bundle.png',
  },
]

