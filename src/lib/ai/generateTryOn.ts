export interface TryOnInput {
  modelImageUrl: string
  garmentImageUrl: string
  category?: 'tops' | 'bottoms' | 'one-pieces'
}

export interface TryOnResult {
  imageUrl: string
  generationId: string
}

export async function generateTryOn(input: TryOnInput): Promise<TryOnResult> {
  const apiKey = process.env.FASHN_API_KEY
  if (!apiKey) throw new Error('FASHN_API_KEY not configured')

  const response = await fetch('https://api.fashn.ai/v1/run', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_image: input.modelImageUrl,
      garment_image: input.garmentImageUrl,
      category: input.category ?? 'tops',
    }),
  })

  if (!response.ok) {
    // Fallback to Replicate if FASHN fails
    return generateTryOnReplicate(input)
  }

  const data = await response.json()
  return {
    imageUrl: data.output?.[0] ?? data.url ?? data.image_url,
    generationId: data.id ?? crypto.randomUUID(),
  }
}

export async function pollTryOnStatus(generationId: string): Promise<{ status: string; imageUrl?: string }> {
  const apiKey = process.env.FASHN_API_KEY
  if (!apiKey) throw new Error('FASHN_API_KEY not configured')

  const response = await fetch(`https://api.fashn.ai/v1/status/${generationId}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  })

  if (!response.ok) return { status: 'error' }

  const data = await response.json()
  return {
    status: data.status,
    imageUrl: data.output?.[0] ?? data.url ?? data.image_url,
  }
}

async function generateTryOnReplicate(input: TryOnInput): Promise<TryOnResult> {
  const apiToken = process.env.REPLICATE_API_TOKEN
  if (!apiToken) throw new Error('No AI backend available. Configure FASHN_API_KEY or REPLICATE_API_TOKEN.')

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'cuuupid/idm-vton',
      input: {
        human_img: input.modelImageUrl,
        garm_img: input.garmentImageUrl,
      },
    }),
  })

  if (!response.ok) throw new Error('Replicate fallback failed')

  const data = await response.json()
  return {
    imageUrl: data.output?.[0] ?? '',
    generationId: data.id,
  }
}
