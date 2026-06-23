'use client'

import { useTheme } from '@/contexts/theme'

export type AdminColors = {
  bg: string
  sidebarBg: string
  border: string
  cardBg: string
  text: string
  textMuted: string
  avatarText: string
}

export function getAdminColors(isDark: boolean): AdminColors {
  return isDark
    ? {
        bg: '#0a0c10',
        sidebarBg: '#0d1117',
        border: '#1e2330',
        cardBg: '#111820',
        text: '#f0f4f8',
        textMuted: '#b8c4d4',
        avatarText: '#0a0c10',
      }
    : {
        bg: '#f4f6f8',
        sidebarBg: '#ffffff',
        border: '#e2e8f0',
        cardBg: '#ffffff',
        text: '#0f172a',
        textMuted: '#64748b',
        avatarText: '#0a0c10',
      }
}

export function useAdminColors(): AdminColors {
  const { isDark } = useTheme()
  return getAdminColors(isDark)
}

export function adminCardStyle(c: AdminColors) {
  return {
    background: c.cardBg,
    borderColor: c.border,
    borderWidth: 1,
    borderStyle: 'solid' as const,
  }
}
