import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateTryOn } from '@/lib/ai/generateTryOn'
import { buildAffiliateUrl } from '@/lib/affiliate'
import type { ProductMeta } from '@/lib/shops'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check daily limit for free users
  const { data: profile } = await supabase
    .from('users')
    .select('base_photo_url, subscription_tier, daily_try_on_count, daily_count_reset_at')
    .eq('id', user.id)
    .single()

  if (!profile?.base_photo_url) {
    return NextResponse.json({ error: 'Please complete onboarding first' }, { status: 400 })
  }

  const now = new Date()
  const resetAt = profile.daily_count_reset_at ? new Date(profile.daily_count_reset_at) : null
  const needsReset = !resetAt || now.getTime() - resetAt.getTime() > 24 * 60 * 60 * 1000

  const dailyCount = needsReset ? 0 : (profile.daily_try_on_count ?? 0)

  if (profile.subscription_tier === 'free' && dailyCount >= 5) {
    return NextResponse.json({ error: 'Daily limit reached. Upgrade for unlimited try-ons.' }, { status: 429 })
  }

  const body = await request.json()
  const { productMeta, sourceUrl, productImageUrl }: {
    productMeta: ProductMeta
    sourceUrl?: string
    productImageUrl: string
  } = body

  if (!productImageUrl) {
    return NextResponse.json({ error: 'Product image required' }, { status: 400 })
  }

  // Create try-on record immediately (pending)
  const { data: tryOnRecord, error: insertError } = await supabase
    .from('try_ons')
    .insert({
      user_id: user.id,
      source_url: sourceUrl ?? null,
      product_image_url: productImageUrl,
      product_meta: productMeta,
      affiliate_url: buildAffiliateUrl({
        shop: productMeta.shop,
        originalUrl: sourceUrl ?? productImageUrl,
        tryOnId: crypto.randomUUID(),
      }),
    })
    .select()
    .single()

  if (insertError || !tryOnRecord) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // Update affiliate URL with real try-on ID
  const affiliateUrl = buildAffiliateUrl({
    shop: productMeta.shop,
    originalUrl: sourceUrl ?? productImageUrl,
    tryOnId: tryOnRecord.id,
  })
  await supabase.from('try_ons').update({ affiliate_url: affiliateUrl }).eq('id', tryOnRecord.id)

  // Update daily count
  await supabase.from('users').update({
    daily_try_on_count: dailyCount + 1,
    daily_count_reset_at: needsReset ? now.toISOString() : profile.daily_count_reset_at,
  }).eq('id', user.id)

  // Generate try-on
  try {
    const result = await generateTryOn({
      modelImageUrl: profile.base_photo_url,
      garmentImageUrl: productImageUrl,
    })

    await supabase.from('try_ons').update({
      result_image_url: result.imageUrl,
    }).eq('id', tryOnRecord.id)

    return NextResponse.json({
      tryOnId: tryOnRecord.id,
      resultImageUrl: result.imageUrl,
      affiliateUrl,
      productMeta,
    })
  } catch (err: unknown) {
    await supabase.from('try_ons').delete().eq('id', tryOnRecord.id)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Try-on generation failed' },
      { status: 500 }
    )
  }
}
