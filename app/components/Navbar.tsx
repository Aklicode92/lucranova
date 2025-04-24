'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setLoggedIn(!!data.session)
    }
    checkSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-[#1A264F] text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex gap-6 text-sm font-medium">
        <Link href="/dashboard" className="hover:underline">Översikt</Link>
        <Link href="/invoice" className="hover:underline">Mina fakturor</Link>
        <Link href="/invoice/new" className="hover:underline">Skapa faktura</Link>
        <Link href="/customer" className="hover:underline">Kundregister</Link>
        <Link href="/customer/new" className="hover:underline">Ny kund</Link>
        <Link href="/profile" className="hover:underline">Min profil</Link>
      </div>
      {loggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md text-sm"
        >
          Logga ut
        </button>
      )}
    </nav>
  )
}
