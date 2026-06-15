import type { LandingColors } from '@/src/types/landing'

export type { LandingColors }

export function useColors(isDark: boolean): LandingColors {
  return {
    bg: isDark ? '#0a0a0a' : '#f8f9fa',
    fg: isDark ? '#f0f0f0' : '#111827',
    card: isDark ? '#141414' : '#ffffff',
    card2: isDark ? '#1a1a1a' : '#f3f4f6',
    border: isDark ? '#242424' : '#e5e7eb',
    muted: isDark ? '#999' : '#374151',
    nav: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(248,249,250,0.9)',
  }
}
