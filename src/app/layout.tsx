import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { PageTransition } from '@/components/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Focus Notebook',
  description: 'Privacy-first productivity dashboard for personal growth',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

