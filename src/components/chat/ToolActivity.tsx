'use client'

import { Avatar, Flex, Typography, theme } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { TOOL_LABELS } from '@/src/constants/chat'
import '@/src/i18n/config'

const { Text } = Typography

interface Props {
  tool: string | null
  isStreaming: boolean
}

export default function ToolActivity({ tool, isStreaming }: Props) {
  const { token } = theme.useToken()
  const { i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en' : 'vi'

  if (!isStreaming) return null

  const info = tool ? TOOL_LABELS[tool] : null
  const icon = info?.icon ?? '🤔'
  const label = info?.[locale] ?? (locale === 'en' ? 'Thinking...' : 'Đang xử lý...')

  return (
    <Flex gap={12} align="flex-start" style={{ padding: '4px 0' }}>
      <Avatar
        size={34}
        icon={<RobotOutlined />}
        style={{
          flexShrink: 0,
          background: token.colorBgElevated,
          color: token.colorPrimary,
          border: `1px solid ${token.colorPrimary}`,
        }}
      />
      <div
        style={{
          padding: '10px 16px',
          borderRadius: '4px 16px 16px 16px',
          background: token.colorBgElevated,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 36,
        }}
      >
        <span style={{ fontSize: 15 }}>{icon}</span>
        <Text style={{ fontSize: 13, color: token.colorTextSecondary }}>{label}</Text>
        <Flex gap={3} align="center">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: token.colorPrimary,
                opacity: 0.6,
                display: 'inline-block',
                animation: `tool-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </Flex>
      </div>
      <style>{`
        @keyframes tool-bounce {
          0%, 80%, 100% { transform: translateY(0);  opacity: 0.35; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </Flex>
  )
}
