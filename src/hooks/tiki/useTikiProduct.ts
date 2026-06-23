import { useQuery } from '@tanstack/react-query'
import { STALE_TIKI_DETAIL_MS, STALE_TIKI_REVIEWS_MS, TIKI_REVIEWS_LIMIT } from '@/constants/api'
import { tikiApi } from '@/lib/api/tiki'
import type { TikiReview } from '@/types/tiki'

type ReviewPayload = {
  reviews?: Array<TikiReview & { customer?: { name?: string } }>
}

function normalizeReviews(data: ReviewPayload | undefined): TikiReview[] {
  return (data?.reviews ?? []).map(r => ({
    ...r,
    customer_name: r.customer_name ?? r.customer?.name,
  }))
}

export function useTikiDetail(
  id: number | undefined,
  spid: number | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['tiki-detail', id, spid],
    queryFn: () => tikiApi.detail(id!, spid),
    enabled: enabled && !!id,
    staleTime: STALE_TIKI_DETAIL_MS,
    retry: false,
  })
}

export function useTikiReviews(
  id: number | undefined,
  spid: number | undefined,
  enabled: boolean,
) {
  const q = useQuery({
    queryKey: ['tiki-reviews', id, spid],
    queryFn: () => tikiApi.reviews(id!, spid, 1, TIKI_REVIEWS_LIMIT),
    enabled: enabled && !!id,
    staleTime: STALE_TIKI_REVIEWS_MS,
    retry: false,
  })

  const reviews = normalizeReviews(q.data as ReviewPayload | undefined)

  return { ...q, reviews }
}
