'use client'

import { Typography, theme } from 'antd'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'

const { Text } = Typography

interface Props {
  markdown: string
}

export default function ReviewSummary({ markdown }: Props) {
  const { token } = theme.useToken()
  const { t } = useTranslation()

  return (
    <div
      className="mt-3 px-3.5 py-2.5 rounded-lg"
      style={{
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Text type="secondary" className="block text-xs mb-1.5">
        {t('chat.reviewSummary')}
      </Text>
      <div className="message-content text-sm">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  )
}
