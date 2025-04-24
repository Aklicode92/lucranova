// app/customer/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function NewCustomerPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    orgnr: '',
    address: '',
    zip_city: '',
    country: '',
    phone: '',
    email: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('customers').insert({
      ...form,
      user_id: user?.id,
      created_at: new Date().toISOString()
    })

    if (insertError) {
      setError('Kunde inte spara kunden.')
      console.error('Insert error:', insertError)
    } else {
      router.push('/customer')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Lägg till kund</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-600 font-medium">{error}</p>}
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block mb-1 text-sm font-medium text-gray-700">
              {key.replace('_', ' ').toUpperCase()}
            </label>
            <input
              required
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-[#1A264F] hover:bg-[#2B3B6C] text-white font-medium py-2 px-4 rounded-xl shadow"
        >
          Spara kund
        </button>
      </form>
    </div>
  )
}
