'use client'

import { Plus, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { ChatSession } from '@/types'

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
      {/* Mobile menu trigger */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent 
              sessions={sessions} 
              activeSessionId={activeSessionId} 
              onNewChat={onNewChat} 
              onSelectSession={(id) => {
                onSelectSession(id)
                setIsOpen(false)
              }} 
              onDeleteSession={onDeleteSession} 
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen glass glass-border flex-col border-r">
        <SidebarContent 
          sessions={sessions} 
          activeSessionId={activeSessionId} 
          onNewChat={onNewChat} 
          onSelectSession={onSelectSession} 
          onDeleteSession={onDeleteSession} 
        />
      </aside>
    </>
  )
}

function SidebarContent({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SidebarProps) {
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onNewChat}
          className="w-full gap-2 gradient-button text-white"
        >
          <Plus size={18} />
          <span>Cuộc trò chuyện mới</span>
        </Button>
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
                className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-all card-hover ${
                  activeSessionId === session.id
                    ? 'sidebar-active bg-orange-500/10 dark:bg-orange-500/5'
                    : 'text-sidebar-foreground'
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
      <div className="p-3 border-t border-sidebar-border space-y-2 mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground">
          <Settings size={18} />
          <span>Cài đặt</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground">
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </>
  )
}
