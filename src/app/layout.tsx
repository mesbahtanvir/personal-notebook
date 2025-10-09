import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Personal Notebook',
  description: 'Privacy-first personal productivity dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container-page">
          {children}
        </div>
      </body>
    </html>
  )
}
