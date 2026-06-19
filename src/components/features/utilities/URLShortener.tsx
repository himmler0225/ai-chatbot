'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  Divider,
  Flex,
  Input,
  message,
  Radio,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import { CopyOutlined, LinkOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useShortenMutation } from '@/hooks/common/useUtilities'
import type { ShortenResult } from '@/types/chat'
import '@/i18n/config'

const { Text, Paragraph } = Typography

export default function URLShortener() {
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [provider, setProvider] = useState<'tinyurl' | 'isgd'>('tinyurl')
  const [result, setResult] = useState<ShortenResult | null>(null)
  const [msg, ctx] = message.useMessage()

  const mutation = useShortenMutation()

  const submit = () => {
    if (!url.trim()) return
    mutation.mutate(
      { url, provider },
      {
        onSuccess: setResult,
        onError: e => msg.error(e.message),
      }
    )
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    msg.success(t('utilities.shortener.copied'))
  }

  return (
    <Flex vertical gap={12}>
      {ctx}
      <Input
        size="large"
        placeholder={t('utilities.shortener.placeholder')}
        prefix={<LinkOutlined style={{ color: token.colorTextQuaternary }} />}
        value={url}
        onChange={e => {
          setUrl(e.target.value)
          setResult(null)
        }}
        onPressEnter={submit}
        allowClear
      />

      <Flex align="center" gap={8}>
        <Text type="secondary" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
          {t('utilities.shortener.provider')}:
        </Text>
        <Radio.Group
          value={provider}
          onChange={e => setProvider(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          size="small"
          options={[
            { label: 'TinyURL', value: 'tinyurl' },
            { label: 'is.gd', value: 'isgd' },
          ]}
        />
        <div style={{ flex: 1 }} />
        <Button
          type="primary"
          icon={<LinkOutlined />}
          loading={mutation.isPending}
          disabled={!url.trim()}
          onClick={submit}
        >
          {t('utilities.shortener.button')}
        </Button>
      </Flex>

      {result && (
        <Card
          size="small"
          style={{
            borderRadius: 10,
            background: token.colorFillAlter,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Flex vertical gap={6}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {t('utilities.shortener.originalUrl')}
            </Text>
            <Paragraph
              ellipsis={{ rows: 1 }}
              style={{ margin: 0, fontSize: 12, color: token.colorTextSecondary }}
            >
              {result.original}
            </Paragraph>
            <Divider style={{ margin: '4px 0' }} />
            <Flex align="center" justify="space-between" gap={8}>
              <Flex align="center" gap={6} style={{ minWidth: 0 }}>
                <Text
                  strong
                  style={{ fontSize: 15, color: token.colorPrimary, wordBreak: 'break-all' }}
                >
                  {result.short}
                </Text>
                <Tag color="green" style={{ flexShrink: 0 }}>
                  {result.provider}
                </Tag>
              </Flex>
              <Space size={4} style={{ flexShrink: 0 }}>
                <Tooltip title={t('utilities.shortener.copy')}>
                  <Button icon={<CopyOutlined />} size="small" onClick={() => copy(result.short)} />
                </Tooltip>
                <Button
                  size="small"
                  type="link"
                  onClick={() => window.open(result.short, '_blank')}
                >
                  {t('utilities.shortener.open')}
                </Button>
              </Space>
            </Flex>
          </Flex>
        </Card>
      )}
    </Flex>
  )
}
