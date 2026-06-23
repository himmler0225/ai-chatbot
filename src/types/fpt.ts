export interface FptProduct {
  id: string
  code?: string
  sku?: string
  name: string
  short_name?: string
  display_name?: string
  slug?: string
  url: string
  thumbnail?: string
  price: number
  original_price?: number
  discount_percentage?: number
  brand?: string
  category?: string
  stock?: number
  promotions?: string[]
  status?: string
  product_status?: string
  installment?: unknown
}

export interface FptReview {
  id: string
  content: string
  rating?: number
  created_at?: string
  user?: {
    id?: string
    name?: string
    avatar?: string
  }
  images?: string[]
  likes?: number
  replies?: number
}

export interface FptProductDetail extends FptProduct {
  description?: string
  key_selling_points?: Array<{ title?: string; description?: string; icon?: string }>
  variants?: unknown[]
}
