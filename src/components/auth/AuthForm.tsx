'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

type Mode = 'magic_link' | 'sent'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [mode, setMode] = useState<Mode>('magic_link')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMode('sent')
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (mode === 'sent') {
    return (
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-12 h-12 border border-[#C7FF3E] flex items-center justify-center mx-auto mb-6">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 10L8 15L17 5" stroke="#C7FF3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[#F5F2EB] font-light mb-2">Check your inbox.</p>
        <p className="text-[#F5F2EB]/40 text-sm">
          We sent a link to <span className="text-[#F5F2EB]/70">{email}</span>.
          <br />
          Click it to enter the fitting room.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <form onSubmit={handleMagicLink} className="space-y-4">
        <div>
          <label className="text-xs tracking-widest uppercase text-[#F5F2EB]/40 block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            required
            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[#F5F2EB] placeholder:text-[#F5F2EB]/20 focus:outline-none focus:border-[#C7FF3E] transition-colors text-sm"
          />
        </div>
        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-[#C7FF3E] text-[#0B0B0C] py-3 text-sm tracking-widest uppercase font-medium hover:bg-[#F5F2EB] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send magic link'}
        </button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[#F5F2EB]/20 text-xs tracking-widest uppercase">or</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full border border-white/10 py-3 text-sm tracking-widest uppercase text-[#F5F2EB]/60 hover:border-white/20 hover:text-[#F5F2EB]/80 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-[#F5F2EB]/20 text-xs text-center mt-6 leading-relaxed">
        Mit der Anmeldung akzeptierst du unsere{' '}
        <a href="/datenschutz" className="underline hover:text-[#F5F2EB]/40">Datenschutzerklärung</a>.
        <br />
        Du bestätigst, mindestens 18 Jahre alt zu sein.
      </p>
    </motion.div>
  )
}
