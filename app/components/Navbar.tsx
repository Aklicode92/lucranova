'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-[#1A264F]">enkelfaktura</Link>
      <div className="space-x-6 text-sm text-[#1A264F] font-medium">
        {user ? (
          <>
            <Link href="/invoice">Mina fakturor</Link>
            <Link href="/invoice/new">Skapa faktura</Link>
            <Link href="/customers">Kundlista</Link>
            <Link href="/profile">Min profil</Link>
          </>
        ) : (
          <>
            <Link href="/about">Om oss</Link>
            <Link href="/register">Skapa konto</Link>
            <Link href="/login">Logga in</Link>
          </>
        )}
      </div>
    </nav>
  )
}
