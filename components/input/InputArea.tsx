'use client'

import { Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface InputAreaProps {
  onSendMessage: (content: string) => void
  isLoading: boolean
}

export function InputArea({ onSendMessage, isLoading }: InputAreaProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const maxHeight = 120
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight)
      textareaRef.current.style.height = newHeight + 'px'
      
      // Show scrollbar only when content exceeds max-height
      if (textareaRef.current.scrollHeight > maxHeight) {
        textareaRef.current.classList.add('overflow')
      } else {
        textareaRef.current.classList.remove('overflow')
      }
    }
  }, [input])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.classList.remove('overflow')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="glass-dark glass-border p-4 md:p-6 border-t">
      <div className="max-w-4xl mx-auto flex gap-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi của bạn... (Shift + Enter để xuống dòng)"
          disabled={isLoading}
          rows={1}
          className="input-focus-glow flex-1 resize-none overflow-hidden min-h-[44px] max-h-[120px] bg-black/20 dark:bg-white/10"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="gradient-button text-white"
          size="icon"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  )
}
