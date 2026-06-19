import type { LandingColors } from '@/types/landing'

export type { LandingColors }

export function useColors(isDark: boolean): LandingColors {
  return {
    bg: isDark ? '#0a0c14' : '#f4f6f8',
    fg: isDark ? '#ffffff' : '#0f172a',
    card: isDark ? '#12141c' : '#ffffff',
    card2: isDark ? '#161a24' : '#f8fafc',
    border: isDark ? '#1e2330' : '#e2e8f0',
    muted: isDark ? '#8b95a8' : '#64748b',
    nav: isDark ? 'rgba(10,12,20,0.88)' : 'rgba(244,246,248,0.92)',
    accent: isDark ? 'rgba(0,229,153,0.08)' : 'rgba(0,229,153,0.06)',
  }
}
