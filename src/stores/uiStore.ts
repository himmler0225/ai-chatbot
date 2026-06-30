import { create } from 'zustand'

interface UIState {
  collapsed: boolean
  drawerOpen: boolean
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
  authModalOpen: false,
  authModalMode: 'login',

  set: patch => set(patch),
  openAuthModal: (mode = 'login') => set({ authModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),
}))
