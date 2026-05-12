'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { HeroSlider } from './HeroSlider'
import { HowItWorks } from './HowItWorks'
import { SupportedShops } from './SupportedShops'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F2EB]">
      <Nav />
      <Hero />
      <HowItWorks />
      <SupportedShops />
      <Footer />
    </div>
  )
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0B0B0C]/80 backdrop-blur-sm">
      <span
        className="text-[#F5F2EB] tracking-[0.3em] text-sm font-light uppercase"
        style={{ fontFamily: 'Fraunces, Georgia, serif' }}
      >
        DRAPE
      </span>
      <Link
        href="/auth"
        className="text-xs tracking-widest uppercase text-[#C7FF3E] hover:text-[#F5F2EB] transition-colors duration-300"
      >
        Try it free →
      </Link>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs tracking-[0.4em] uppercase text-[#C7FF3E] mb-8 font-light">
            Virtual Try-On
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] mb-8 text-[#F5F2EB]"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            See it on you
            <br />
            <em className="not-italic text-[#C7FF3E]">before</em> you buy it.
          </h1>
          <p className="text-[#F5F2EB]/50 text-lg md:text-xl font-light max-w-xl leading-relaxed mb-12">
            Paste a link from Zalando, About You or ASOS. See the piece on your body in seconds. No more returns. No more regret.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/auth"
              className="inline-block bg-[#C7FF3E] text-[#0B0B0C] px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-[#F5F2EB] transition-colors duration-300"
            >
              Try it free
            </Link>
            <span className="text-[#F5F2EB]/30 text-xs self-center">
              No credit card. 5 free try-ons.
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroSlider />
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <span
            className="text-[#F5F2EB] tracking-[0.3em] text-sm font-light uppercase block mb-2"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            DRAPE
          </span>
          <p className="text-[#F5F2EB]/30 text-xs max-w-xs leading-relaxed">
            Deine Fotos werden niemals zum Trainieren von KI verwendet.
          </p>
        </div>
        <nav className="flex flex-col gap-3">
          <Link href="/impressum" className="text-xs text-[#F5F2EB]/40 hover:text-[#F5F2EB] transition-colors">
            Impressum
          </Link>
          <Link href="/datenschutz" className="text-xs text-[#F5F2EB]/40 hover:text-[#F5F2EB] transition-colors">
            Datenschutz
          </Link>
        </nav>
        <p className="text-[#F5F2EB]/20 text-xs self-end">
          © {new Date().getFullYear()} DRAPE
        </p>
      </div>
    </footer>
  )
}
