'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, Drawer, Grid, Layout } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { theme } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import { useChatHistory } from '@/src/hooks/useChatHistory'
import { ChatSkeleton } from '@/src/components/chat/ChatSkeleton'
import { useSendMessage } from '@/src/hooks/useSendMessage'
import { useUIStore } from '@/src/store/uiStore'
import { ChatHeader } from '@/src/components/chat/ChatHeader'
import { ChatSidebar } from '@/src/components/chat/ChatSidebar'
import { ChatMessages } from '@/src/components/chat/ChatMessages'
import { ChatInput } from '@/src/components/chat/ChatInput'

import { ProductSearch } from '@/src/components/utilities/ProductSearch'
import AuthModal from '@/src/components/AuthModal'

const { useBreakpoint } = Grid
const { Sider, Content } = Layout

export default function ChatApp() {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const { authLoading, userRef, newChat, selectSession, deleteSession } = useChatHistory()
  const { sendMessage, stopMessage } = useSendMessage(userRef)

  const {
    collapsed,
    drawerOpen,
    view,
    utilityTab,
    set: setUI,
    authModalOpen,
    authModalMode,
    closeAuthModal,
  } = useUIStore()

  const sidebarProps = {
    onNewChat: newChat,
    onSelectSession: (id: string) => void selectSession(id),
    onDeleteSession: deleteSession,
  }

  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'util') {
      setUI({ view: 'utilities', utilityTab: 'product' })
    }
  }, [])

  useEffect(() => {
    if (view === 'utilities') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('tab') !== 'util') {
        params.set('tab', 'util')
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
    }
  }, [view])

  const goToChat = () => {
    setUI({ view: 'chat' })
    router.replace(pathname, { scroll: false })
  }

  if (authLoading) return <ChatSkeleton />

  return (
    <Layout className="h-screen overflow-hidden">
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={v => setUI({ collapsed: v })}
          width={260}
          collapsedWidth={0}
          trigger={null}
          style={{
            height: '100vh',
            overflow: 'hidden',
            borderRight: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <ChatSidebar {...sidebarProps} />
        </Sider>
      )}

      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setUI({ drawerOpen: false })}
          placement="left"
          closeIcon={null}
          styles={{ body: { padding: 0 }, header: { display: 'none' }, wrapper: { width: 260 } }}
        >
          <ChatSidebar {...sidebarProps} onClose={() => setUI({ drawerOpen: false })} />
        </Drawer>
      )}

      <Content
        style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
      >
        <ChatHeader
          isMobile={isMobile}
          collapsed={collapsed}
          onMenuClick={() => (isMobile ? setUI({ drawerOpen: true }) : setUI({ collapsed: false }))}
        />

        {view === 'utilities' ? (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '10px 16px',
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
                flexShrink: 0,
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<ArrowLeftOutlined />}
                onClick={goToChat}
              >
                {t('chat.tabChat')}
              </Button>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: isMobile ? '16px 12px' : '20px 24px',
                width: '100%',
              }}
            >
              <ProductSearch />
            </div>
          </div>
        ) : (
          <>
            <ChatMessages />
            <ChatInput sendMessage={sendMessage} stopMessage={stopMessage} isMobile={isMobile} />
          </>
        )}
      </Content>

      <AuthModal open={authModalOpen} defaultMode={authModalMode} onClose={closeAuthModal} />

      <style>{`
        .ant-menu-item:hover .delete-icon { opacity: 1 !important; }
        textarea:focus { outline: none; box-shadow: none !important; }
      `}</style>
    </Layout>
  )
}
