import { create } from 'zustand'

export type AppView = 'chat' | 'utilities'
export type UtilityTab = 'shorten' | 'qr'

interface UIState {
  collapsed: boolean
  drawerOpen: boolean
  view: AppView
  utilityTab: UtilityTab
  authModalOpen: boolean
  authModalMode: 'login' | 'register'
}

interface UIActions {
  set: (patch: Partial<UIState>) => void
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
}

export const useUIStore = create<UIState & UIActions>(set => ({
  collapsed: false,
  drawerOpen: false,
  view: 'chat',
  utilityTab: 'shorten',
  authModalOpen: false,
  authModalMode: 'login',

  set: patch => set(patch),
  openAuthModal: (mode = 'login') => set({ authModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),
}))
