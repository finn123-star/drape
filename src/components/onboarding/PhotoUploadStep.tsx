'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'

export function PhotoUploadStep({
  userId,
  onComplete,
}: {
  userId: string
  onComplete: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError(null)
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const path = `${userId}/base-photo.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('user-photos').getPublicUrl(path)

      // Update user profile
      await supabase
        .from('users')
        .update({ base_photo_url: data.publicUrl })
        .eq('id', userId)

      onComplete(data.publicUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed. Try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }, [userId, supabase, onComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div>
      <p className="text-xs tracking-[0.4em] uppercase text-[#C7FF3E] mb-4">Step 01 / 03</p>
      <h2
        className="text-3xl md:text-4xl font-light text-[#F5F2EB] mb-3"
        style={{ fontFamily: 'Fraunces, Georgia, serif' }}
      >
        Your photo.
      </h2>
      <p className="text-[#F5F2EB]/40 text-sm mb-8 leading-relaxed">
        Full body. Standing. Plain background works best — but anything goes.
        We&apos;ll never use this to train AI.
      </p>

      {/* Good / Bad examples */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="border border-[#C7FF3E]/30 p-3">
          <div className="bg-[#161618] h-24 flex items-center justify-center mb-2">
            <span className="text-2xl">🧍</span>
          </div>
          <p className="text-[#C7FF3E] text-xs tracking-widest uppercase">Good</p>
          <p className="text-[#F5F2EB]/30 text-xs mt-1">Full body, visible fit</p>
        </div>
        <div className="border border-white/5 p-3">
          <div className="bg-[#161618] h-24 flex items-center justify-center mb-2">
            <span className="text-2xl">🤳</span>
          </div>
          <p className="text-[#F5F2EB]/30 text-xs tracking-widest uppercase">Skip</p>
          <p className="text-[#F5F2EB]/20 text-xs mt-1">Selfie, cropped, seated</p>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-[#C7FF3E] bg-[#C7FF3E]/5'
            : preview
            ? 'border-[#C7FF3E]/40'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain mb-3" />
            <p className="text-[#F5F2EB]/40 text-xs">
              {uploading ? 'Uploading...' : 'Click to change'}
            </p>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v10M10 3L7 6M10 3l3 3M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="#F5F2EB" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[#F5F2EB]/40 text-sm">
              {isDragActive ? 'Drop it.' : 'Drop a photo or click to upload'}
            </p>
            <p className="text-[#F5F2EB]/20 text-xs mt-2">JPG, PNG, WEBP — max 10MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

      {uploading && (
        <p className="text-[#C7FF3E] text-xs mt-3 tracking-widest">Uploading...</p>
      )}
    </div>
  )
}
