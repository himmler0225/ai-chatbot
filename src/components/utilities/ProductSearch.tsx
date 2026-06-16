'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Flex, Input, Space, Tabs, Typography } from 'antd'
import { FireOutlined, HeartOutlined, SearchOutlined, StarFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import type { TikiProduct } from '@/src/types/tiki'
import { useTikiSearch }      from '@/src/hooks/tiki/useTikiSearch'
import { useTikiFlashSale, useTikiTopChoice, useTikiMaybeYouLike } from '@/src/hooks/tiki/useTikiProducts'
import { ProductGrid }   from '@/src/components/utilities/tiki/ProductGrid'
import { ProductDrawer } from '@/src/components/utilities/tiki/ProductDrawer'
import { PRIM } from '@/src/constants/brand'

const { Text } = Typography

export function ProductSearch() {
  const { t }        = useTranslation()
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const initialQ                = searchParams.get('q') ?? ''
  const [input,    setInput]    = useState(initialQ)
  const [submitted, setSubmit]  = useState(initialQ)
  const [detail,   setDetail]   = useState<TikiProduct | null>(null)

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setInput(q); setSubmit(q)
  }, [searchParams])

  const handleSearch = (q: string) => {
    if (!q.trim()) return
    const p = new URLSearchParams()
    p.set('tab', 'util'); p.set('q', q.trim())
    router.replace(`${pathname}?${p.toString()}`, { scroll: false })
  }

  const search    = useTikiSearch(submitted)
  const flashSale = useTikiFlashSale()
  const topChoice = useTikiTopChoice()
  const maybeLike = useTikiMaybeYouLike()

  const tabs = [
    {
      key: 'search',
      label: <span><SearchOutlined /> {t('utilities.product.tabSearch')}</span>,
      children: (
        <Space orientation="vertical" size={12} className="w-full">
          <Input.Search value={input} onChange={e => setInput(e.target.value)} onSearch={handleSearch}
            placeholder={t('utilities.product.placeholder')} size="large" loading={search.isFetching}
            enterButton={<><SearchOutlined /> {t('utilities.product.searchBtn')}</>} />
          {submitted && !search.isPending && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('utilities.product.resultCount', { count: search.products.length })}
            </Text>
          )}
          <ProductGrid
            products={search.products}
            loading={search.isPending && !!submitted}
            error={search.isError}
            onDetail={setDetail}
            onLoadMore={search.hasNextPage ? () => void search.fetchNextPage() : undefined}
            hasMore={search.hasNextPage}
            loadingMore={search.isFetchingNextPage}
          />
          {!submitted && (
            <Flex vertical align="center" justify="center" gap={10} style={{ minHeight: 200 }}>
              <SearchOutlined style={{ fontSize: 42, opacity: 0.2 }} />
              <Text type="secondary">{t('utilities.product.hint')}</Text>
            </Flex>
          )}
        </Space>
      ),
    },
    {
      key: 'sale',
      label: <span><FireOutlined style={{ color: '#ff4d4f' }} /> {t('utilities.product.tabFlashSale')}</span>,
      children: (
        <ProductGrid products={flashSale.products} loading={flashSale.isPending}
          error={flashSale.isError} onDetail={setDetail} />
      ),
    },
    {
      key: 'top',
      label: <span><StarFilled style={{ color: '#faad14' }} /> {t('utilities.product.tabTopDeals')}</span>,
      children: (
        <ProductGrid products={topChoice.products} loading={topChoice.isPending}
          error={topChoice.isError} onDetail={setDetail} />
      ),
    },
    {
      key: 'like',
      label: <span><HeartOutlined style={{ color: PRIM }} /> {t('utilities.product.tabLike')}</span>,
      children: (
        <ProductGrid products={maybeLike.products} loading={maybeLike.isPending}
          error={maybeLike.isError} onDetail={setDetail} />
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <Tabs items={tabs} defaultActiveKey="search" size="small" />
      <ProductDrawer product={detail} open={!!detail} onClose={() => setDetail(null)} />
    </div>
  )
}
