import type { ModalColors } from '@/src/types/landing'

export const PRIM = '#10a37f'
export const APP_NAME = 'ReviewMine AI'
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function getModalColors(isDark: boolean): ModalColors {
  return isDark
    ? { bg: '#111111', border: '#2a2a2a', muted: '#888', fg: '#f0f0f0', input: '#1e1e1e' }
    : { bg: '#ffffff', border: '#e5e7eb', muted: '#6b7280', fg: '#111827', input: '#f9fafb' }
}
