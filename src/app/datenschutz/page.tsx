export const metadata = { title: 'Datenschutz — DRAPE' }

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F2EB] px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-3xl font-light mb-12"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          Datenschutzerklärung
        </h1>
        <div className="text-[#F5F2EB]/50 text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-[#F5F2EB]/80 font-light mb-2 text-base">1. Deine Fotos</h2>
            <p>
              Deine hochgeladenen Fotos werden verschlüsselt gespeichert und ausschließlich zur Generierung von virtuellen Anproben verwendet.
              <strong className="text-[#F5F2EB]/70"> Deine Fotos werden niemals zum Trainieren von KI-Modellen verwendet. Niemals.</strong>
            </p>
            <p className="mt-2">
              Try-On-Ergebnisse werden nach 30 Tagen automatisch gelöscht. Du kannst dein Konto und alle Daten jederzeit vollständig löschen.
            </p>
          </section>
          <section>
            <h2 className="text-[#F5F2EB]/80 font-light mb-2 text-base">2. Analytics</h2>
            <p>
              Wir verwenden Plausible Analytics (EU-gehostet, cookielos) für anonymisierte Nutzungsstatistiken.
              Kein Cookie-Banner erforderlich.
            </p>
          </section>
          <section>
            <h2 className="text-[#F5F2EB]/80 font-light mb-2 text-base">3. Zahlungen</h2>
            <p>
              Zahlungen werden über Stripe verarbeitet. Stripe setzt technisch notwendige Cookies.
              Keine Zahlungsdaten werden auf unseren Servern gespeichert.
            </p>
          </section>
          <section>
            <h2 className="text-[#F5F2EB]/80 font-light mb-2 text-base">4. Kontakt & Auskunft</h2>
            <p>[Vollständige Datenschutzerklärung wird vom Betreiber ergänzt]</p>
          </section>
        </div>
      </div>
    </div>
  )
}
