'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const shops = ['Zalando', 'About You', 'ASOS', 'Asket']

export function SupportedShops() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="px-6 py-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.p
          className="text-xs tracking-[0.4em] uppercase text-[#F5F2EB]/30 mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Works with
        </motion.p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20">
          {shops.map((shop, i) => (
            <motion.span
              key={shop}
              className="text-[#F5F2EB]/30 text-sm tracking-widest uppercase font-light hover:text-[#F5F2EB]/70 transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              {shop}
            </motion.span>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2
            className="text-3xl md:text-5xl font-light mb-6 text-[#F5F2EB]"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            The fitting room
            <br />
            <em className="not-italic text-[#C7FF3E]">is already open.</em>
          </h2>
          <Link
            href="/auth"
            className="inline-block bg-[#C7FF3E] text-[#0B0B0C] px-10 py-5 text-sm tracking-widest uppercase font-medium hover:bg-[#F5F2EB] transition-colors duration-300"
          >
            Try it free
          </Link>
          <p className="text-[#F5F2EB]/20 text-xs mt-4">
            5 free try-ons. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
