export interface BookConfig {
  id: string
  titleKey: string
  blurbKey: string
  price: string
  storeLabelKey: string
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
    storeLabelKey: 'books.ebook-1.storeLabel',
    url: 'https://example.com/ebook-1',
    coverSrc: '/Sparkis ebook cover instagram.png',
  },
  {
    id: 'ebook-2',
    titleKey: 'books.ebook-2.title',
    blurbKey: 'books.ebook-2.blurb',
    price: '$4.99',
    storeLabelKey: 'books.ebook-2.storeLabel',
    url: 'https://example.com/ebook-2',
    coverSrc: '/tiktokcover.png',
  },
  {
    id: 'ebook-3',
    titleKey: 'books.ebook-3.title',
    blurbKey: 'books.ebook-3.blurb',
    price: '$4.99',
    storeLabelKey: 'books.ebook-3.storeLabel',
    url: 'https://example.com/ebook-3',
    coverSrc: '/snapchatsafetycoverebook.png',
  },
  {
    id: 'ebook-4',
    titleKey: 'books.ebook-4.title',
    blurbKey: 'books.ebook-4.blurb',
    price: '$4.99',
    storeLabelKey: 'books.ebook-4.storeLabel',
    url: 'https://example.com/ebook-4',
    coverSrc: '/roblox ebook cover.png',
  },
  {
    id: 'ebook-5',
    titleKey: 'books.ebook-5.title',
    blurbKey: 'books.ebook-5.blurb',
    price: '$4.99',
    storeLabelKey: 'books.ebook-5.storeLabel',
    url: 'https://example.com/ebook-5',
    coverSrc: '/fortnitenewcover.png',
  },
  {
    id: 'ebook-6',
    titleKey: 'books.ebook-6.title',
    blurbKey: 'books.ebook-6.blurb',
    price: '$4.99',
    storeLabelKey: 'books.ebook-6.storeLabel',
    url: 'https://example.com/ebook-6',
    coverSrc: '/reddit ebook cover.png',
  },
  {
    id: 'bundle',
    titleKey: 'books.bundle.title',
    blurbKey: 'books.bundle.blurb',
    price: '$9.99/mo',
    storeLabelKey: 'books.bundle.storeLabel',
    url: 'https://example.com/bundle',
    coverSrc: '/bundlecover.webp',
  },
]

