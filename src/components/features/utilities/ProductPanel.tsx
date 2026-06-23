'use client'

import { useEffect, useState } from 'react'
import { Button, Flex, Typography, theme } from 'antd'
import { CloseOutlined, ShopOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { ProductSearch } from '@/components/features/utilities/ProductSearch'
import { FptProductSearch } from '@/components/features/utilities/fpt/FptProductSearch'

const { Text } = Typography

export type ProductStore = 'tiki' | 'fpt'

interface Props {
  onClose: () => void
  compact?: boolean
  store?: ProductStore
  onStoreChange?: (store: ProductStore) => void
}

const STORE_TABS: { key: ProductStore; label: string }[] = [
  { key: 'tiki', label: 'Tiki' },
  { key: 'fpt', label: 'FPT Shop' },
]

export function ProductPanel({
  onClose,
  compact = false,
  store = 'tiki',
  onStoreChange,
}: Props) {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const [activeStore, setActiveStore] = useState<ProductStore>(store)

  useEffect(() => {
    setActiveStore(store)
  }, [store])

  const handleStoreChange = (next: ProductStore) => {
    setActiveStore(next)
    onStoreChange?.(next)
  }

  const panelTitle = activeStore === 'fpt'
    ? t('utilities.fpt.panelTitle')
    : t('utilities.product.panelTitle')

  const panelHint = activeStore === 'fpt'
    ? t('utilities.fpt.panelHint')
    : t('utilities.product.panelHint')

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        background: token.colorBgContainer,
      }}
    >
      <Flex
        align="flex-start"
        justify="space-between"
        gap={8}
        style={{
          padding: compact ? '12px 14px' : '14px 16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Flex vertical gap={12} style={{ minWidth: 0, flex: 1 }}>
          <Flex align="flex-start" gap={10} style={{ minWidth: 0 }}>
            <Flex
              align="center"
              justify="center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: token.colorPrimaryBg,
                flexShrink: 0,
              }}
            >
              <ShopOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
            </Flex>
            <Flex vertical gap={3} style={{ minWidth: 0 }}>
              <Text strong style={{ fontSize: 14, lineHeight: 1.3 }}>
                {panelTitle}
              </Text>
              <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.45 }}>
                {panelHint}
              </Text>
            </Flex>
          </Flex>

          <Flex
            gap={4}
            style={{
              width: '100%',
              padding: 4,
              borderRadius: 12,
              background: token.colorFillQuaternary,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            {STORE_TABS.map(tab => {
              const active = activeStore === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleStoreChange(tab.key)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: compact ? '8px 10px' : '10px 12px',
                    border: 'none',
                    borderRadius: 9,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    color: active ? token.colorText : token.colorTextSecondary,
                    background: active ? token.colorBgElevated : 'transparent',
                    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </Flex>
        </Flex>

        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          aria-label={t('utilities.product.closePanel')}
          style={{ flexShrink: 0, marginTop: -2 }}
        />
      </Flex>

      <div style={{ flex: 1, overflowY: 'auto', padding: compact ? '12px 14px' : '14px 16px' }}>
        {activeStore === 'fpt'
          ? <FptProductSearch compact={compact} />
          : <ProductSearch compact={compact} />}
      </div>
    </Flex>
  )
}
