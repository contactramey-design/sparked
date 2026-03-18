export interface BookConfig {
  id: string
  titleKey: string
  blurbKey: string
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
    titleKey: 'books.ebook-1.title',
    blurbKey: 'books.ebook-1.blurb',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-1',
    coverSrc: '/bookcase/ebook-1.png',
  },
  {
    id: 'ebook-2',
    titleKey: 'books.ebook-2.title',
    blurbKey: 'books.ebook-2.blurb',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-2',
    coverSrc: '/bookcase/ebook-2.png',
  },
  {
    id: 'ebook-3',
    titleKey: 'books.ebook-3.title',
    blurbKey: 'books.ebook-3.blurb',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-3',
    coverSrc: '/bookcase/ebook-3.png',
  },
  {
    id: 'ebook-4',
    titleKey: 'books.ebook-4.title',
    blurbKey: 'books.ebook-4.blurb',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-4',
    coverSrc: '/bookcase/ebook-4.png',
  },
  {
    id: 'ebook-5',
    titleKey: 'books.ebook-5.title',
    blurbKey: 'books.ebook-5.blurb',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-5',
    coverSrc: '/bookcase/ebook-5.png',
  },
  {
    id: 'ebook-6',
    titleKey: 'books.ebook-6.title',
    blurbKey: 'books.ebook-6.blurb',
    price: '$4.99',
    storeLabel: 'Amazon KDP',
    url: 'https://example.com/ebook-6',
    coverSrc: '/bookcase/ebook-6.png',
  },
  {
    id: 'bundle',
    titleKey: 'books.bundle.title',
    blurbKey: 'books.bundle.blurb',
    price: '$9.99/mo',
    storeLabel: 'TikTok Shop / Amazon Bundle',
    url: 'https://example.com/bundle',
    coverSrc: '/bookcase/bundle.png',
  },
]

