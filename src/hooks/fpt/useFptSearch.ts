import { useInfiniteQuery } from '@tanstack/react-query'
import { STALE_FPT_SEARCH_MS, FPT_SEARCH_LIMIT } from '@/constants/api'
import { fptApi, type FptPriceRange, type FptSortMethod } from '@/lib/api/fpt'
import type { FptProduct } from '@/types/fpt'

export function useFptSearch(
  q: string,
  sortMethod?: FptSortMethod,
  priceRange?: FptPriceRange,
) {
  const query = useInfiniteQuery({
    queryKey: ['fpt-search', q, sortMethod, priceRange],
    queryFn: ({ pageParam }) =>
      fptApi.search(q, FPT_SEARCH_LIMIT, pageParam as number, sortMethod, priceRange),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const loaded = (last.page ?? 1) * (last.limit ?? FPT_SEARCH_LIMIT)
      return loaded < (last.total ?? 0) ? (last.page ?? 1) + 1 : undefined
    },
    enabled: !!q,
    staleTime: STALE_FPT_SEARCH_MS,
  })

  const raw = query.data?.pages.flatMap(p => p.products) ?? []
  const products = Array.from(new Map(raw.map(p => [p.id, p])).values()) as FptProduct[]

  return { ...query, products }
}
