'use client'

import { createContext, useContext } from 'react'
import type { ProductContext } from '@/types/chat'

interface ProductPanelContextValue {
  onAIReview: (prompt: string, product?: ProductContext) => void
}

export const ProductPanelContext = createContext<ProductPanelContextValue | null>(null)

export function useProductPanelContext() {
  return useContext(ProductPanelContext)
}
