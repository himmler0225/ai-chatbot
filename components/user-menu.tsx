'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
          <User size={14} className="text-accent" />
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
          <div className="p-3 space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-foreground hover:bg-secondary transition-colors">
              <User size={16} />
              <span>Hồ sơ</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-foreground hover:bg-secondary transition-colors">
              <Settings size={16} />
              <span>Cài đặt</span>
            </button>
            <div className="h-px bg-border my-1" />
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
