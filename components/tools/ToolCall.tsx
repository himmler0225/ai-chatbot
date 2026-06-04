'use client'

import { Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Tool } from '@/types'

interface ToolCallProps {
  tool: Tool
  isUser: boolean
}

export function ToolCall({ tool, isUser }: ToolCallProps) {
  return (
    <Badge variant={isUser ? 'secondary' : 'outline'} className="gap-1.5">
      <Zap size={12} />
      <span>{tool.name.replace(/_/g, ' ')}</span>
    </Badge>
  )
}
