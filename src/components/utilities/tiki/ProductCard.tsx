'use client'
import { Badge, Button, Card, Drawer, Flex, Image, Skeleton, Tag, Tooltip, Typography } from 'antd'
import { CopyOutlined, LinkOutlined, QrcodeOutlined, StarFilled, ThunderboltFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import type { TikiProduct } from '@/src/types/tiki'
import { useProductActions } from '@/src/hooks/tiki/useProductActions'
import { PRIM } from '@/src/constants/brand'

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
}

export function ProductCard({ p, onDetail }: Props) {
  const { t } = useTranslation()
  const {
    shortUrl, copied, qrImg, qrOpen, setQrOpen,
    handleShorten, handleQR, handleAIReview,
    isShortLoading,
  } = useProductActions(p.url, p.short_name ?? p.name)

  const cover = (
    <Badge.Ribbon text={p.discount_rate ? `-${p.discount_rate}%` : ''} color="red"
      style={{ display: p.discount_rate ? undefined : 'none' }}>
      <div className="relative group overflow-hidden"
        style={{ aspectRatio: '4/3', background: '#fff', cursor: 'pointer' }}
        onClick={() => onDetail(p)}>
        <Image src={p.thumbnail} alt={p.name} preview={false}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />

        {/* Gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.55))' }} />

        {/* Action icons */}
        <Flex gap={6} className="absolute bottom-2 left-0 right-0 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={e => e.stopPropagation()}>
          <Tooltip title={t('utilities.product.aiReview')}>
            <Button size="small" type="primary" shape="circle" icon={<ThunderboltFilled />}
              onClick={handleAIReview}
              style={{ background: PRIM, borderColor: PRIM, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
          </Tooltip>
          <Tooltip title={t(copied ? 'utilities.product.copied' : 'utilities.product.shortenTooltip')}>
            <Button size="small" shape="circle" loading={isShortLoading}
              icon={copied ? <CopyOutlined /> : <LinkOutlined />}
              onClick={handleShorten}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
          </Tooltip>
          <Tooltip title={t('utilities.product.qrTooltip')}>
            <Button size="small" shape="circle" icon={<QrcodeOutlined />}
              onClick={handleQR}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
          </Tooltip>
        </Flex>
      </div>
    </Badge.Ribbon>
  )

  return (
    <>
      <Card hoverable size="small" cover={cover}
        style={{ height: '100%' }}
        styles={{ body: { padding: 10, display: 'flex', flexDirection: 'column' } }}>
        <div style={{ minHeight: 36, cursor: 'pointer', marginBottom: 6 }} onClick={() => onDetail(p)}>
          <Text className="text-[13px] font-medium line-clamp-2 leading-snug" style={{ display: 'block' }}>
            {p.short_name ?? p.name}
          </Text>
        </div>

        <Flex align="center" gap={6} wrap="wrap" style={{ minHeight: 22, marginBottom: 4 }}>
          <Text strong style={{ color: PRIM, fontSize: 15 }}>{fmtPrice(p.price)}</Text>
          {p.original_price && p.original_price > p.price && (
            <Text delete type="secondary" style={{ fontSize: 11 }}>{fmtPrice(p.original_price)}</Text>
          )}
        </Flex>

        <Flex align="flex-start" gap={4} wrap="wrap" style={{ minHeight: 44, alignContent: 'flex-start' }}>
          {!!p.rating && (
            <Flex align="center" gap={2}>
              <StarFilled style={{ color: '#faad14', fontSize: 11 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>{p.rating.toFixed(1)}</Text>
            </Flex>
          )}
          {!!p.sold_count && <Text type="secondary" style={{ fontSize: 11 }}>{fmtSold(p.sold_count, t)}</Text>}
          {p.is_authentic && <Tag color="blue"  style={{ fontSize: 10, padding: '0 4px', margin: 0 }}>{t('utilities.product.authentic')}</Tag>}
          {p.is_tikinow   && <Tag color="green" style={{ fontSize: 10, padding: '0 4px', margin: 0 }}>{t('utilities.product.tikinow')}</Tag>}
        </Flex>
      </Card>

      <Drawer open={qrOpen} onClose={() => setQrOpen(false)} size="default"
        title={t('utilities.product.qrTitle', { name: (p.short_name ?? p.name).slice(0, 28) })}>
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
