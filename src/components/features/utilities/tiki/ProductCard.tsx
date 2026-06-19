'use client'
import { Badge, Button, Card, Drawer, Flex, Image, Skeleton, Tag, Tooltip, Typography } from 'antd'
import { CopyOutlined, LinkOutlined, QrcodeOutlined, StarFilled, ThunderboltFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import type { TikiProduct } from '@/types/tiki'
import { useProductActions } from '@/hooks/tiki/useProductActions'
import { PRIM } from '@/constants/brand'

const { Text } = Typography

function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
function fmtSold(n: number, t: ReturnType<typeof import('react-i18next').useTranslation>['t']) {
  return n >= 1000 ? t('utilities.product.sold', { count: Math.round(n / 1000) }) : t('utilities.product.soldFew', { count: n })
}

interface Props {
  p: TikiProduct
  onDetail: (p: TikiProduct) => void
  compact?: boolean
}

export function ProductCard({ p, onDetail, compact = false }: Props) {
  const { t } = useTranslation()
  const {
    copied, qrImg, qrOpen, setQrOpen,
    handleShorten, handleQR, handleAIReview,
    isShortLoading,
  } = useProductActions(p.url, p.short_name ?? p.name, p.price)

  const cover = (
    <Badge.Ribbon
      text={p.discount_rate ? `-${p.discount_rate}%` : ''}
      color="red"
      style={{ display: p.discount_rate ? undefined : 'none' }}
    >
      <div
        style={{ aspectRatio: '4/3', background: '#fff', cursor: 'pointer' }}
        onClick={() => onDetail(p)}
      >
        <Image
          src={p.thumbnail}
          alt={p.name}
          preview={false}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
        />
      </div>
    </Badge.Ribbon>
  )

  return (
    <>
      <Card
        hoverable
        size="small"
        cover={cover}
        style={{ height: '100%' }}
        styles={{ body: { padding: compact ? 8 : 10, display: 'flex', flexDirection: 'column', gap: 6 } }}
      >
        <div style={{ minHeight: 36, cursor: 'pointer' }} onClick={() => onDetail(p)}>
          <Text
            className="line-clamp-2 leading-snug"
            style={{ display: 'block', fontSize: compact ? 12 : 13, fontWeight: 500 }}
          >
            {p.short_name ?? p.name}
          </Text>
        </div>

        <Flex align="center" gap={6} wrap="wrap">
          <Text strong style={{ color: PRIM, fontSize: compact ? 14 : 15 }}>{fmtPrice(p.price)}</Text>
          {p.original_price && p.original_price > p.price && (
            <Text delete type="secondary" style={{ fontSize: 11 }}>{fmtPrice(p.original_price)}</Text>
          )}
        </Flex>

        <Flex align="flex-start" gap={4} wrap="wrap" style={{ minHeight: compact ? 36 : 44, alignContent: 'flex-start' }}>
          {!!p.rating && (
            <Flex align="center" gap={2}>
              <StarFilled style={{ color: '#faad14', fontSize: 11 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>{p.rating.toFixed(1)}</Text>
            </Flex>
          )}
          {!!p.sold_count && <Text type="secondary" style={{ fontSize: 11 }}>{fmtSold(p.sold_count, t)}</Text>}
          {p.is_authentic && <Tag color="blue" style={{ fontSize: 10, padding: '0 4px', margin: 0 }}>{t('utilities.product.authentic')}</Tag>}
          {p.is_tikinow && <Tag color="green" style={{ fontSize: 10, padding: '0 4px', margin: 0 }}>{t('utilities.product.tikinow')}</Tag>}
        </Flex>

        <Button
          type="primary"
          block
          size="small"
          icon={<ThunderboltFilled />}
          onClick={e => { e.stopPropagation(); handleAIReview() }}
          style={{ background: PRIM, borderColor: PRIM, marginTop: 2 }}
        >
          {t('utilities.product.aiReviewBtn')}
        </Button>

        <Flex gap={6}>
          <Tooltip title={t(copied ? 'utilities.product.copied' : 'utilities.product.shortenTooltip')}>
            <Button
              size="small"
              block
              loading={isShortLoading}
              icon={copied ? <CopyOutlined /> : <LinkOutlined />}
              onClick={e => { e.stopPropagation(); handleShorten() }}
            >
              {t('utilities.product.shorten')}
            </Button>
          </Tooltip>
          <Tooltip title={t('utilities.product.qrTooltip')}>
            <Button
              size="small"
              block
              icon={<QrcodeOutlined />}
              onClick={e => { e.stopPropagation(); handleQR() }}
            >
              QR
            </Button>
          </Tooltip>
        </Flex>
      </Card>

      <Drawer
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        size="default"
        title={t('utilities.product.qrTitle', { name: (p.short_name ?? p.name).slice(0, 28) })}
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
