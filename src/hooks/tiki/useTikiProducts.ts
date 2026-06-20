import { useQuery } from '@tanstack/react-query'
import { STALE_TIKI_SEARCH_MS, STALE_TIKI_FLASH_SALE_MS, STALE_TIKI_MAYBE_LIKE_MS, STALE_TIKI_DETAIL_MS, STALE_TIKI_REVIEWS_MS, COPY_NOTIFICATION_MS, TIKI_QR_SIZE_PX, TIKI_SEARCH_LIMIT, TIKI_REVIEWS_LIMIT, STALE_SERVER_CONFIG_MS } from '@/constants/api'
import { tikiApi } from '@/lib/api/tiki'
import type { TikiProduct } from '@/types/tiki'

function toList(data: unknown): TikiProduct[] {
  if (!data) return []
  if (Array.isArray(data)) return data as TikiProduct[]
  const d = data as Record<string, unknown>
  if (Array.isArray(d.products)) return d.products as TikiProduct[]
  if (Array.isArray(d.items))    return d.items    as TikiProduct[]
  return []
}

export function useTikiFlashSale() {
  const q = useQuery({ queryKey: ['tiki-flash-sale'],      queryFn: () => tikiApi.flashSale(40),  staleTime: STALE_TIKI_FLASH_SALE_MS })
  return { ...q, products: toList(q.data) }
}

export function useTikiTopChoice() {
  const q = useQuery({ queryKey: ['tiki-top-choice'],      queryFn: () => tikiApi.topChoice(),     staleTime: 10 * 60_000 })
  return { ...q, products: toList(q.data) }
}

export function useTikiMaybeYouLike() {
  const q = useQuery({ queryKey: ['tiki-maybe-you-like'], queryFn: () => tikiApi.maybeYouLike(),  staleTime: STALE_TIKI_MAYBE_LIKE_MS })
  return { ...q, products: toList(q.data) }
}
