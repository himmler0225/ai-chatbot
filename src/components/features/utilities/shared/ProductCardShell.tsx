'use client'

import type { ReactNode } from 'react'
import { Button, Drawer, Flex, Image, Skeleton, Tooltip, Typography, theme } from 'antd'
import { CopyOutlined, LinkOutlined, QrcodeOutlined, ThunderboltFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { useProductActions } from '@/hooks/tiki/useProductActions'
import { PRIM } from '@/constants/brand'
import { fmtPrice } from './productCard.utils'

const { Text } = Typography

interface Props {
  name: string
  thumbnail?: string
  price: number
  originalPrice?: number
  discount?: number
  productUrl: string
  compact?: boolean
  onDetail: () => void
  metaRow?: ReactNode
  i18nNs: 'utilities.product' | 'utilities.fpt'
  reviewPromptKey: string
  imageFallback?: string
}

export function ProductCardShell({
  name,
  thumbnail,
  price,
  originalPrice,
  discount,
  productUrl,
  compact = false,
  onDetail,
  metaRow,
  i18nNs,
  reviewPromptKey,
  imageFallback = '/eng.svg',
}: Props) {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const {
    copied, qrImg, qrOpen, setQrOpen,
    handleShorten, handleQR, handleAIReview,
    isShortLoading,
  } = useProductActions(productUrl, name, price, reviewPromptKey)

  const pad = compact ? 10 : 12

  return (
    <>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 14,
          border: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
        }}
        className="product-card-shell"
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.borderColor = token.colorPrimaryBorder
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.borderColor = token.colorBorderSecondary
        }}
      >
        <div
          onClick={onDetail}
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            background: token.colorFillQuaternary,
            cursor: 'pointer',
          }}
        >
          {!!discount && (
            <span
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 1,
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                boxShadow: '0 2px 6px rgba(255,77,79,0.35)',
              }}
            >
              -{discount}%
            </span>
          )}
          <Image
            src={thumbnail}
            alt={name}
            preview={false}
            fallback={imageFallback}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: compact ? 10 : 14,
            }}
          />
        </div>

        <Flex
          vertical
          gap={compact ? 8 : 10}
          style={{ padding: pad, flex: 1 }}
        >
          <div onClick={onDetail} style={{ cursor: 'pointer', minHeight: compact ? 34 : 40 }}>
            <Text
              className="line-clamp-2"
              style={{
                display: 'block',
                fontSize: compact ? 12 : 13,
                fontWeight: 600,
                lineHeight: 1.45,
                color: token.colorText,
              }}
            >
              {name}
            </Text>
          </div>

          <Flex align="baseline" gap={6} wrap="wrap">
            <Text strong style={{ color: PRIM, fontSize: compact ? 15 : 16, lineHeight: 1.2 }}>
              {fmtPrice(price)}
            </Text>
            {originalPrice != null && originalPrice > price && (
              <Text delete type="secondary" style={{ fontSize: 11 }}>
                {fmtPrice(originalPrice)}
              </Text>
            )}
          </Flex>

          {metaRow && (
            <Flex align="center" gap={4} wrap="wrap" style={{ minHeight: 22 }}>
              {metaRow}
            </Flex>
          )}

          <Flex vertical gap={6} style={{ marginTop: 'auto' }}>
            <Button
              type="primary"
              block
              size="small"
              icon={<ThunderboltFilled />}
              onClick={e => { e.stopPropagation(); handleAIReview() }}
              style={{
                background: PRIM,
                borderColor: PRIM,
                borderRadius: 8,
                height: compact ? 32 : 34,
                fontWeight: 600,
              }}
            >
              {t(`${i18nNs}.aiReviewBtn`)}
            </Button>

            <Flex gap={6}>
              <Tooltip title={t(copied ? `${i18nNs}.copied` : `${i18nNs}.shortenTooltip`)}>
                <Button
                  size="small"
                  block
                  loading={isShortLoading}
                  icon={copied ? <CopyOutlined /> : <LinkOutlined />}
                  onClick={e => { e.stopPropagation(); handleShorten() }}
                  style={{ borderRadius: 8, height: compact ? 30 : 32 }}
                >
                  {t(`${i18nNs}.shorten`)}
                </Button>
              </Tooltip>
              <Tooltip title={t(`${i18nNs}.qrTooltip`)}>
                <Button
                  size="small"
                  block
                  icon={<QrcodeOutlined />}
                  onClick={e => { e.stopPropagation(); handleQR() }}
                  style={{ borderRadius: 8, height: compact ? 30 : 32 }}
                >
                  QR
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
      </div>

      <Drawer
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        size="default"
        title={t(`${i18nNs}.qrTitle`, { name: name.slice(0, 28) })}
      >
        <Flex vertical align="center" gap={12} className="py-4">
          {!qrImg
            ? <Skeleton.Image active style={{ width: 220, height: 220 }} />
            : <Image src={qrImg} alt="QR" width={220} height={220} preview={false} style={{ borderRadius: 8 }} />}
          <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
            {t(`${i18nNs}.qrHint`)}
          </Text>
        </Flex>
      </Drawer>
    </>
  )
}
