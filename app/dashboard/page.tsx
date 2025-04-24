'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [invoiceCount, setInvoiceCount] = useState<number>(0)
  const [paidCount, setPaidCount] = useState<number>(0)
  const [latestInvoiceDate, setLatestInvoiceDate] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndInvoices = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // sorterar nyaste först

      if (!error && data) {
        setInvoiceCount(data.length)
        setPaidCount(data.filter((inv) => inv.is_paid).length)
        if (data.length > 0) {
          const date = new Date(data[0].created_at)
          setLatestInvoiceDate(date.toLocaleDateString('sv-SE'))
        }
      }
    }

    fetchUserAndInvoices()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-[#1A264F] text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8">Mina tjänster</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-[#2B3B6C] bg-[#2B3B6C]">🏠 Hem</Link>
          <Link href="/profile" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">👤 Min profil</Link>
          <Link href="/invoice" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">📁 Fakturor</Link>
          <Link href="/invoice/new" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">➕ Skapa faktura</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Välkommen till din översikt</h1>
        {user && (
          <p className="mb-6 text-gray-700">Inloggad som: <strong>{user.email}</strong></p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">📄 Totala fakturor</h2>
            <p className="text-3xl mt-2 font-bold text-[#1A264F]">{invoiceCount}</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">✅ Betalda</h2>
            <p className="text-3xl mt-2 font-bold text-green-600">{paidCount}</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">❌ Obetalda</h2>
            <p className="text-3xl mt-2 font-bold text-red-500">{invoiceCount - paidCount}</p>
          </div>
        </div>

        {latestInvoiceDate && (
          <p className="text-sm text-gray-600 mb-8">
            Senaste fakturan skapades: <strong>{latestInvoiceDate}</strong>
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <Link
            href="/invoice/new"
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded shadow"
          >
            ➕ Skapa ny faktura
          </Link>
          <Link
            href="/invoice"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded shadow"
          >
            📁 Visa alla fakturor
          </Link>
        </div>
      </main>
    </div>
  )
}
