import { useQuery } from '@tanstack/react-query'
import { tikiApi } from '@/src/lib/api/tiki'
import type { TikiReview } from '@/src/types/tiki'

export function useTikiDetail(id: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey:  ['tiki-detail', id],
    queryFn:   () => tikiApi.detail(id!),
    enabled:   enabled && !!id,
    staleTime: 30 * 60_000,
  })
}

export function useTikiReviews(id: number | undefined, spid: number | undefined, enabled: boolean) {
  const q = useQuery({
    queryKey:  ['tiki-reviews', id],
    queryFn:   () => tikiApi.reviews(id!, spid, 1, 10),
    enabled:   enabled && !!id,
    staleTime: 15 * 60_000,
  })
  const reviews: TikiReview[] = Array.isArray(q.data)
    ? q.data
    : (q.data as { reviews?: TikiReview[] })?.reviews ?? []
  return { ...q, reviews }
}
