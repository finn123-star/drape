import { AuthForm } from '@/components/auth/AuthForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Einloggen — DRAPE',
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <span
            className="text-[#F5F2EB] tracking-[0.4em] text-base font-light uppercase"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            DRAPE
          </span>
          <p className="text-[#F5F2EB]/40 text-sm mt-3">
            The fitting room is already open.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
