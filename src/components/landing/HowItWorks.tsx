'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Upload your photo',
    description: 'One full-body shot. Plain background preferred. Stored securely — never used to train AI.',
  },
  {
    number: '02',
    title: 'Paste a product link',
    description: 'From Zalando, About You, ASOS or Asket. Or upload a product image directly.',
  },
  {
    number: '03',
    title: 'The room looks at it',
    description: 'AI generates a photo-realistic try-on in seconds. You see the fit before you pay.',
  },
  {
    number: '04',
    title: 'Decide. Buy. Move on.',
    description: 'Get an honest verdict on fit and style. Buy direct. Save to your fitting room.',
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-6 py-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.p
          className="text-xs tracking-[0.4em] uppercase text-[#C7FF3E] mb-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          How it works
        </motion.p>
        <motion.h2
          className="text-3xl md:text-5xl font-light mb-16 text-[#F5F2EB]"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Four steps.<br />
          <span className="text-[#F5F2EB]/40">No guesswork.</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-px bg-white/5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="bg-[#0B0B0C] p-8"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[#C7FF3E] text-xs tracking-widest font-light">{step.number}</span>
              <h3 className="text-lg font-light text-[#F5F2EB] mt-3 mb-2">{step.title}</h3>
              <p className="text-[#F5F2EB]/40 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
