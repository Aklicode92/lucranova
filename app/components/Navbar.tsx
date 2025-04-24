'use client'

import Link from 'next/link'
import { useUser } from '@/lib/useUser'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const { user } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const logoLink = user ? '/dashboard' : '/'

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between">
      <Link href={logoLink} className="font-bold text-xl text-[#1A264F]">EnkelFaktura</Link>
      <div className="flex space-x-6 items-center">
        {!user ? (
          <>
            <Link href="/signup" className="hover:underline">Skapa konto</Link>
            <Link href="/login" className="hover:underline">Logga in</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hover:underline">Översikt</Link>
            <Link href="/invoice" className="hover:underline">Mina fakturor</Link>
            <Link href="/invoice/new" className="hover:underline">Skapa faktura</Link>
            <Link href="/customer" className="hover:underline">Kundlista</Link>
            <Link href="/profile" className="hover:underline">Min profil</Link>
            <button onClick={handleLogout} className="hover:underline text-red-500">Logga ut</button>
          </>
        )}
      </div>
    </nav>
  )
}
