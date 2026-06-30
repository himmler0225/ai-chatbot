'use client'

import { useTheme } from '@/contexts/theme'
import { CHAT_SHELL } from '@/constants/chat-shell-theme'

const SIDEBAR = {
  sidebarBg: '#0b1220',
  sidebarBorder: 'rgba(255,255,255,0.06)',
  sidebarText: '#94a3b8',
  sidebarTextActive: '#f8fafc',
  sidebarHover: 'rgba(255,255,255,0.04)',
  sidebarActive: 'rgba(37,99,235,0.12)',
  accent: '#2563eb',
  accentSoft: 'rgba(37,99,235,0.08)',
  avatarText: '#ffffff',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
} as const

const LIGHT = {
  ...SIDEBAR,
  bg: '#f1f5f9',
  cardBg: '#ffffff',
  border: '#e2e8f0',
  borderLight: '#f8fafc',
  text: '#0f172a',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  topBarBg: '#ffffff',
} as const

const DARK = {
  ...SIDEBAR,
  bg: '#0f172a',
  cardBg: '#1e293b',
  border: '#334155',
  borderLight: '#1e293b',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textSubtle: '#64748b',
  topBarBg: '#1e293b',
} as const

export type AdminColors = typeof LIGHT

/** @deprecated use useAdminColors() */
export const ADMIN_ENTERPRISE = LIGHT

export function getAdminColors(isDark: boolean): AdminColors {
  return isDark ? DARK : LIGHT
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
    borderRadius: CHAT_SHELL.radius,
  }
}
