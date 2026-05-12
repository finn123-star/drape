export const metadata = { title: 'Impressum — DRAPE' }

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F2EB] px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-3xl font-light mb-12"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          Impressum
        </h1>
        <div className="text-[#F5F2EB]/50 text-sm leading-relaxed space-y-4">
          <p>[Angaben gemäß § 5 TMG — wird vom Betreiber ausgefüllt]</p>
          <p>Name und Anschrift des Betreibers werden hier eingetragen.</p>
          <p>
            <strong className="text-[#F5F2EB]/70">Kontakt:</strong><br />
            E-Mail: [email@domain.de]
          </p>
        </div>
      </div>
    </div>
  )
}
