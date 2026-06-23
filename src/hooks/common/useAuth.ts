'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'

export type AuthUser = User

export function useAuth() {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let subscription: { unsubscribe: () => void } | undefined

        try {
            const client = getSupabase()
            client.auth.getSession().then(({ data }) => {
                setUser(data.session?.user ?? null)
                setLoading(false)
            })

            const { data } = client.auth.onAuthStateChange((_, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            })
            subscription = data.subscription
        } catch {
            setLoading(false)
        }

        return () => subscription?.unsubscribe()
    }, [])

    return { user, loading }
}
