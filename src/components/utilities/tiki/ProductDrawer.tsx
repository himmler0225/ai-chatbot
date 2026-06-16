'use client'
import { Card, Drawer, Flex, Image, Rate, Skeleton, Space, Tag, Typography } from 'antd'
import type { TikiProduct } from '@/src/types/tiki'
import { useTikiDetail, useTikiReviews } from '@/src/hooks/tiki/useTikiProduct'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import { PRIM } from '@/src/constants/brand'

const { Text, Title, Link } = Typography

function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

interface Props {
  product: TikiProduct | null
  open: boolean
  onClose: () => void
}

export function ProductDrawer({ product, open, onClose }: Props) {
  const { t } = useTranslation()
  const { data: detail, isPending: detailLoading } = useTikiDetail(product?.id, open)
  const { reviews, isPending: reviewLoading }       = useTikiReviews(product?.id, product?.seller_product_id, open)

  if (!product) return null

  return (
    <Drawer open={open} onClose={onClose} size="large"
      title={<Text strong style={{ fontSize: 14 }}>{product.short_name ?? product.name}</Text>}>
      <Skeleton loading={detailLoading} active>
        <Space orientation="vertical" size={16} className="w-full">
          <Image src={detail?.thumbnail ?? product.thumbnail} alt={product.name} preview={false}
            style={{ borderRadius: 8, background: '#fff', width: '100%' }} />

          <Flex align="center" gap={10}>
            <Title level={4} style={{ color: PRIM, margin: 0 }}>{fmtPrice(product.price)}</Title>
            {product.original_price && product.original_price > product.price && (
              <Text delete type="secondary">{fmtPrice(product.original_price)}</Text>
            )}
            {!!product.discount_rate && <Tag color="red">-{product.discount_rate}%</Tag>}
          </Flex>

          <Flex align="center" gap={12}>
            <Rate disabled defaultValue={product.rating ?? 0} style={{ fontSize: 14 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {t('utilities.product.reviewCount', { rating: product.rating?.toFixed(1) ?? 0, count: product.review_count?.toLocaleString() ?? 0 })}
            </Text>
          </Flex>

          <Space wrap>
            {product.is_authentic && <Tag color="blue">{t('utilities.product.authentic')}</Tag>}
            {product.is_tikinow   && <Tag color="green">{t('utilities.product.tikinow')}</Tag>}
            {product.brand        && <Tag>{product.brand}</Tag>}
            {product.category     && <Tag>{product.category}</Tag>}
          </Space>

          <div>
            <Text strong>{t('utilities.product.reviewsTitle')}</Text>
            <Skeleton loading={reviewLoading} active paragraph={{ rows: 3 }}>
              <Space orientation="vertical" size={8} className="w-full" style={{ marginTop: 8 }}>
                {reviews.length === 0
                  ? <Text type="secondary">{t('utilities.product.noReviews')}</Text>
                  : reviews.slice(0, 8).map((r, i) => (
                    <Card key={r.id ?? i} size="small">
                      <Rate disabled defaultValue={r.stars} style={{ fontSize: 11 }} />
                      <Text style={{ fontSize: 13, display: 'block', marginTop: 4 }}>{r.content}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>{r.customer_name}</Text>
                    </Card>
                  ))}
              </Space>
            </Skeleton>
          </div>

          <Link href={product.url} target="_blank">{t('utilities.product.viewOnTiki')}</Link>
        </Space>
      </Skeleton>
    </Drawer>
  )
}
