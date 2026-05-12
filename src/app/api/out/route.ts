import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tryOnId = searchParams.get('tryOnId')

  if (!tryOnId) {
    return NextResponse.json({ error: 'tryOnId required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: tryOn } = await supabase
    .from('try_ons')
    .select('affiliate_url, source_url')
    .eq('id', tryOnId)
    .single()

  if (!tryOn?.affiliate_url) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Log the click
  await supabase
    .from('try_ons')
    .update({ buy_clicked: true })
    .eq('id', tryOnId)

  return NextResponse.redirect(tryOn.affiliate_url)
}
