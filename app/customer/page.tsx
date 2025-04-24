'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCustomers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fel vid hämtning av kunder:', error)
        setError('Kunde inte hämta kunddata')
      } else {
        setCustomers(data || [])
      }
    }
    fetchCustomers()
  }, [router])

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Vill du ta bort kunden?')
    if (!confirmDelete) return

    const { error } = await supabase.from('customers').delete().eq('id', id)
    if (error) {
      alert('Kunde inte ta bort kund.')
    } else {
      setCustomers(customers.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#1A264F] text-white min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-8">Mina tjänster</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">🏠 Hem</Link>
          <Link href="/profile" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">👤 Min profil</Link>
          <Link href="/invoice" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">📁 Fakturor</Link>
          <Link href="/invoice/new" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">➕ Skapa faktura</Link>
          <Link href="/customer" className="block py-2 px-4 rounded hover:bg-[#2B3B6C] bg-[#2B3B6C]">📇 Kunder</Link>
          <Link href="/customer/new" className="block py-2 px-4 rounded hover:bg-[#2B3B6C]">➕ Lägg till kund</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10 font-sans text-neutral-800">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Mina kunder</h1>
          <Link
            href="/customer/new"
            className="text-white bg-[#1A264F] hover:bg-[#2B3B6C] font-medium rounded-xl px-6 py-2 text-sm shadow"
          >
            ➕ Lägg till kund
          </Link>
        </div>

        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
          <table className="min-w-full text-sm text-left text-neutral-800">
            <thead className="text-xs uppercase bg-gray-100 text-neutral-700">
              <tr>
                <th className="px-6 py-3">Namn</th>
                <th className="px-6 py-3">Org.nr</th>
                <th className="px-6 py-3">Adress</th>
                <th className="px-6 py-3">E-post</th>
                <th className="px-6 py-3">Telefon</th>
                <th className="px-6 py-3">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:shadow-md transition-all">
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{customer.name}</td>
                  <td className="px-6 py-4">{customer.orgnr}</td>
                  <td className="px-6 py-4">{customer.address}, {customer.zip_city}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4 space-x-2">
                    <Link
                      href={`/customer/edit/${customer.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Redigera
                    </Link>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
