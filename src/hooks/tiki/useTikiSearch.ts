import { useInfiniteQuery } from '@tanstack/react-query'
import { tikiApi } from '@/src/lib/api/tiki'
import type { TikiProduct } from '@/src/types/tiki'

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
    staleTime: 5 * 60_000,
  })

  const raw      = query.data?.pages.flatMap(p => p.products) ?? []
  const products = Array.from(new Map(raw.map(p => [p.id, p])).values()) as TikiProduct[]

  return { ...query, products }
}
