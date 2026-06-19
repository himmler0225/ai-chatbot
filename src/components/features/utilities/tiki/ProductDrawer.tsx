'use client'
import { Button, Card, Drawer, Flex, Image, Rate, Skeleton, Space, Tag, Typography } from 'antd'
import { CopyOutlined, LinkOutlined, QrcodeOutlined, ThunderboltFilled } from '@ant-design/icons'
import type { TikiProduct } from '@/types/tiki'
import { useTikiDetail, useTikiReviews } from '@/hooks/tiki/useTikiProduct'
import { useProductActions } from '@/hooks/tiki/useProductActions'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { PRIM } from '@/constants/brand'

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
  const { reviews, isPending: reviewLoading } = useTikiReviews(product?.id, product?.seller_product_id, open)

  const {
    copied, qrImg, qrOpen, setQrOpen,
    handleShorten, handleQR, handleAIReview,
    isShortLoading,
  } = useProductActions(
    product?.url ?? '',
    product?.short_name ?? product?.name ?? '',
    product?.price,
  )

  if (!product) return null

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        size="large"
        title={<Text strong style={{ fontSize: 14 }}>{product.short_name ?? product.name}</Text>}
      >
        <Skeleton loading={detailLoading} active>
          <Space orientation="vertical" size={16} className="w-full">
            <Image
              src={detail?.thumbnail ?? product.thumbnail}
              alt={product.name}
              preview={false}
              style={{ borderRadius: 8, background: '#fff', width: '100%' }}
            />

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
                {t('utilities.product.reviewCount', {
                  rating: product.rating?.toFixed(1) ?? 0,
                  count: product.review_count?.toLocaleString() ?? 0,
                })}
              </Text>
            </Flex>

            <Space wrap>
              {product.is_authentic && <Tag color="blue">{t('utilities.product.authentic')}</Tag>}
              {product.is_tikinow && <Tag color="green">{t('utilities.product.tikinow')}</Tag>}
              {product.brand && <Tag>{product.brand}</Tag>}
              {product.category && <Tag>{product.category}</Tag>}
            </Space>

            <Flex gap={8} wrap="wrap">
              <Button
                type="primary"
                icon={<ThunderboltFilled />}
                onClick={() => { handleAIReview(); onClose() }}
                style={{ background: PRIM, borderColor: PRIM, flex: 1, minWidth: 180 }}
              >
                {t('utilities.product.aiReviewBtn')}
              </Button>
              <Button
                icon={copied ? <CopyOutlined /> : <LinkOutlined />}
                loading={isShortLoading}
                onClick={handleShorten}
              >
                {t('utilities.product.shorten')}
              </Button>
              <Button icon={<QrcodeOutlined />} onClick={handleQR}>
                QR
              </Button>
            </Flex>

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

      <Drawer
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        size="default"
        title={t('utilities.product.qrTitle', { name: (product.short_name ?? product.name).slice(0, 28) })}
      >
        <Flex vertical align="center" gap={12} className="py-4">
          {!qrImg
            ? <Skeleton.Image active style={{ width: 220, height: 220 }} />
            : <Image src={qrImg} alt="QR" width={220} height={220} preview={false} style={{ borderRadius: 8 }} />}
          <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
            {t('utilities.product.qrHint')}
          </Text>
        </Flex>
      </Drawer>
    </>
  )
}
