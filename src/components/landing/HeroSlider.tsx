'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function HeroSlider() {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(5, Math.min(95, x)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(5, Math.min(95, x)))
  }

  return (
    <div className="relative">
      <p className="text-xs tracking-widest uppercase text-[#F5F2EB]/30 mb-4">
        Drag to compare
      </p>
      <div
        className="relative overflow-hidden select-none cursor-ew-resize"
        style={{ aspectRatio: '16/9', maxHeight: '480px' }}
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Before — product flat lay */}
        <div className="absolute inset-0 bg-[#161618] flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-40 mx-auto bg-[#1E1E20] border border-white/10 flex items-center justify-center mb-3">
              <span className="text-[#F5F2EB]/20 text-xs tracking-widest">PRODUCT</span>
            </div>
            <span className="text-[#F5F2EB]/20 text-xs tracking-widest uppercase">Before</span>
          </div>
        </div>

        {/* After — try-on result */}
        <div
          className="absolute inset-0 bg-[#111113] flex items-center justify-center overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className="text-center">
            <div className="w-28 h-52 mx-auto bg-[#1A1A1C] border border-[#C7FF3E]/20 flex items-center justify-center mb-3">
              <span className="text-[#C7FF3E]/40 text-xs tracking-widest">YOU</span>
            </div>
            <span className="text-[#C7FF3E]/50 text-xs tracking-widest uppercase">After</span>
          </div>
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-px bg-[#C7FF3E] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#C7FF3E] rounded-full flex items-center justify-center shadow-lg">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 6H9M3 6L1 4M3 6L1 8M9 6L11 4M9 6L11 8" stroke="#0B0B0C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xs tracking-widest uppercase text-[#F5F2EB]/40 bg-[#0B0B0C]/60 px-2 py-1">
            Shop photo
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="text-xs tracking-widest uppercase text-[#C7FF3E]/80 bg-[#0B0B0C]/60 px-2 py-1">
            On you
          </span>
        </div>
      </div>

      <p className="text-[#F5F2EB]/20 text-xs mt-4 tracking-wide">
        * Demo — real results generated from your photo and a product link.
      </p>
    </div>
  )
}
