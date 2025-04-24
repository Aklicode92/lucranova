// app/layout.tsx
import './globals.css'
import { Poppins } from 'next/font/google' // Ändra till önskat typsnitt
import { Metadata } from 'next'
import Navbar from './components/Navbar'
import SupabaseProvider from './providers/SupabaseProvider'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Faktura.reak',
  description: 'Skapa fakturor enkelt',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" className="bg-gray-50 text-neutral-900">
      <body className={`${poppins.className} bg-gray-50 text-neutral-900 min-h-screen`}>
        <SupabaseProvider>
          <Navbar />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
