'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)

  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    zip_city: '',
    country: '',
    location: '',
    bankgiro: '',
    contact_name: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const currentUser = userData.user
      setUser(currentUser)

      if (currentUser) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (data) {
          setFormData({
            company_name: data.company_name || '',
            address: data.address || '',
            zip_city: data.zip_city || '',
            country: data.country || '',
            location: data.location || '',
            bankgiro: data.bankgiro || '',
            contact_name: data.contact_name || '',
            phone: data.phone || '',
            email: data.email || ''
          })
        }
      }
    }

    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return

    const payload = {
      user_id: user.id,
      ...formData
    }

    console.log('👉 DATA SOM SKICKAS TILL SUPABASE:', payload)

    const { error } = await supabase
      .from('user_profiles')
      .upsert(payload)

    if (error) {
      console.error('❌ Supabase error:', error.message)
    } else {
      console.log('✅ Sparat!')
      setEditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1A264F] mb-8">👤 Min profil</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-[#1A264F] mb-4">🏢 Företagsuppgifter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Företagsnamn" name="company_name" value={formData.company_name} onChange={handleChange} editable={editing} />
              <Input label="Adress" name="address" value={formData.address} onChange={handleChange} editable={editing} />
              <Input label="Postnummer och stad" name="zip_city" value={formData.zip_city} onChange={handleChange} editable={editing} />
              <Input label="Land" name="country" value={formData.country} onChange={handleChange} editable={editing} />
              <Input label="Säte" name="location" value={formData.location} onChange={handleChange} editable={editing} />
              <Input label="Bankgiro" name="bankgiro" value={formData.bankgiro} onChange={handleChange} editable={editing} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A264F] mb-4">📞 Kontaktuppgifter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="För- och efternamn" name="contact_name" value={formData.contact_name} onChange={handleChange} editable={editing} />
              <Input label="Telefonnummer" name="phone" value={formData.phone} onChange={handleChange} editable={editing} />
              <Input label="E-postadress" name="email" value={formData.email} onChange={handleChange} editable={editing} />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-[#1A264F] text-white px-4 py-2 rounded hover:bg-[#2B3B6C] text-sm font-medium"
            >
              {editing ? 'Avbryt' : 'Ändra uppgifter'}
            </button>
            {editing && (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 text-sm font-medium"
              >
                Spara
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Input({ label, name, value, onChange, editable }: {
  label: string, name: string, value: string, onChange: any, editable: boolean
}) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      {editable ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded px-2 py-1"
        />
      ) : (
        <p className="font-medium text-gray-800">{value}</p>
      )}
    </div>
  )
}
