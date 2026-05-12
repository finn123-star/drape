import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scrapeProduct } from '@/lib/shops'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await request.json()
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    const product = await scrapeProduct(url)
    return NextResponse.json(product)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Scraping failed' },
      { status: 422 }
    )
  }
}
