import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import '@/styles/globals.css'
import '@/styles/site.scss'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Platinum Pitches - Find Your Perfect Touring & Caravan Park',
    template: '%s | Platinum Pitches',
  },
  description: 'Discover and book the best touring parks, caravan parks, and camping grounds across the United Kingdom. Find pitches, facilities, and amenities for your next adventure.',
  keywords: ['caravan parks', 'touring parks', 'camping', 'United Kingdom', 'motorhome', 'campervan', 'holiday parks'],
  authors: [{ name: 'Platinum Pitches' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Platinum Pitches',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1a213f' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
