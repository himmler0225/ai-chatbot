export interface TikiProduct {
  id: number
  name: string
  short_name?: string
  url: string
  thumbnail: string
  price: number
  original_price?: number
  discount_rate?: number
  rating?: number
  review_count?: number
  sold_count?: number
  brand?: string
  seller?: string
  is_authentic?: boolean
  is_tikinow?: boolean
  category?: string
  variant?: string[]
  seller_product_id?: number
}

export interface TikiReview {
  id: number
  title?: string
  content: string
  stars: number
  created_at: string | number
  customer_name?: string
  customer_avatar?: string
  attributes?: string[]
  images?: string[]
  purchased_at?: string
}

export interface TikiProductDetail extends TikiProduct {
  description?: string
  images?: string[]
  specifications?: Record<string, string>[]
  stock_quantity?: number
}
