'use client'

import { useQuery } from '@tanstack/react-query'
import { adminFetch } from '@/lib/admin/client'
import { useAuth } from '@/hooks/common/useAuth'

type AdminMe = {
  success: boolean
  data: { role: string }
}

/** Check admin role without redirect — for optional UI in chat. */
export function useAdminAccess() {
  const { user, loading: authLoading } = useAuth()

  const q = useQuery({
    queryKey: ['admin', 'access', user?.id],
    queryFn: () => adminFetch<AdminMe>('/api/admin/me'),
    enabled: !!user,
    retry: false,
    staleTime: 60_000,
  })

  return {
    isAdmin: q.data?.data?.role === 'admin',
    loading: authLoading || (!!user && q.isLoading),
    profile: q.data?.data,
  }
}
