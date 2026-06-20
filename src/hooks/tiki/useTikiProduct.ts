import { useQuery } from '@tanstack/react-query'
import { STALE_TIKI_SEARCH_MS, STALE_TIKI_FLASH_SALE_MS, STALE_TIKI_MAYBE_LIKE_MS, STALE_TIKI_DETAIL_MS, STALE_TIKI_REVIEWS_MS, COPY_NOTIFICATION_MS, TIKI_QR_SIZE_PX, TIKI_SEARCH_LIMIT, TIKI_REVIEWS_LIMIT, STALE_SERVER_CONFIG_MS } from '@/constants/api'
import { tikiApi } from '@/lib/api/tiki'
import type { TikiReview } from '@/types/tiki'

export function useTikiDetail(id: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey:  ['tiki-detail', id],
    queryFn:   () => tikiApi.detail(id!),
    enabled:   enabled && !!id,
    staleTime: STALE_TIKI_DETAIL_MS,
  })
}

export function useTikiReviews(id: number | undefined, spid: number | undefined, enabled: boolean) {
  const q = useQuery({
    queryKey:  ['tiki-reviews', id],
    queryFn:   () => tikiApi.reviews(id!, spid, 1, 10),
    enabled:   enabled && !!id,
    staleTime: STALE_TIKI_REVIEWS_MS,
  })
  const reviews: TikiReview[] = Array.isArray(q.data)
    ? q.data
    : (q.data as { reviews?: TikiReview[] })?.reviews ?? []
  return { ...q, reviews }
}
