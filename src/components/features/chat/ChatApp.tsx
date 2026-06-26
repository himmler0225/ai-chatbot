'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Grid, Layout, Drawer } from 'antd'
import { theme } from 'antd'
import '@/i18n/config'
import { useChatHistory } from '@/hooks/chat/useChatHistory'
import { useChatStore } from '@/stores/chatStore'
import { useSendMessage } from '@/hooks/chat/useSendMessage'
import { useUIStore } from '@/stores/uiStore'
import { ProductPanelContext } from '@/contexts/productPanel'
import type { ProductContext } from '@/types/chat'
import { ChatHeader } from '@/components/features/chat/ChatHeader'
import { ChatSidebar } from '@/components/features/chat/ChatSidebar'
import { ChatMessages } from '@/components/features/chat/ChatMessages'
import { ChatInput } from '@/components/features/chat/ChatInput'
import { ProductPanel, type ProductStore } from '@/components/features/utilities/ProductPanel'
import AuthModal from '@/components/common/AuthModal'
import {
  clearProductPanelParams,
  queryKeyForStore,
} from '@/components/features/utilities/shared/productSearchUrl'
import { CHAT_DARK } from '@/lib/theme'
import { useTheme } from '@/contexts/theme'

const { useBreakpoint } = Grid
const { Sider, Content } = Layout

const PRODUCT_PANEL_WIDTH = 400

export default function ChatApp() {
  const { token } = theme.useToken()
  const { isDark } = useTheme()
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
    openProductPanel,
  } = useUIStore()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sidebarOpen = isMobile ? drawerOpen : !collapsed

  const productStore: ProductStore = searchParams.get('store') === 'fpt' ? 'fpt' : 'tiki'

  const syncProductUrl = useCallback((open: boolean, q?: string | null, store: ProductStore = 'tiki') => {
    const params = new URLSearchParams(window.location.search)

    if (open) {
      params.set('tab', 'util')
      params.set('store', store)
      params.delete('util')
      if (q?.trim()) {
        params.set(queryKeyForStore(store), q.trim())
        params.delete('q')
      }
    } else {
      clearProductPanelParams(params)
    }

    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [pathname, router])

  const handleOpenProductPanel = useCallback((q?: string, store: ProductStore = 'tiki') => {
    openProductPanel()
    syncProductUrl(true, q, store)
    if (isMobile) setUI({ drawerOpen: false })
  }, [openProductPanel, syncProductUrl, isMobile, setUI])

  const handleCloseProductPanel = useCallback(() => {
    closeProductPanel()
    syncProductUrl(false)
  }, [closeProductPanel, syncProductUrl])

  const handleAIReview = useCallback((prompt: string, product?: ProductContext) => {
    closeProductPanel()
    syncProductUrl(false)
    void sendMessage(prompt, product)
  }, [closeProductPanel, syncProductUrl, sendMessage])

  const handleSearchOnTiki = useCallback((q: string) => {
    handleOpenProductPanel(q, 'tiki')
  }, [handleOpenProductPanel])

  const handleSearchOnFpt = useCallback((q: string) => {
    handleOpenProductPanel(q, 'fpt')
  }, [handleOpenProductPanel])

  const handleProductStoreChange = useCallback((store: ProductStore) => {
    const params = new URLSearchParams(window.location.search)
    params.set('tab', 'util')
    params.set('store', store)
    params.delete('util')
    params.delete('q')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router])

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setUI({ drawerOpen: !drawerOpen })
    } else {
      setUI({ collapsed: !collapsed })
    }
  }, [isMobile, drawerOpen, collapsed, setUI])

  const sidebarProps = {
    productPanelOpen,
    activeStore: productPanelOpen ? productStore : null,
    sidebarOpen,
    onToggleSidebar: toggleSidebar,
    onNewChat: newChat,
    onSelectSession: (id: string) => {
      void selectSession(id)
    },
    onDeleteSession: deleteSession,
    onOpenProductStore: (store: ProductStore) => {
      const q = searchParams.get(queryKeyForStore(store)) ?? undefined
      handleOpenProductPanel(q, store)
    },
  }

  useEffect(() => {
    useChatStore.setState({ isStreaming: false, activeTool: null })

    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'util') {
      setUI({ productPanelOpen: true })
    }
  }, [setUI])

  const chatColumn = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
      height: '100%',
      background: token.colorBgLayout,
    }}>
      <ChatHeader sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
      <ChatMessages
        onSuggestion={text => void sendMessage(text)}
        onRetry={text => void sendMessage(text)}
        onOpenProductPanel={(store = 'tiki') => handleOpenProductPanel(undefined, store)}
        isMobile={isMobile}
      />
      <ChatInput
        sendMessage={sendMessage}
        stopMessage={stopMessage}
        isMobile={isMobile}
        onSearchOnTiki={handleSearchOnTiki}
        onSearchOnFpt={handleSearchOnFpt}
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
              background: isDark ? CHAT_DARK.sidebar : '#ffffff',
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
              <ProductPanel
                onClose={handleCloseProductPanel}
                store={productStore}
                onStoreChange={handleProductStoreChange}
              />
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
            <ProductPanel
              onClose={handleCloseProductPanel}
              compact
              store={productStore}
              onStoreChange={handleProductStoreChange}
            />
          </Drawer>
        )}

        <AuthModal open={authModalOpen} defaultMode={authModalMode} onClose={closeAuthModal} />

        <style>{`
          .ant-menu-item:hover .delete-icon { opacity: 1 !important; }
          textarea:focus { outline: none; box-shadow: none !important; }
          .chat-input-textarea.ant-input-affix-wrapper,
          .chat-input-textarea textarea {
            padding: 0 !important;
            margin: 0 !important;
            line-height: 22px !important;
          }
          @media (max-width: 767px) {
            .chat-input-textarea textarea {
              font-size: 16px !important;
              line-height: 24px !important;
            }
            .chat-input-textarea textarea::placeholder {
              font-size: 16px;
              line-height: 24px;
            }
          }
          .chat-input-textarea textarea::placeholder {
            line-height: 22px;
          }
          .chat-input-shell .ant-input {
            min-height: 22px !important;
          }
        `}</style>
      </Layout>
    </ProductPanelContext.Provider>
  )
}
