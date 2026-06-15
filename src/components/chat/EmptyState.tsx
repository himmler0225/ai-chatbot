'use client'

import { Avatar, Flex, Typography, theme } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import { APP_NAME } from '@/src/constants/brand'

const { Title, Text } = Typography

export default function EmptyState() {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  return (
    <Flex vertical align="center" justify="center" gap={16} className="flex-1 py-12 px-4">
      <Avatar size={64} icon={<RobotOutlined />} style={{ background: token.colorPrimary, fontSize: 32 }} />
      <Title level={3} className="!m-0">{APP_NAME}</Title>
      <Text type="secondary" className="text-center max-w-sm">{t('app.tagline')}</Text>
    </Flex>
  )
}
