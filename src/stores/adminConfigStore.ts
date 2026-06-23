import { create } from 'zustand'

type AdminConfigState = {
  draft: Record<string, string>
  dirty: boolean
  setKey: (key: string, value: string) => void
  resetDraft: () => void
}

export const useAdminConfigStore = create<AdminConfigState>(set => ({
  draft: {},
  dirty: false,
  setKey: (key, value) =>
    set(state => ({
      draft: { ...state.draft, [key]: value },
      dirty: true,
    })),
  resetDraft: () => set({ draft: {}, dirty: false }),
}))
