import { useQuery } from '@tanstack/react-query'
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
  const q = useQuery({ queryKey: ['tiki-flash-sale'],      queryFn: () => tikiApi.flashSale(40),  staleTime: 10 * 60_000 })
  return { ...q, products: toList(q.data) }
}

export function useTikiTopChoice() {
  const q = useQuery({ queryKey: ['tiki-top-choice'],      queryFn: () => tikiApi.topChoice(),     staleTime: 10 * 60_000 })
  return { ...q, products: toList(q.data) }
}

export function useTikiMaybeYouLike() {
  const q = useQuery({ queryKey: ['tiki-maybe-you-like'], queryFn: () => tikiApi.maybeYouLike(),  staleTime: 15 * 60_000 })
  return { ...q, products: toList(q.data) }
}
