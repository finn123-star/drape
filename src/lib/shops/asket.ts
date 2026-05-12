import * as cheerio from 'cheerio'
import type { ProductMeta } from './types'

export async function parse(url: string): Promise<ProductMeta> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`Asket fetch failed: ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)

  let imageUrl = $('meta[property="og:image"]').attr('content') ?? ''
  const title = $('meta[property="og:title"]').attr('content') ?? $('title').text().trim()

  let price = 0
  let currency = 'EUR'

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}')
      if (data['@type'] === 'Product') {
        if (!imageUrl) imageUrl = Array.isArray(data.image) ? data.image[0] : data.image
        const offer = data.offers
        if (offer) {
          price = parseFloat(offer.price ?? offer.lowPrice ?? '0')
          currency = offer.priceCurrency ?? 'EUR'
        }
      }
    } catch {}
  })

  if (!imageUrl) throw new Error('Could not extract product image from Asket')

  return { title, brand: 'Asket', price, currency, imageUrl, shop: 'asket' }
}
