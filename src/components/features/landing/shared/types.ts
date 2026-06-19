import type { LandingColors } from './useColors'

export interface LandingThemeProps {
  $C: LandingColors
}

export interface LandingThemeWithModeProps extends LandingThemeProps {
  $isDark: boolean
}
