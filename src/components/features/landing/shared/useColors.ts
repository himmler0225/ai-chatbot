import type { LandingColors } from '@/types/landing'
import { LANDING_FG } from '@/constants/brand'

export type { LandingColors }

export function useColors(isDark: boolean): LandingColors {
  return {
    bg: isDark ? '#0a0c14' : '#ffffff',
    fg: isDark ? '#ffffff' : LANDING_FG,
    card: isDark ? '#12141c' : '#ffffff',
    card2: isDark ? '#161a24' : '#f8faf9',
    border: isDark ? '#1e2330' : '#e8eeec',
    muted: isDark ? '#8b95a8' : '#5f6f6a',
    nav: isDark ? 'rgba(10,12,20,0.88)' : 'rgba(255,255,255,0.92)',
    accent: isDark ? 'rgba(0,229,153,0.08)' : 'rgba(0,230,118,0.08)',
  }
}
