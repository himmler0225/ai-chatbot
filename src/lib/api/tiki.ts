import { BaseApi } from '@/lib/api/client'
import type { ApiResponse } from '@/types/chat'
import type { TikiProduct, TikiProductDetail, TikiReview } from '@/types/tiki'
import { TIKI_REVIEWS_LIMIT, TIKI_SEARCH_LIMIT } from '@/constants/api'

export interface TikiSearchResult {
  query: string
  page: number
  limit: number
  paging: { total: number; per_page: number; current_page: number; last_page: number }
  products: TikiProduct[]
}

export interface TikiListResult {
  products: TikiProduct[]
  total?: number
}

export interface TikiReviewResult {
  reviews: TikiReview[]
  total?: number
  page?: number
}

class TikiApi extends BaseApi {
  constructor() {
    super('/api/tiki')
  }

  async search(q: string, limit = TIKI_SEARCH_LIMIT, sort = 'top_seller', page = 1): Promise<TikiSearchResult> {
    const data = await this.get<ApiResponse<TikiSearchResult>>(
      `?q=${encodeURIComponent(q)}&limit=${limit}&sort=${sort}&page=${page}`,
    )
    if (!data.success) throw new Error('Không thể tìm sản phẩm')
    return data.data
  }

  async flashSale(limit = 20): Promise<TikiProduct[]> {
    const data = await this.get<ApiResponse<TikiListResult>>(`/sales?limit=${limit}`)
    if (!data.success) throw new Error('Không thể tải Flash Sale')
    return data.data?.products ?? (data.data as unknown as TikiProduct[]) ?? []
  }

  async topChoice(): Promise<TikiProduct[]> {
    const data = await this.get<ApiResponse<TikiListResult>>('/top-choice')
    if (!data.success) throw new Error('Không thể tải Top Deals')
    return data.data?.products ?? (data.data as unknown as TikiProduct[]) ?? []
  }

  async maybeYouLike(): Promise<TikiProduct[]> {
    const data = await this.get<ApiResponse<TikiListResult>>('/maybe-you-like')
    if (!data.success) throw new Error('Không thể tải gợi ý')
    return data.data?.products ?? (data.data as unknown as TikiProduct[]) ?? []
  }

  async detail(productId: number): Promise<TikiProductDetail> {
    const data = await this.get<ApiResponse<TikiProductDetail>>(`/${productId}`)
    if (!data.success) throw new Error('Không thể tải chi tiết sản phẩm')
    return data.data
  }

  async reviews(productId: number, spid?: number, page = 1, limit = TIKI_REVIEWS_LIMIT): Promise<TikiReviewResult> {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (spid) qs.set('spid', String(spid))
    const data = await this.get<ApiResponse<TikiReviewResult>>(`/${productId}/reviews?${qs}`)
    if (!data.success) throw new Error('Không thể tải đánh giá')
    return data.data
  }
}

export const tikiApi = new TikiApi()
