'use client'

import { Avatar, Flex, Typography, theme } from 'antd'
import { RobotOutlined, UserOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import type { Message } from '@/src/types/chat'
import SourceChips   from './SourceChips'
import ReviewSummary from './ReviewSummary'

const { Text } = Typography

interface Props { msg: Message }

export default function MessageBubble({ msg }: Props) {
  const { token } = theme.useToken()
  const isUser = msg.role === 'user'

  return (
    <Flex
      gap={12} align="flex-start"
      className="py-1.5"
      style={{ flexDirection: isUser ? 'row-reverse' : 'row' }}
    >
      <Avatar
        size={34}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        className="shrink-0"
        style={{
          background: isUser ? token.colorPrimary : token.colorBgElevated,
          color:      isUser ? '#fff'             : token.colorPrimary,
          border:     isUser ? 'none'             : `1px solid ${token.colorPrimary}`,
        }}
      />

      <div className="max-w-[80%] min-w-0">
        {isUser ? (
          <div className="px-3.5 py-2.5 rounded-[16px_4px_16px_16px] text-sm leading-relaxed break-words text-white"
            style={{ background: token.colorPrimary }}>
            {msg.content}
          </div>
        ) : (
          <div className="px-3.5 py-2.5 rounded-[4px_16px_16px_16px] text-sm leading-relaxed break-words"
            style={{ background: token.colorBgElevated, color: token.colorText }}>
            <div className="message-content">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            {msg.reviewSummary  && <ReviewSummary markdown={msg.reviewSummary} />}
            {!!msg.sources?.length && <SourceChips sources={msg.sources} />}
          </div>
        )}

        <Text type="secondary" className="text-[11px] px-1.5">
          {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </div>
    </Flex>
  )
}
