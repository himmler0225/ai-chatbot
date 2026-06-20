import { useInfiniteQuery } from '@tanstack/react-query'
import { STALE_TIKI_SEARCH_MS, STALE_TIKI_FLASH_SALE_MS, STALE_TIKI_MAYBE_LIKE_MS, STALE_TIKI_DETAIL_MS, STALE_TIKI_REVIEWS_MS, COPY_NOTIFICATION_MS, TIKI_QR_SIZE_PX, TIKI_SEARCH_LIMIT, TIKI_REVIEWS_LIMIT, STALE_SERVER_CONFIG_MS } from '@/constants/api'
import { tikiApi } from '@/lib/api/tiki'
import type { TikiProduct } from '@/types/tiki'

export function useTikiSearch(q: string) {
  const query = useInfiniteQuery({
    queryKey:         ['tiki-search', q],
    queryFn:          ({ pageParam }) => tikiApi.search(q, 20, 'top_seller', pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const { current_page, last_page } = last.paging ?? {}
      return current_page != null && last_page != null && current_page < last_page
        ? current_page + 1
        : undefined
    },
    enabled:   !!q,
    staleTime: STALE_TIKI_SEARCH_MS,
  })

  const raw      = query.data?.pages.flatMap(p => p.products) ?? []
  const products = Array.from(new Map(raw.map(p => [p.id, p])).values()) as TikiProduct[]

  return { ...query, products }
}
