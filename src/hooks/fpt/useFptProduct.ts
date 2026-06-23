import { useQuery } from '@tanstack/react-query'
import { STALE_FPT_DETAIL_MS, STALE_FPT_REVIEWS_MS, FPT_REVIEWS_LIMIT } from '@/constants/api'
import { fptApi } from '@/lib/api/fpt'
import type { FptReview } from '@/types/fpt'

export function useFptDetail(id: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['fpt-detail', id],
    queryFn: () => fptApi.detail(id!),
    enabled: enabled && !!id,
    staleTime: STALE_FPT_DETAIL_MS,
  })
}

export function useFptReviews(id: string | undefined, enabled: boolean) {
  const q = useQuery({
    queryKey: ['fpt-reviews', id],
    queryFn: () => fptApi.reviews(id!, 1, FPT_REVIEWS_LIMIT),
    enabled: enabled && !!id,
    staleTime: STALE_FPT_REVIEWS_MS,
  })

  const reviews: FptReview[] = q.data?.reviews ?? []

  return { ...q, reviews }
}
