'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { Empty, Flex, Typography } from 'antd'
import type { FptProduct } from '@/types/fpt'
import { ProductCard } from './ProductCard'
import { CardSkeleton } from '@/components/features/utilities/tiki/CardSkeleton'

const { Text } = Typography

interface Props {
  products: FptProduct[]
  loading: boolean
  error?: boolean
  onDetail: (p: FptProduct) => void
  onLoadMore?: () => void
  hasMore?: boolean
  loadingMore?: boolean
  compact?: boolean
  showEmpty?: boolean
}

const GRID_COMPACT: React.CSSProperties = { gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }
const GRID_DEFAULT: React.CSSProperties = { gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: 14 }

export function ProductGrid({
  products,
  loading,
  error,
  onDetail,
  onLoadMore,
  hasMore,
  loadingMore,
  compact = false,
  showEmpty = true,
}: Props) {
  const { t } = useTranslation()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onLoadMore || !hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !loadingMore) onLoadMore() },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onLoadMore, hasMore, loadingMore])

  const gridStyle = compact ? GRID_COMPACT : GRID_DEFAULT

  if (loading) {
    return (
      <div className="grid" style={gridStyle}>
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (showEmpty && products.length === 0) {
    return (
      <Flex justify="center" style={{ padding: compact ? '32px 0' : '48px 0' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={error ? t('utilities.fpt.loadError') : t('utilities.fpt.empty')}
        />
      </Flex>
    )
  }

  return (
    <>
      <div className="grid" style={gridStyle}>
        {products.map(p => (
          <ProductCard key={p.id} p={p} onDetail={onDetail} compact={compact} />
        ))}
        {loadingMore && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={`m${i}`} />)}
      </div>
      {hasMore && !loadingMore && <div ref={sentinelRef} style={{ height: 1 }} />}
      {!hasMore && products.length > 0 && (
        <Text type="secondary" style={{ fontSize: 12, display: 'block', textAlign: 'center', marginTop: 12 }}>
          {t('utilities.fpt.allShown', { count: products.length })}
        </Text>
      )}
    </>
  )
}
