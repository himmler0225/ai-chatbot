'use client'

import { useState } from 'react'
import { Button, Flex, Image, Input, message, Select, Spin, Switch, Typography, theme } from 'antd'
import { DownloadOutlined, QrcodeOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useQRMutation } from '@/src/hooks/useUtilities'
import type { QRResult } from '@/src/types/chat'
import '@/src/i18n/config'

const { Text } = Typography

export default function QRGenerator() {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [qrTheme, setTheme] = useState<'default' | 'green' | 'dark'>('default')
  const [size, setSize] = useState(10)
  const [rounded, setRound] = useState(true)
  const [result, setResult] = useState<QRResult | null>(null)
  const [msg, ctx] = message.useMessage()

  const mutation = useQRMutation()

  const submit = () => {
    if (!url.trim()) return
    mutation.mutate(
      { url, theme: qrTheme, size, rounded },
      {
        onSuccess: setResult,
        onError: e => msg.error(e.message),
      }
    )
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.image
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <Flex vertical gap={12}>
      {ctx}
      <Input
        size="large"
        placeholder={t('utilities.qr.placeholder')}
        prefix={<QrcodeOutlined style={{ color: token.colorTextQuaternary }} />}
        value={url}
        onChange={e => {
          setUrl(e.target.value)
          setResult(null)
        }}
        onPressEnter={submit}
        allowClear
      />

      <Flex align="center" gap={16} wrap="wrap">
        <Flex align="center" gap={6}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t('utilities.qr.color')}:
          </Text>
          <Select
            value={qrTheme}
            onChange={setTheme}
            size="small"
            style={{ width: 115 }}
            options={[
              { label: t('utilities.qr.colorDefault'), value: 'default' },
              { label: t('utilities.qr.colorGreen'), value: 'green' },
              { label: t('utilities.qr.colorDark'), value: 'dark' },
            ]}
          />
        </Flex>
        <Flex align="center" gap={6}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t('utilities.qr.size')}:
          </Text>
          <Select
            value={size}
            onChange={setSize}
            size="small"
            style={{ width: 72 }}
            options={[5, 8, 10, 12, 15, 20].map(v => ({ label: `${v}×`, value: v }))}
          />
        </Flex>
        <Flex align="center" gap={6}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t('utilities.qr.rounded')}:
          </Text>
          <Switch size="small" checked={rounded} onChange={setRound} />
        </Flex>
        <div style={{ flex: 1 }} />
        <Button
          type="primary"
          icon={<QrcodeOutlined />}
          loading={mutation.isPending}
          disabled={!url.trim()}
          onClick={submit}
        >
          {t('utilities.qr.button')}
        </Button>
      </Flex>

      {mutation.isPending && (
        <Flex justify="center" align="center" vertical gap={8} style={{ padding: '24px 0' }}>
          <Spin />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t('utilities.qr.generating')}
          </Text>
        </Flex>
      )}

      {result && (
        <Flex vertical align="center" gap={12}>
          <div
            style={{
              padding: 16,
              background: qrTheme === 'dark' ? '#1a1a1a' : '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Image
              src={result.image}
              alt="QR Code"
              preview={false}
              style={{ display: 'block', borderRadius: 6 }}
            />
          </div>
          <Button icon={<DownloadOutlined />} onClick={download}>
            {t('utilities.qr.download')}
          </Button>
          <Text
            type="secondary"
            style={{ fontSize: 12, maxWidth: 300, textAlign: 'center', wordBreak: 'break-all' }}
          >
            {result.url.length > 60 ? result.url.slice(0, 60) + '…' : result.url}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
