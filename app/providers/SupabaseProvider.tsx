'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'

type SupabaseContextType = {
  user: User | null
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
})

export const useSupabase = () => useContext(SupabaseContext)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session ?? null)
      setUser(session?.user ?? null)

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session ?? null)
        setUser(session?.user ?? null)
      })
    }

    init()
  }, [])

  return (
    <SupabaseContext.Provider value={{ session, user }}>
      {children}
    </SupabaseContext.Provider>
  )
}
