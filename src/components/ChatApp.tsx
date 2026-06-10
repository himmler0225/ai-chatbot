'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Button, Flex, Input, Layout, Menu, Spin, Tooltip, Typography, theme } from 'antd'
import {
  DeleteOutlined, EditOutlined, MessageOutlined, MoonOutlined,
  PlusOutlined, RobotOutlined, SendOutlined, SunOutlined, ToolOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme, useLocale } from '@/src/context/theme'
import '@/src/i18n/config'
import { useChatMutation } from '@/src/hooks/useChat'
import { genId, toTitle }  from '@/src/lib/utils'
import type { ChatSession, HistoryMessage, Message } from '@/src/types/chat'
import MessageBubble from '@/src/components/chat/MessageBubble'
import EmptyState    from '@/src/components/chat/EmptyState'
import UtilitiesTab  from '@/src/components/UtilitiesTab'

type AppView = 'chat' | 'utilities'

const { Sider, Content } = Layout
const { Text } = Typography

export default function ChatApp() {
  const { isDark, toggleTheme } = useTheme()
  const { locale, toggleLocale } = useLocale()
  const { t } = useTranslation()
  const { token } = theme.useToken()

  const [sessions,  setSessions]  = useState<ChatSession[]>([])
  const [activeId,  setActiveId]  = useState<string | null>(null)
  const [messages,  setMessages]  = useState<Message[]>([])
  const [input,     setInput]     = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [view,      setView]      = useState<AppView>('chat')
  const bottomRef = useRef<HTMLDivElement>(null)

  const chatMutation = useChatMutation()

  useEffect(() => {
    const saved = localStorage.getItem('chatSessions')
    if (!saved) return
    const parsed = JSON.parse(saved) as ChatSession[]
    setSessions(parsed)
    if (parsed.length > 0) { setActiveId(parsed[0].id); setMessages(parsed[0].messages) }
  }, [])

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatMutation.isPending])

  const newChat = useCallback(() => {
    const s: ChatSession = { id: genId(), title: t('chat.newChat'), messages: [], createdAt: new Date(), updatedAt: new Date() }
    setSessions(prev => [s, ...prev])
    setActiveId(s.id)
    setMessages([])
  }, [])

  const selectSession = (id: string) => {
    const s = sessions.find(s => s.id === id)
    if (s) { setActiveId(id); setMessages(s.messages) }
  }

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (activeId === id) {
      const rest = sessions.filter(s => s.id !== id)
      if (rest.length) { setActiveId(rest[0].id); setMessages(rest[0].messages) }
      else { setActiveId(null); setMessages([]) }
    }
  }

  const sendMessage = useCallback(async () => {
    const content = input.trim()
    if (!content || chatMutation.isPending) return
    setInput('')

    let sid = activeId
    if (!sid) {
      const s: ChatSession = { id: genId(), title: toTitle(content), messages: [], createdAt: new Date(), updatedAt: new Date() }
      setSessions(prev => [s, ...prev])
      setActiveId(s.id)
      sid = s.id
    }

    const userMsg: Message = { id: genId(), role: 'user', content, timestamp: new Date() }
    const updated = [...messages, userMsg]
    setMessages(updated)

    const history: HistoryMessage[] = updated.slice(0, -1).map(m => ({ role: m.role, content: m.content }))
    chatMutation.mutate({ message: content, history }, {
      onSuccess: (data) => {
        const aiMsg: Message = {
          id: genId(), role: 'assistant', content: data.message ?? '',
          timestamp: new Date(), usedTools: data.usedTools,
          reviewSummary: data.reviewSummary ?? null, sources: data.sources ?? [],
        }
        const final = [...updated, aiMsg]
        setMessages(final)
        setSessions(prev => prev.map(s => s.id !== sid ? s : {
          ...s, messages: final,
          title: s.messages.length === 0 ? toTitle(content) : s.title,
          updatedAt: new Date(),
        }))
      },
    })
  }, [input, chatMutation, activeId, messages])

  const menuItems = sessions.map(s => ({
    key: s.id,
    label: (
      <Flex align="center" gap={4}>
        <EditOutlined className="text-xs opacity-50 shrink-0" />
        <span className="flex-1 truncate text-[13px]">{s.title}</span>
        <DeleteOutlined
          className="delete-icon text-xs opacity-0 shrink-0"
          onClick={e => { e.stopPropagation(); deleteSession(s.id) }}
        />
      </Flex>
    ),
  }))

  return (
    <Layout className="h-screen overflow-hidden">
      {/* Sidebar */}
      <Sider
        collapsible collapsed={collapsed} onCollapse={setCollapsed}
        width={260} collapsedWidth={0} trigger={null}
        className="h-screen overflow-hidden flex flex-col"
        style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
      >
        {/* New chat */}
        <div className="p-3" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <Button type="default" icon={<PlusOutlined />} block onClick={newChat}
            className="!text-left !justify-start !bg-transparent">
            {t('chat.newChat')}
          </Button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2">
          {sessions.length === 0
            ? <Text type="secondary" className="block text-center mt-3 mb-3 text-xs px-3">
                {t('chat.noChats')}
              </Text>
            : <Menu mode="inline" selectedKeys={activeId ? [activeId] : []} items={menuItems}
                onClick={({ key }) => selectSession(key)}
                className="!bg-transparent !border-none" />
          }
        </div>

        {/* Bottom nav */}
        <Flex className='mt-15' align="center" gap={4} style={{ padding: '8px 12px', borderTop: `1px solid ${token.colorBorderSecondary}` }}>
          <Button type={view === 'chat' ? 'primary' : 'text'} size="small"
            icon={<MessageOutlined />} onClick={() => setView('chat')} style={{ flex: 1 }}>
            {t('chat.tabChat')}
          </Button>
          <Button type={view === 'utilities' ? 'primary' : 'text'} size="small"
            icon={<ToolOutlined />} onClick={() => setView('utilities')} style={{ flex: 1 }}>
            {t('chat.tabUtilities')}
          </Button>
        </Flex>
      </Sider>

      {/* Main */}
      <Content style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Header */}
        <Flex align="center" gap={10} style={{
          padding: '12px 20px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          flexShrink: 0,
        }}>
          {collapsed && <Button type="text" icon={<PlusOutlined />} onClick={() => setCollapsed(false)} />}
          <Avatar size={28} icon={<RobotOutlined />} style={{ background: token.colorPrimary }} />
          <Text strong style={{ fontSize: 15 }}>SellMate AI</Text>
          <Flex gap={4} style={{ marginLeft: 'auto' }}>
            <Tooltip title={t('lang.toggle')}>
              <Button type="text" size="small" onClick={toggleLocale}>
                {locale === 'vi' ? '🇻🇳' : '🇺🇸'}
              </Button>
            </Tooltip>
            <Tooltip title={isDark ? t('theme.light') : t('theme.dark')}>
              <Button
                type="text" size="small"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
              />
            </Tooltip>
          </Flex>
        </Flex>

        {view === 'utilities' ? (
          <div style={{ flex: 1, overflowY: 'auto' }}><UtilitiesTab /></div>
        ) : (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {messages.length === 0
                  ? <EmptyState />
                  : messages.map(m => <MessageBubble key={m.id} msg={m} />)
                }
                {chatMutation.isPending && (
                  <Flex gap={12} align="flex-start" style={{ padding: '6px 0' }}>
                    <Avatar size={34} icon={<RobotOutlined />}
                      style={{ background: token.colorBgElevated, color: token.colorPrimary, border: `1px solid ${token.colorPrimary}`, flexShrink: 0 }} />
                    <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: token.colorBgElevated }}>
                      <Spin size="small" />
                    </div>
                  </Flex>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input */}
            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${token.colorBorderSecondary}`,
              background: token.colorBgContainer,
              flexShrink: 0,
            }}>
              <div style={{ maxWidth: 760, margin: '0 auto' }}>
                <Flex align="flex-end" gap={10} style={{
                  background: token.colorBgElevated,
                  borderRadius: 12, padding: '8px 12px',
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}>
                  <Input.TextArea
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    placeholder={t('chat.inputPlaceholder')}
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={{ flex: 1, background: 'transparent', border: 'none', resize: 'none', fontSize: 14, padding: '4px 0', boxShadow: 'none' }}
                    disabled={chatMutation.isPending}
                  />
                  <Button type="primary" icon={<SendOutlined />} onClick={sendMessage}
                    disabled={!input.trim() || chatMutation.isPending}
                    style={{ borderRadius: 8, flexShrink: 0 }} />
                </Flex>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', textAlign: 'center', marginTop: 8 }}>
                  {t('app.disclaimer')}
                </Text>
              </div>
            </div>
          </>
        )}
      </Content>

      <style>{`
        .ant-menu-item:hover .delete-icon { opacity: 1 !important; }
        textarea:focus { outline: none; box-shadow: none !important; }
      `}</style>
    </Layout>
  )
}
