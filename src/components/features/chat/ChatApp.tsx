'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Grid, Layout, Drawer } from 'antd'
import { theme } from 'antd'
import '@/i18n/config'
import { useChatHistory } from '@/hooks/chat/useChatHistory'
import { useChatStore } from '@/stores/chatStore'
import { useSendMessage } from '@/hooks/chat/useSendMessage'
import { useUIStore } from '@/stores/uiStore'
import { ProductPanelContext } from '@/contexts/productPanel'
import { ChatHeader } from '@/components/features/chat/ChatHeader'
import { ChatSidebar } from '@/components/features/chat/ChatSidebar'
import { ChatMessages } from '@/components/features/chat/ChatMessages'
import { ChatInput } from '@/components/features/chat/ChatInput'
import { ProductPanel } from '@/components/features/utilities/ProductPanel'
import AuthModal from '@/components/common/AuthModal'

const { useBreakpoint } = Grid
const { Sider, Content } = Layout

const PRODUCT_PANEL_WIDTH = 400

export default function ChatApp() {
  const { token } = theme.useToken()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const { userRef, newChat, selectSession, deleteSession } = useChatHistory()
  const { sendMessage, stopMessage } = useSendMessage(userRef)

  const {
    collapsed,
    drawerOpen,
    productPanelOpen,
    set: setUI,
    authModalOpen,
    authModalMode,
    closeAuthModal,
    closeProductPanel,
    toggleProductPanel,
    openProductPanel,
  } = useUIStore()

  const router = useRouter()
  const pathname = usePathname()
  const sidebarOpen = isMobile ? drawerOpen : !collapsed

  const syncProductUrl = useCallback((open: boolean, q?: string | null) => {
    const params = new URLSearchParams(window.location.search)

    if (open) {
      params.set('tab', 'util')
      params.delete('util')
      if (q?.trim()) params.set('q', q.trim())
    } else {
      params.delete('tab')
      params.delete('util')
      params.delete('q')
    }

    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [pathname, router])

  const handleOpenProductPanel = useCallback((q?: string) => {
    openProductPanel()
    syncProductUrl(true, q)
    if (isMobile) setUI({ drawerOpen: false })
  }, [openProductPanel, syncProductUrl, isMobile, setUI])

  const handleCloseProductPanel = useCallback(() => {
    closeProductPanel()
    syncProductUrl(false)
  }, [closeProductPanel, syncProductUrl])

  const handleAIReview = useCallback((prompt: string) => {
    closeProductPanel()
    syncProductUrl(false)
    void sendMessage(prompt)
  }, [closeProductPanel, syncProductUrl, sendMessage])

  const handleSearchOnTiki = useCallback((q: string) => {
    handleOpenProductPanel(q)
  }, [handleOpenProductPanel])

  const sidebarProps = {
    productPanelOpen,
    onNewChat: newChat,
    onSelectSession: (id: string) => {
      void selectSession(id)
    },
    onDeleteSession: deleteSession,
    onToggleProductPanel: toggleProductPanel,
  }

  useEffect(() => {
    // Reset streaming state on mount in case it was stuck from a previous session
    useChatStore.setState({ isStreaming: false, activeTool: null })

    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'util') {
      setUI({ productPanelOpen: true })
    }
  }, [setUI])

  const toggleSidebar = () => {
    if (isMobile) {
      setUI({ drawerOpen: !drawerOpen })
    } else {
      setUI({ collapsed: !collapsed })
    }
  }

  const chatColumn = (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%' }}>
      <ChatHeader sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
      <ChatMessages
        onSuggestion={text => void sendMessage(text)}
        onOpenProductPanel={() => handleOpenProductPanel()}
        isMobile={isMobile}
      />
      <ChatInput
        sendMessage={sendMessage}
        stopMessage={stopMessage}
        isMobile={isMobile}
        onSearchOnTiki={handleSearchOnTiki}
      />
    </div>
  )

  return (
    <ProductPanelContext.Provider value={{ onAIReview: handleAIReview }}>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
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
            size={300}
            styles={{
              body: { padding: 0 },
              header: { display: 'none' },
            }}
          >
            <ChatSidebar {...sidebarProps} onClose={() => setUI({ drawerOpen: false })} />
          </Drawer>
        )}

        <Content style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          {chatColumn}

          {!isMobile && productPanelOpen && (
            <div
              style={{
                width: PRODUCT_PANEL_WIDTH,
                flexShrink: 0,
                borderLeft: `1px solid ${token.colorBorderSecondary}`,
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <ProductPanel onClose={handleCloseProductPanel} />
            </div>
          )}
        </Content>

        {isMobile && (
          <Drawer
            open={productPanelOpen}
            onClose={handleCloseProductPanel}
            placement="right"
            closeIcon={null}
            size={420}
            styles={{
              body: { padding: 0 },
              header: { display: 'none' },
            }}
          >
            <ProductPanel onClose={handleCloseProductPanel} compact />
          </Drawer>
        )}

        <AuthModal open={authModalOpen} defaultMode={authModalMode} onClose={closeAuthModal} />

        <style>{`
          .ant-menu-item:hover .delete-icon { opacity: 1 !important; }
          textarea:focus { outline: none; box-shadow: none !important; }
        `}</style>
      </Layout>
    </ProductPanelContext.Provider>
  )
}
