export type ModalColors = {
  bg: string
  border: string
  muted: string
  fg: string
  input: string
}

export const PRIM = '#00e599'
export const PRIM_DARK = '#00c47f'
/** Landing page palette (mockup) */
export const LANDING_ACCENT = '#00E676'
export const LANDING_FOREST = '#004D40'
export const LANDING_FG = '#0a2e28'
export const APP_NAME = 'KiraAI'
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function getModalColors(isDark: boolean): ModalColors {
  return isDark
    ? { bg: '#1e293b', border: '#334155', muted: '#94a3b8', fg: '#f1f5f9', input: '#0f172a' }
    : { bg: '#ffffff', border: '#e2e8f0', muted: '#64748b', fg: '#0f172a', input: '#f8fafc' }
}
