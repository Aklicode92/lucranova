'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = Number(params?.id)
  const [customer, setCustomer] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCustomer = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) {
        console.error('Fel vid hämtning av kund:', error)
        setError('Kunde inte hämta kundinformation.')
      } else {
        setCustomer(data)
      }
    }

    if (customerId) fetchCustomer()
  }, [customerId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error: updateError } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', customerId)

    if (updateError) {
      setError('Kunde inte uppdatera kunden.')
    } else {
      router.push('/customer')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Redigera kund</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {customer && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Företagsnamn"
            value={customer.name || ''}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Org.nr"
            value={customer.orgnr || ''}
            onChange={(e) => setCustomer({ ...customer, orgnr: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Adress"
            value={customer.address || ''}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Postnummer och stad"
            value={customer.zip_city || ''}
            onChange={(e) => setCustomer({ ...customer, zip_city: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="E-post"
            value={customer.email || ''}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Telefon"
            value={customer.phone || ''}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-[#1A264F] text-white px-6 py-2 rounded hover:bg-[#2B3B6C]"
          >
            Spara ändringar
          </button>
        </form>
      )}
    </div>
  )
}
