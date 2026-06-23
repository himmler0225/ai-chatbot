'use client'

import { SearchOutlined } from '@ant-design/icons'
import { Flex, Typography, theme } from 'antd'

const { Text } = Typography

type Props = {
  message: string
  compact?: boolean
}

export function ProductSearchHint({ message, compact = false }: Props) {
  const { token } = theme.useToken()

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={12}
      style={{
        minHeight: compact ? 140 : 200,
        padding: compact ? '20px 16px' : '28px 20px',
        borderRadius: 16,
        border: `1px dashed ${token.colorBorderSecondary}`,
        background: token.colorFillQuaternary,
      }}
    >
      <SearchOutlined
        style={{
          fontSize: compact ? 28 : 36,
          color: token.colorPrimary,
          opacity: 0.45,
        }}
      />
      <Text
        type="secondary"
        style={{
          textAlign: 'center',
          fontSize: compact ? 12 : 13,
          maxWidth: 300,
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {message}
      </Text>
    </Flex>
  )
}
