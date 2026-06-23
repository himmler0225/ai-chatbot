'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { adminFetch } from '@/lib/admin/client'
import { useAuth } from '@/hooks/common/useAuth'

type AdminMe = {
  success: boolean
  data: { id: string; email: string; full_name: string | null; role: string }
}

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const q = useQuery({
    queryKey: ['admin', 'me', user?.id],
    queryFn: () => adminFetch<AdminMe>('/api/admin/me'),
    enabled: !!user,
    retry: false,
    staleTime: 60_000,
  })

  const isAdmin = q.data?.data?.role === 'admin'
  const denied = !authLoading && !q.isLoading && (!user || q.isError || !isAdmin)

  useEffect(() => {
    if (denied) router.replace('/app')
  }, [denied, router])

  return {
    user,
    profile: q.data?.data,
    isAdmin,
    loading: authLoading || (!!user && q.isLoading),
    denied,
    refetch: q.refetch,
  }
}
