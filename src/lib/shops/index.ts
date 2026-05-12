import type { ProductMeta } from './types'
import { parse as parseZalando } from './zalando'
import { parse as parseAboutYou } from './aboutyou'
import { parse as parseAsos } from './asos'
import { parse as parseAsket } from './asket'

export type { ProductMeta }

export function detectShop(url: string): string | null {
  if (url.includes('zalando.')) return 'zalando'
  if (url.includes('aboutyou.')) return 'aboutyou'
  if (url.includes('asos.com')) return 'asos'
  if (url.includes('asket.com')) return 'asket'
  return null
}

export async function scrapeProduct(url: string): Promise<ProductMeta> {
  const shop = detectShop(url)
  if (!shop) throw new Error('Unsupported shop. Paste a link from Zalando, About You, ASOS or Asket.')

  switch (shop) {
    case 'zalando': return parseZalando(url)
    case 'aboutyou': return parseAboutYou(url)
    case 'asos': return parseAsos(url)
    case 'asket': return parseAsket(url)
    default: throw new Error('Unsupported shop')
  }
}
