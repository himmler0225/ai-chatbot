'use client'

import { createContext, useContext } from 'react'

interface ProductPanelContextValue {
  onAIReview: (prompt: string) => void
}

export const ProductPanelContext = createContext<ProductPanelContextValue | null>(null)

export function useProductPanelContext() {
  return useContext(ProductPanelContext)
}
