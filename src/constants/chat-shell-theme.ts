'use client'

import { useTheme } from '@/contexts/theme'

const SHARED = {
  frameBg: '#eef2f6',
  sidebarBg: '#0b1220',
  sidebarBorder: 'rgba(255,255,255,0.06)',
  sidebarText: '#94a3b8',
  sidebarTextActive: '#f8fafc',
  sidebarHover: 'rgba(255,255,255,0.04)',
  sidebarActive: 'rgba(37,99,235,0.14)',
  accent: '#2563eb',
  accentHover: '#1d4ed8',
  accentSoft: 'rgba(37,99,235,0.08)',
  panelShadow: '0 1px 3px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.04)',
  framePadding: 0,
  sidebarWidth: 260,
  sidebarPad: 16,
  contentMax: 720,
  radius: 12,
  radiusSm: 8,
  radiusBubble: 12,
  radiusBubbleTail: 4,
} as const

const LIGHT = {
  ...SHARED,
  mainBg: '#ffffff',
  mainMuted: '#f8fafc',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  cardBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  assistantBubbleBg: '#f8fafc',
} as const

const DARK = {
  ...SHARED,
  mainBg: '#0f172a',
  mainMuted: '#1e293b',
  border: '#334155',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textSubtle: '#64748b',
  cardBg: '#1e293b',
  inputBg: '#1e293b',
  inputBorder: '#334155',
  assistantBubbleBg: '#1e293b',
} as const

export type ChatShellColors = typeof LIGHT

/** @deprecated use useChatShell() */
export const CHAT_SHELL = LIGHT

export const CHAT_FRAME_RADIUS = SHARED.radius

export const userBubbleRadius = `${SHARED.radiusBubble}px ${SHARED.radiusBubble}px ${SHARED.radiusBubbleTail}px ${SHARED.radiusBubble}px`
export const assistantBubbleRadius = `${SHARED.radiusBubble}px ${SHARED.radiusBubble}px ${SHARED.radiusBubble}px ${SHARED.radiusBubbleTail}px`

export function getChatShellColors(isDark: boolean): ChatShellColors {
  return isDark ? DARK : LIGHT
}

export function useChatShell(): ChatShellColors {
  const { isDark } = useTheme()
  return getChatShellColors(isDark)
}
