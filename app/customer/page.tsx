'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/lib/useUser'

type Customer = {
  id: number
  name: string
  orgnr: string
  address: string
  zip_city: string
}

export default function CustomerPage() {
  const router = useRouter()
  const { user } = useUser()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        setError('Kunde inte hämta kundlistan.')
        return
      }

      setCustomers(data || [])
    }

    fetchCustomers()
  }, [user])

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-500">Du måste vara inloggad för att se kundlistan.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1A264F] mb-6">Kundlista</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {customers.length === 0 ? (
        <p>Inga kunder tillgängliga.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Namn</th>
              <th className="p-3 text-left">Organisationsnummer</th>
              <th className="p-3 text-left">Adress</th>
              <th className="p-3 text-left">Postnummer och Ort</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.orgnr}</td>
                <td className="p-3">{customer.address}</td>
                <td className="p-3">{customer.zip_city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
