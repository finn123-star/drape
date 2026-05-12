import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DRAPE — See it on you before you buy it',
  description: 'Virtual try-on for men. Paste a link, see the fit. No more returns.',
  keywords: ['virtual try-on', 'mode', 'fashion', 'Zalando', 'outfit'],
  openGraph: {
    title: 'DRAPE — See it on you before you buy it',
    description: 'Virtual try-on for men. No more returns.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
