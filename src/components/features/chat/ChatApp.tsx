'use client'

import { useEffect, useState } from 'react'
import { Grid } from 'antd'
import '@/i18n/config'
import { useChatHistory } from '@/hooks/chat/useChatHistory'
import { useChatStore } from '@/stores/chatStore'
import { useSendMessage } from '@/hooks/chat/useSendMessage'
import { useUIStore } from '@/stores/uiStore'
import { ChatHeader } from '@/components/features/chat/ChatHeader'
import { ChatSidebar, ChatMobileDrawer } from '@/components/features/chat/ChatSidebar'
import { ChatMessages } from '@/components/features/chat/ChatMessages'
import { ChatInput } from '@/components/features/chat/ChatInput'
import AuthModal from '@/components/common/AuthModal'
import { CHAT_SHELL, useChatShell } from '@/constants/chat-shell-theme'

const { useBreakpoint } = Grid

export default function ChatApp() {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const c = useChatShell()

  const { userRef, newChat, selectSession, deleteSession } = useChatHistory()
  const { sendMessage, stopMessage } = useSendMessage(userRef)

  const { authModalOpen, authModalMode, closeAuthModal } = useUIStore()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sidebarProps = {
    onNewChat: newChat,
    onSelectSession: (id: string) => {
      void selectSession(id)
    },
    onDeleteSession: deleteSession,
  }

  useEffect(() => {
    useChatStore.setState({ isStreaming: false, activeTool: null })
  }, [])

  return (
    <div className="flex h-full min-h-0 w-full" style={{ background: c.mainBg }}>
      {!isMobile && <ChatSidebar {...sidebarProps} />}

      <ChatMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} {...sidebarProps} />

      <div
        className="flex flex-col flex-1 min-w-0 min-h-0 h-full overflow-hidden"
        style={{ background: c.mainBg }}
      >
        <ChatHeader onOpenMenu={() => setDrawerOpen(true)} />
        <ChatMessages
          onSuggestion={text => void sendMessage(text)}
          onRetry={text => void sendMessage(text)}
          isMobile={isMobile}
        />
        <ChatInput
          sendMessage={sendMessage}
          stopMessage={stopMessage}
          isMobile={isMobile}
        />
      </div>

      <AuthModal open={authModalOpen} defaultMode={authModalMode} onClose={closeAuthModal} />

      <style>{`
        textarea:focus { outline: none; box-shadow: none !important; }
        .chat-input-textarea.ant-input-affix-wrapper,
        .chat-input-textarea textarea {
          padding: 0 !important;
          margin: 0 !important;
          line-height: 24px !important;
        }
        @media (max-width: 767px) {
          .chat-input-textarea textarea { font-size: 16px !important; }
        }
        .chat-input-textarea textarea::placeholder { color: ${c.textSubtle}; }
      `}</style>
    </div>
  )
}
