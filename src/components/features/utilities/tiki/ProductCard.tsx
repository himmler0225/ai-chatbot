'use client'

import { Flex, Tag, Typography } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import type { TikiProduct } from '@/types/tiki'
import { ProductCardShell } from '@/components/features/utilities/shared/ProductCardShell'

const { Text } = Typography

function fmtSold(n: number, t: ReturnType<typeof import('react-i18next').useTranslation>['t']) {
  return n >= 1000
    ? t('utilities.product.sold', { count: Math.round(n / 1000) })
    : t('utilities.product.soldFew', { count: n })
}

interface Props {
  p: TikiProduct
  onDetail: (p: TikiProduct) => void
  compact?: boolean
}

export function ProductCard({ p, onDetail, compact = false }: Props) {
  const { t } = useTranslation()

  const metaRow = (
    <>
      {!!p.rating && (
        <Flex align="center" gap={3}>
          <StarFilled style={{ color: '#faad14', fontSize: 11 }} />
          <Text type="secondary" style={{ fontSize: 11 }}>{p.rating.toFixed(1)}</Text>
        </Flex>
      )}
      {!!p.sold_count && (
        <Text type="secondary" style={{ fontSize: 11 }}>{fmtSold(p.sold_count, t)}</Text>
      )}
      {p.is_authentic && (
        <Tag color="blue" style={{ fontSize: 10, padding: '0 6px', margin: 0, borderRadius: 999 }}>
          {t('utilities.product.authentic')}
        </Tag>
      )}
      {p.is_tikinow && (
        <Tag color="green" style={{ fontSize: 10, padding: '0 6px', margin: 0, borderRadius: 999 }}>
          {t('utilities.product.tikinow')}
        </Tag>
      )}
    </>
  )

  return (
    <ProductCardShell
      name={p.short_name ?? p.name}
      thumbnail={p.thumbnail}
      price={p.price}
      originalPrice={p.original_price}
      discount={p.discount_rate}
      productUrl={p.url}
      compact={compact}
      onDetail={() => onDetail(p)}
      metaRow={metaRow}
      i18nNs="utilities.product"
      reviewPromptKey="utilities.product.aiReviewPrompt"
    />
  )
}
