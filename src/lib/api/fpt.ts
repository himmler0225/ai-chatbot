import { BaseApi } from '@/lib/api/client'
import type { ApiResponse } from '@/types/chat'
import type { FptProduct, FptProductDetail, FptReview } from '@/types/fpt'
import { FPT_REVIEWS_LIMIT, FPT_SEARCH_LIMIT } from '@/constants/api'

export type FptSortMethod = 'noi-bat' | 'gia-thap-dan' | 'gia-cao-dan' | 'tra-gop-0'
export type FptPriceRange = 'under_2m' | '2_5m' | '5_10m' | 'over_10m'

export interface FptSearchResult {
  query: string
  page: number
  limit: number
  total: number
  products: FptProduct[]
  filters?: {
    sort?: FptSortMethod | null
    price_range?: FptPriceRange | null
  }
}

export interface FptReviewResult {
  product_id?: string
  page?: number
  limit?: number
  total: number
  reviews: FptReview[]
}

function productId(p: FptProduct & { code?: string; sku?: string }) {
  return p.code ?? p.sku ?? p.id ?? ''
}

function normalizeProduct(p: FptProduct): FptProduct {
  return { ...p, id: productId(p) }
}

class FptApi extends BaseApi {
  constructor() {
    super('/api/fpt-shop')
  }

  async search(
    q: string,
    limit = FPT_SEARCH_LIMIT,
    page = 1,
    sortMethod?: FptSortMethod,
    priceRange?: FptPriceRange,
  ): Promise<FptSearchResult> {
    const qs = new URLSearchParams({
      q,
      limit: String(limit),
      page: String(page),
    })
    if (sortMethod) qs.set('sort_method', sortMethod)
    if (priceRange) qs.set('price_range', priceRange)

    const data = await this.get<ApiResponse<FptSearchResult>>(`?${qs}`)
    if (!data.success) throw new Error('Không thể tìm sản phẩm FPT Shop')
    const result = data.data
    return {
      ...result,
      products: (result.products ?? []).map(normalizeProduct),
    }
  }

  async detail(upc: string): Promise<FptProductDetail> {
    const data = await this.get<ApiResponse<{ upc: string; product: FptProductDetail }>>(
      `/detail/${encodeURIComponent(upc)}`,
    )
    if (!data.success || !data.data?.product) {
      throw new Error('Không thể tải chi tiết sản phẩm FPT Shop')
    }
    return normalizeProduct({ ...data.data.product, id: data.data.upc }) as FptProductDetail
  }

  async reviews(productId: string, page = 1, limit = FPT_REVIEWS_LIMIT): Promise<FptReviewResult> {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) })
    const data = await this.get<ApiResponse<FptReviewResult>>(
      `/${encodeURIComponent(productId)}/reviews?${qs}`,
    )
    if (!data.success) throw new Error('Không thể tải đánh giá FPT Shop')
    return data.data
  }
}

export const fptApi = new FptApi()
