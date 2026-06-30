'use client'

import { useMemo } from 'react'
import {
  Clapperboard,
  FileText,
  GitCompare,
  Sparkles,
} from 'lucide-react'
import { Grid, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/stores/chatStore'
import { useChatShell } from '@/constants/chat-shell-theme'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const CARD_ICONS = [Clapperboard, GitCompare, FileText, Sparkles] as const

const FALLBACK_CARDS = [
  { category: 'Phân tích phim', prompt: 'Dune Part Two có đáng xem không theo review cộng đồng?' },
  { category: 'So sánh dữ liệu', prompt: 'So sánh Oppenheimer và Barbie — người xem nói gì?' },
  { category: 'Tóm tắt review', prompt: 'Tóm tắt đánh giá chung về Squid Game.' },
  { category: 'Chi tiết tập phim', prompt: 'Tập 5 Squid Game có gì đặc biệt?' },
] as const

interface Props {
  onSuggestion?: (text: string) => void
}

type SuggestionCard = {
  category: string
  prompt: string
}

function isCardArray(raw: unknown): raw is SuggestionCard[] {
  return (
    Array.isArray(raw)
    && raw.length > 0
    && typeof raw[0] === 'object'
    && raw[0] !== null
    && 'prompt' in raw[0]
  )
}

export default function EmptyState({ onSuggestion }: Props) {
  const { t, i18n } = useTranslation()
  const c = useChatShell()
  const isStreaming = useChatStore(s => s.isStreaming)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const cards = useMemo(() => {
    const raw = t('chat.emptyState.cards', { returnObjects: true })
    if (isCardArray(raw)) return raw
    const fromVi = i18n.getResource(i18n.language, 'translation', 'chat.emptyState.cards')
    if (isCardArray(fromVi)) return fromVi
    return [...FALLBACK_CARDS]
  }, [t, i18n, i18n.language])

  return (
    <div
      className="flex flex-col items-center w-full flex-1"
      style={{
        padding: isMobile ? '32px 20px 24px' : '48px 32px 32px',
        maxWidth: c.contentMax,
        margin: '0 auto',
      }}
    >
      <div
        className="flex items-center justify-center mb-6"
        style={{ width: 56, height: 56, borderRadius: c.radius, background: c.accentSoft, color: c.accent }}
      >
        <Sparkles size={28} strokeWidth={1.75} />
      </div>

      <Title
        level={2}
        className="!m-0 !mb-3 text-center !font-bold"
        style={{ color: c.text, fontSize: isMobile ? 26 : 32 }}
      >
        {t('chat.emptyState.title')}
      </Title>

      <Text
        className="text-center block mb-10 max-w-lg"
        style={{ color: c.textMuted, fontSize: isMobile ? 15 : 16, lineHeight: 1.6 }}
      >
        {t('chat.emptyState.subtitle')}
      </Text>

      <div
        className="grid w-full gap-4"
        style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', maxWidth: c.contentMax }}
      >
        {cards.map((card, i) => {
          const Icon = CARD_ICONS[i % CARD_ICONS.length]
          return (
            <button
              key={`${card.category}-${i}`}
              type="button"
              disabled={isStreaming || !onSuggestion}
              onClick={() => onSuggestion?.(card.prompt)}
              className="text-left p-5 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.border}`,
                borderRadius: c.radius,
                cursor: isStreaming ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => {
                if (!isStreaming) e.currentTarget.style.borderColor = c.accent
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = c.border
              }}
            >
              <div
                className="flex items-center justify-center mb-4"
                style={{ width: 40, height: 40, borderRadius: c.radiusSm, background: c.accentSoft, color: c.accent }}
              >
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <Text strong className="block mb-2" style={{ color: c.text, fontSize: 14 }}>
                {card.category}
              </Text>
              <Text style={{ color: c.textMuted, fontSize: 13, lineHeight: 1.55 }}>
                {card.prompt}
              </Text>
            </button>
          )
        })}
      </div>
    </div>
  )
}
