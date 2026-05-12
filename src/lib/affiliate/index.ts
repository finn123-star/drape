export interface AffiliateParams {
  shop: string
  originalUrl: string
  tryOnId: string
}

const AWIN_PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID ?? ''

const AWIN_ADVERTISER_IDS: Record<string, string> = {
  zalando: '14314',
  aboutyou: '21420',
  asos: '14185',
}

export function buildAffiliateUrl({ shop, originalUrl, tryOnId }: AffiliateParams): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://drape.app'
  void appUrl // referenced for future use

  if (shop === 'asket') {
    const u = new URL(originalUrl)
    u.searchParams.set('utm_source', 'drape')
    u.searchParams.set('utm_medium', 'affiliate')
    u.searchParams.set('utm_campaign', 'tryon')
    u.searchParams.set('utm_content', tryOnId)
    return u.toString()
  }

  const advertiserId = AWIN_ADVERTISER_IDS[shop]
  if (!advertiserId || !AWIN_PUBLISHER_ID) return originalUrl

  const deepLink = encodeURIComponent(originalUrl)
  const clickref = tryOnId.slice(0, 20)

  return `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${AWIN_PUBLISHER_ID}&clickref=${clickref}&p=${deepLink}`
}
