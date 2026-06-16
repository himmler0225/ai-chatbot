'use client'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import { Flex, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { TikiProduct } from '@/src/types/tiki'
import { ProductCard } from './ProductCard'
import { CardSkeleton } from './CardSkeleton'

const { Text } = Typography
const GRID: React.CSSProperties = { gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }

interface Props {
  products: TikiProduct[]
  loading: boolean
  error?: boolean
  onDetail: (p: TikiProduct) => void
  onLoadMore?: () => void
  hasMore?: boolean
  loadingMore?: boolean
}

export function ProductGrid({ products, loading, error, onDetail, onLoadMore, hasMore, loadingMore }: Props) {
  const { t } = useTranslation()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onLoadMore || !hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !loadingMore) onLoadMore() }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [onLoadMore, hasMore, loadingMore])

  if (loading) return (
    <div className="grid gap-3" style={GRID}>
      {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )

  return (
    <>
      <div className="grid gap-3" style={GRID}>
        {products.map(p => <ProductCard key={p.id} p={p} onDetail={onDetail} />)}
        {loadingMore && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={`m${i}`} />)}
      </div>
      {hasMore && !loadingMore && <div ref={sentinelRef} style={{ height: 1 }} />}
      {!hasMore && products.length > 0 && (
        <Text type="secondary" style={{ fontSize: 12, display: 'block', textAlign: 'center', marginTop: 12 }}>
          {t('utilities.product.allShown', { count: products.length })}
        </Text>
      )}
    </>
  )
}
