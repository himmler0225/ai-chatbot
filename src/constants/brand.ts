import type { ModalColors } from '@/types/landing'

export const PRIM = '#00e599'
export const PRIM_DARK = '#00c47f'
/** Landing page palette (mockup) */
export const LANDING_ACCENT = '#00E676'
export const LANDING_FOREST = '#004D40'
export const LANDING_FG = '#0a2e28'
export const APP_NAME = 'ReviewMine AI'
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function getModalColors(isDark: boolean): ModalColors {
  return isDark
    ? { bg: '#111318', border: '#1e2330', muted: '#8b95a8', fg: '#f0f2f5', input: '#161a24' }
    : { bg: '#ffffff', border: '#e5e7eb', muted: '#6b7280', fg: '#111827', input: '#f9fafb' }
}
