'use client'

import { Plus, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { ChatSession } from '@/lib/types'

interface SidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
}

export function Sidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border border-border hover:bg-secondary"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <button
            onClick={() => {
              onNewChat()
              setIsOpen(false)
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>Cuộc trò chuyện mới</span>
          </button>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center text-sidebar-foreground/50 text-sm py-8">
              Không có cuộc trò chuyện nào
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  activeSessionId === session.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
                onClick={() => {
                  onSelectSession(session.id)
                  setIsOpen(false)
                }}
              >
                <div className="flex items-start gap-2 truncate">
                  <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{session.title}</p>
                    <p className="text-xs opacity-50 truncate">
                      {new Date(session.updatedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(session.id)
                  }}
                  className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-sidebar-border transition-all"
                  aria-label="Xóa cuộc trò chuyện"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors text-sm">
            <Settings size={18} />
            <span>Cài đặt</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors text-sm">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  )
}
