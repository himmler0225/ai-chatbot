'use client'

import { Zap } from 'lucide-react'
import type { Tool } from '@/types'

interface ToolCallProps {
  tool: Tool
  isUser: boolean
}

export function ToolCall({ tool, isUser }: ToolCallProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
        isUser
          ? 'bg-accent-foreground/20 text-accent-foreground'
          : 'bg-accent/10 text-accent'
      }`}
    >
      <Zap size={12} />
      <span>{tool.name.replace(/_/g, ' ')}</span>
    </div>
  )
}
