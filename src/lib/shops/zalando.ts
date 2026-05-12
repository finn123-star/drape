import * as cheerio from 'cheerio'
import type { ProductMeta } from './types'

export async function parse(url: string): Promise<ProductMeta> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept-Language': 'de-DE,de;q=0.9',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`Zalando fetch failed: ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)

  // Try JSON-LD first
  const meta: Partial<ProductMeta> = {}
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}')
      if (data['@type'] === 'Product') {
        meta.title = data.name
        meta.brand = data.brand?.name ?? ''
        meta.imageUrl = Array.isArray(data.image) ? data.image[0] : data.image
        const offer = data.offers
        if (offer) {
          meta.price = parseFloat(offer.price ?? offer.lowPrice ?? '0')
          meta.currency = offer.priceCurrency ?? 'EUR'
        }
      }
    } catch {}
  })

  if (!meta.imageUrl) {
    // Fallback: og:image
    meta.imageUrl = $('meta[property="og:image"]').attr('content') ?? ''
  }
  if (!meta.title) {
    meta.title = $('meta[property="og:title"]').attr('content') ?? $('title').text().trim()
  }

  if (!meta.imageUrl) throw new Error('Could not extract product image from Zalando')

  return {
    title: meta.title ?? 'Zalando Product',
    brand: meta.brand ?? 'Zalando',
    price: meta.price ?? 0,
    currency: meta.currency ?? 'EUR',
    imageUrl: meta.imageUrl,
    shop: 'zalando',
  }
}
