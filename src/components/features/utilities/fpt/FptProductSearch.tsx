'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Flex, Input, Select, Space, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import type { FptProduct } from '@/types/fpt'
import type { FptPriceRange, FptSortMethod } from '@/lib/api/fpt'
import { useFptSearch } from '@/hooks/fpt/useFptSearch'
import { ProductGrid } from '@/components/features/utilities/fpt/ProductGrid'
import { ProductDrawer } from '@/components/features/utilities/fpt/ProductDrawer'
import { FptShopLogo } from '@/components/common/ui/FptShopLogo'
import {
  applyStoreSearch,
  readStoreQuery,
} from '@/components/features/utilities/shared/productSearchUrl'

const { Text } = Typography

interface Props {
  compact?: boolean
}

export function FptProductSearch({ compact = false }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const controlSize = compact ? 'middle' : 'large'

  const initialQ = readStoreQuery(searchParams, 'fpt')
  const [input, setInput] = useState(initialQ)
  const [submitted, setSubmit] = useState(initialQ)
  const [detail, setDetail] = useState<FptProduct | null>(null)
  const [sortMethod, setSortMethod] = useState<FptSortMethod | undefined>(undefined)
  const [priceRange, setPriceRange] = useState<FptPriceRange | undefined>(undefined)

  useEffect(() => {
    if (searchParams.get('store') !== 'fpt') return
    const q = readStoreQuery(searchParams, 'fpt')
    setInput(q)
    setSubmit(q)
  }, [searchParams])

  const handleSearch = (q: string) => {
    if (!q.trim()) return
    const p = applyStoreSearch(new URLSearchParams(window.location.search), 'fpt', q.trim())
    router.replace(`${pathname}?${p.toString()}`, { scroll: false })
    setSubmit(q.trim())
  }

  const search = useFptSearch(submitted, sortMethod, priceRange)

  const selectStyle = { flex: 1, minWidth: 0, width: '100%' }

  return (
    <div className="flex flex-col h-full">
      <Space orientation="vertical" size={compact ? 10 : 12} className="w-full">
        <Input.Search
          value={input}
          onChange={e => setInput(e.target.value)}
          onSearch={handleSearch}
          placeholder={t('utilities.fpt.placeholder')}
          size={controlSize}
          loading={search.isFetching}
          enterButton={<><SearchOutlined /> {t('utilities.fpt.searchBtn')}</>}
        />

        <Flex gap={8} style={{ width: '100%' }}>
          <Select
            allowClear
            placeholder={t('utilities.fpt.sortPlaceholder')}
            style={selectStyle}
            size={controlSize}
            value={sortMethod}
            onChange={v => setSortMethod(v)}
            options={[
              { value: 'noi-bat', label: t('utilities.fpt.sortFeatured') },
              { value: 'gia-thap-dan', label: t('utilities.fpt.sortPriceAsc') },
              { value: 'gia-cao-dan', label: t('utilities.fpt.sortPriceDesc') },
              { value: 'tra-gop-0', label: t('utilities.fpt.sortInstallment') },
            ]}
          />
          <Select
            allowClear
            placeholder={t('utilities.fpt.pricePlaceholder')}
            style={selectStyle}
            size={controlSize}
            value={priceRange}
            onChange={v => setPriceRange(v)}
            options={[
              { value: 'under_2m', label: t('utilities.fpt.priceUnder2m') },
              { value: '2_5m', label: t('utilities.fpt.price2to5m') },
              { value: '5_10m', label: t('utilities.fpt.price5to10m') },
              { value: 'over_10m', label: t('utilities.fpt.priceOver10m') },
            ]}
          />
        </Flex>

        {submitted ? (
          <>
            {!search.isPending && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('utilities.fpt.resultCount', { count: search.products.length })}
              </Text>
            )}
            <ProductGrid
              products={search.products}
              loading={search.isPending}
              error={search.isError}
              onDetail={setDetail}
              onLoadMore={search.hasNextPage ? () => void search.fetchNextPage() : undefined}
              hasMore={search.hasNextPage}
              loadingMore={search.isFetchingNextPage}
              compact={compact}
            />
          </>
        ) : (
          <Flex vertical align="center" justify="center" gap={10} style={{ minHeight: compact ? 140 : 200 }}>
            <FptShopLogo size={compact ? 40 : 52} style={{ opacity: 0.85 }} />
            <Text type="secondary" style={{ textAlign: 'center', fontSize: compact ? 12 : 14, maxWidth: 280 }}>
              {t('utilities.fpt.hint')}
            </Text>
          </Flex>
        )}
      </Space>

      <ProductDrawer product={detail} open={!!detail} onClose={() => setDetail(null)} />
    </div>
  )
}
