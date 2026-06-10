'use client'

import { useState } from 'react'
import {
  Button, Card, Divider, Flex, Image, Input, message,
  Radio, Select, Space, Spin, Switch, Tabs, Tag, Tooltip, Typography, theme,
} from 'antd'
import { CopyOutlined, DownloadOutlined, LinkOutlined, QrcodeOutlined } from '@ant-design/icons'
import { useShortenMutation, useQRMutation } from '@/src/hooks/useUtilities'
import type { ShortenResult, QRResult } from '@/src/types/chat'

const { Text, Paragraph } = Typography

// ── URL Shortener ─────────────────────────────────────────────────────────────

function URLShortener() {
  const { token } = theme.useToken()
  const [url, setUrl]           = useState('')
  const [provider, setProvider] = useState<'tinyurl' | 'isgd'>('tinyurl')
  const [result, setResult]     = useState<ShortenResult | null>(null)
  const [msg, ctx]              = message.useMessage()

  const mutation = useShortenMutation()

  const submit = () => {
    if (!url.trim()) return
    mutation.mutate({ url, provider }, {
      onSuccess: setResult,
      onError:   e => msg.error(e.message),
    })
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    msg.success('Đã sao chép!')
  }

  return (
    <Flex vertical gap={12}>
      {ctx}
      <Input
        size="large" placeholder="Nhập URL dài cần rút gọn..."
        prefix={<LinkOutlined style={{ color: token.colorTextQuaternary }} />}
        value={url} onChange={e => { setUrl(e.target.value); setResult(null) }}
        onPressEnter={submit} allowClear
      />

      <Flex align="center" gap={8}>
        <Text type="secondary" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>Provider:</Text>
        <Radio.Group value={provider} onChange={e => setProvider(e.target.value)}
          optionType="button" buttonStyle="solid" size="small"
          options={[{ label: 'TinyURL', value: 'tinyurl' }, { label: 'is.gd', value: 'isgd' }]}
        />
        <div style={{ flex: 1 }} />
        <Button type="primary" icon={<LinkOutlined />}
          loading={mutation.isPending} disabled={!url.trim()} onClick={submit}>
          Rút gọn
        </Button>
      </Flex>

      {result && (
        <Card size="small" style={{ borderRadius: 10, background: token.colorFillAlter, border: `1px solid ${token.colorBorderSecondary}` }}>
          <Flex vertical gap={6}>
            <Text type="secondary" style={{ fontSize: 11 }}>URL GỐC</Text>
            <Paragraph ellipsis={{ rows: 1 }} style={{ margin: 0, fontSize: 12, color: token.colorTextSecondary }}>
              {result.original}
            </Paragraph>
            <Divider style={{ margin: '4px 0' }} />
            <Flex align="center" justify="space-between" gap={8}>
              <Flex align="center" gap={6} style={{ minWidth: 0 }}>
                <Text strong style={{ fontSize: 15, color: token.colorPrimary, wordBreak: 'break-all' }}>
                  {result.short}
                </Text>
                <Tag color="green" style={{ flexShrink: 0 }}>{result.provider}</Tag>
              </Flex>
              <Space size={4} style={{ flexShrink: 0 }}>
                <Tooltip title="Sao chép">
                  <Button icon={<CopyOutlined />} size="small" onClick={() => copy(result.short)} />
                </Tooltip>
                <Button size="small" type="link" onClick={() => window.open(result.short, '_blank')}>
                  Mở ↗
                </Button>
              </Space>
            </Flex>
          </Flex>
        </Card>
      )}
    </Flex>
  )
}

// ── QR Generator ──────────────────────────────────────────────────────────────

function QRGenerator() {
  const { token } = theme.useToken()
  const [url, setUrl]       = useState('')
  const [qrTheme, setTheme] = useState<'default' | 'green' | 'dark'>('default')
  const [size, setSize]     = useState(10)
  const [rounded, setRound] = useState(true)
  const [result, setResult] = useState<QRResult | null>(null)
  const [msg, ctx]          = message.useMessage()

  const mutation = useQRMutation()

  const submit = () => {
    if (!url.trim()) return
    mutation.mutate({ url, theme: qrTheme, size, rounded }, {
      onSuccess: setResult,
      onError:   e => msg.error(e.message),
    })
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.image; a.download = 'qrcode.png'; a.click()
  }

  return (
    <Flex vertical gap={12}>
      {ctx}
      <Input
        size="large" placeholder="Nhập URL cần tạo QR..."
        prefix={<QrcodeOutlined style={{ color: token.colorTextQuaternary }} />}
        value={url} onChange={e => { setUrl(e.target.value); setResult(null) }}
        onPressEnter={submit} allowClear
      />

      <Flex align="center" gap={16} wrap="wrap">
        <Flex align="center" gap={6}>
          <Text type="secondary" style={{ fontSize: 13 }}>Màu:</Text>
          <Select value={qrTheme} onChange={setTheme} size="small" style={{ width: 115 }}
            options={[
              { label: '⬛ Mặc định', value: 'default' },
              { label: '🟢 Xanh lá',  value: 'green'   },
              { label: '⬜ Tối',       value: 'dark'    },
            ]}
          />
        </Flex>
        <Flex align="center" gap={6}>
          <Text type="secondary" style={{ fontSize: 13 }}>Kích thước:</Text>
          <Select value={size} onChange={setSize} size="small" style={{ width: 72 }}
            options={[5, 8, 10, 12, 15, 20].map(v => ({ label: `${v}×`, value: v }))}
          />
        </Flex>
        <Flex align="center" gap={6}>
          <Text type="secondary" style={{ fontSize: 13 }}>Bo tròn:</Text>
          <Switch size="small" checked={rounded} onChange={setRound} />
        </Flex>
        <div style={{ flex: 1 }} />
        <Button type="primary" icon={<QrcodeOutlined />}
          loading={mutation.isPending} disabled={!url.trim()} onClick={submit}>
          Tạo QR
        </Button>
      </Flex>

      {mutation.isPending && (
        <Flex justify="center" align="center" vertical gap={8} style={{ padding: '24px 0' }}>
          <Spin />
          <Text type="secondary" style={{ fontSize: 13 }}>Đang tạo mã QR...</Text>
        </Flex>
      )}

      {result && (
        <Flex vertical align="center" gap={12}>
          <div style={{
            padding: 16,
            background: qrTheme === 'dark' ? '#1a1a1a' : '#fff',
            borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            border: `1px solid ${token.colorBorderSecondary}`,
          }}>
            <Image src={result.image} alt="QR Code" preview={false} style={{ display: 'block', borderRadius: 6 }} />
          </div>
          <Button icon={<DownloadOutlined />} onClick={download}>Tải về PNG</Button>
          <Text type="secondary" style={{ fontSize: 12, maxWidth: 300, textAlign: 'center', wordBreak: 'break-all' }}>
            {result.url.length > 60 ? result.url.slice(0, 60) + '…' : result.url}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function UtilitiesTab() {
  return (
    <div style={{ padding: '24px 20px', maxWidth: 620, margin: '0 auto' }}>
      <Tabs size="large" defaultActiveKey="shorten" items={[
        {
          key:      'shorten',
          label:    <Space size={6}><LinkOutlined />Rút gọn URL</Space>,
          children: <Card style={{ borderRadius: 12, marginTop: 4 }}><URLShortener /></Card>,
        },
        {
          key:      'qr',
          label:    <Space size={6}><QrcodeOutlined />Tạo mã QR</Space>,
          children: <Card style={{ borderRadius: 12, marginTop: 4 }}><QRGenerator /></Card>,
        },
      ]} />
    </div>
  )
}
