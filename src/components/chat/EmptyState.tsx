'use client'

import { Avatar, Flex, Tag, Typography, theme } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '@/src/constants'
import '@/src/i18n/config'

const { Title, Text } = Typography

export default function EmptyState() {
  const { token } = theme.useToken()
  const { t }     = useTranslation()

  const suggestions = t('chat.suggestions', { returnObjects: true }) as string[]

  return (
    <Flex vertical align="center" justify="center" gap={16} className="flex-1 py-12 px-4">
      <Avatar size={64} icon={<RobotOutlined />} style={{ background: token.colorPrimary }} />

      <Title level={3} className="!m-0">{APP_NAME}</Title>

      <Text type="secondary" className="text-center max-w-sm">
        {t('app.tagline')}
      </Text>

      <Flex wrap="wrap" gap={8} justify="center" className="mt-2">
        {suggestions.map(s => (
          <Tag key={s} className="rounded-full cursor-pointer text-[13px] transition-opacity duration-150 hover:opacity-70 !py-1.5 !px-4">
            {s}
          </Tag>
        ))}
      </Flex>
    </Flex>
  )
}
