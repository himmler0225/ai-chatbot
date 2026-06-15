'use client'

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
import URLShortener from '@/src/components/utilities/URLShortener'
import QRGenerator from '@/src/components/utilities/QRGenerator'
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
                onClick={() => setUI({ view: 'chat' })}
              >
                {t('chat.tabChat')}
              </Button>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: isMobile ? '16px 12px' : '24px 20px',
                maxWidth: 620,
                margin: '0 auto',
                width: '100%',
              }}
            >
              {utilityTab === 'shorten' ? <URLShortener /> : <QRGenerator />}
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
