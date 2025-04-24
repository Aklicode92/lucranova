'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 1. Skapa konto
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError || !data.user) {
      setError('Kunde inte skapa konto.')
      return
    }

    // 2. Skapa profil
    const { error: profileError } = await supabase.from('user_profiles').insert([
      {
        user_id: data.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
      },
    ])

    if (profileError) {
      setError('Database error saving new user')
      return
    }

    // 3. Vidare till översikten
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Skapa konto</h1>
      <form onSubmit={handleSignup} className="space-y-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Förnamn"
          value={firstName}
          onChange={(
