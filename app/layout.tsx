import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Outfit } from 'next/font/google'
import './globals.css'

const sans = Outfit({ subsets: ['latin'], variable: '--font-sans' })
const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'PFB Collection — Gestionarea creanțelor',
  description:
    'PFB Collection în cifre: experiență, procese certificate și rezultate măsurabile în gestionarea creanțelor debitoare.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0c1014',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`bg-background ${sans.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
