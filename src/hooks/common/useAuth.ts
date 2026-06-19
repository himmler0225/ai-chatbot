'use client'

import { useEffect, useState } from 'react'

// Supabase User type — thay bằng local type khi auth bị vô hiệu hóa
// import type { User } from '@supabase/supabase-js'
// import { supabase } from '@/lib/supabase'

export interface AuthUser {
    id: string
    email?: string
    user_metadata?: { full_name?: string }
}

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Supabase auth tạm thời bị vô hiệu hóa
        // supabase.auth.getSession().then(({ data }) => {
        //   setUser(data.session?.user ?? null)
        //   setLoading(false)
        // })
        //
        // const {
        //   data: { subscription },
        // } = supabase.auth.onAuthStateChange((_, session) => {
        //   setUser(session?.user ?? null)
        //   setLoading(false)
        // })
        //
        // return () => subscription.unsubscribe()

        setUser(null)
        setLoading(false)
    }, [])

    return { user, loading }
}
