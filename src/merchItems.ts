/**
 * Merch catalog config (shop shows a single “coming soon” block; kept for future use).
 * Images live in `public/`; paths may include spaces (encode when used in `src`).
 */
export interface MerchItemConfig {
  id: string
  imageSrc: string
  titleKey: string
  blurbKey: string
}

export const merchItems: MerchItemConfig[] = [
  {
    id: 'sensory-book',
    imageSrc: '/Sparki sensory Book.png',
    titleKey: 'merch.items.sensory-book.title',
    blurbKey: 'merch.items.sensory-book.blurb',
  },
  {
    id: 'sensory-building-block',
    imageSrc: '/Sparki Sensory building Block.png',
    titleKey: 'merch.items.sensory-building-block.title',
    blurbKey: 'merch.items.sensory-building-block.blurb',
  },
  {
    id: 'sensory-activity-cards',
    imageSrc: '/Sparki Sensory Activity Cards.png',
    titleKey: 'merch.items.sensory-activity-cards.title',
    blurbKey: 'merch.items.sensory-activity-cards.blurb',
  },
  {
    id: 'sensory-pack',
    imageSrc: '/Sparki Sensory Pack.png',
    titleKey: 'merch.items.sensory-pack.title',
    blurbKey: 'merch.items.sensory-pack.blurb',
  },
  {
    id: 'teddy-plush',
    imageSrc: '/Sparki Teddy Plush.png',
    titleKey: 'merch.items.teddy-plush.title',
    blurbKey: 'merch.items.teddy-plush.blurb',
  },
]
