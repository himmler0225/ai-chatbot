'use client'

import { Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import type { FptProduct } from '@/types/fpt'
import { ProductCardShell } from '@/components/features/utilities/shared/ProductCardShell'

const { Text } = Typography

interface Props {
  p: FptProduct
  onDetail: (p: FptProduct) => void
  compact?: boolean
}

export function ProductCard({ p, onDetail, compact = false }: Props) {
  const { t } = useTranslation()

  const metaRow = (
    <>
      {p.brand && (
        <Tag style={{ fontSize: 10, padding: '0 6px', margin: 0, borderRadius: 999 }}>
          {p.brand}
        </Tag>
      )}
      {typeof p.stock === 'number' && p.stock > 0 && (
        <Text type="secondary" style={{ fontSize: 11 }}>{t('utilities.fpt.inStock')}</Text>
      )}
    </>
  )

  return (
    <ProductCardShell
      name={p.short_name ?? p.name}
      thumbnail={p.thumbnail}
      price={p.price}
      originalPrice={p.original_price}
      discount={p.discount_percentage}
      productUrl={p.url}
      compact={compact}
      onDetail={() => onDetail(p)}
      metaRow={metaRow}
      i18nNs="utilities.fpt"
      reviewPromptKey="utilities.fpt.aiReviewPrompt"
      imageFallback="/eng.svg"
    />
  )
}
