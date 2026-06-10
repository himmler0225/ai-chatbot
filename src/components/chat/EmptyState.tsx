'use client'

import { Avatar, Flex, Typography, theme } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { CHAT_SUGGESTIONS } from '@/src/lib/utils'

const { Title, Text } = Typography

export default function EmptyState() {
  const { token } = theme.useToken()

  return (
    <Flex vertical align="center" justify="center" gap={16}
      style={{ flex: 1, padding: '48px 16px' }}>
      <Avatar size={64} icon={<RobotOutlined />}
        style={{ background: token.colorPrimary, fontSize: 32 }} />

      <Title level={3} style={{ margin: 0 }}>SellMate AI</Title>

      <Text type="secondary" style={{ textAlign: 'center', maxWidth: 360 }}>
        Trợ lý nghiên cứu thị trường YouTube & TikTok dành cho người bán hàng Việt Nam
      </Text>

      <Flex wrap="wrap" gap={8} justify="center" style={{ marginTop: 8 }}>
        {CHAT_SUGGESTIONS.map(s => (
          <div key={s} style={{
            padding: '8px 16px',
            borderRadius: 20,
            border:      `1px solid ${token.colorBorderSecondary}`,
            color:       token.colorTextSecondary,
            background:  token.colorFillTertiary,
            fontSize:    13,
            cursor:      'pointer',
            transition:  'opacity .15s',
          }}>
            {s}
          </div>
        ))}
      </Flex>
    </Flex>
  )
}
