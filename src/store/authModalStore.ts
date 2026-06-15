import { create } from 'zustand'

type AuthMode = 'login' | 'register'

interface State {
  mode: AuthMode
  name: string
  email: string
  password: string
  loading: boolean
  googleLoading: boolean
  error: string | null
  registered: boolean
}

interface Actions {
  set: (patch: Partial<State>) => void
  reset: (mode?: AuthMode) => void
}

const INIT: State = {
  mode: 'login',
  name: '',
  email: '',
  password: '',
  loading: false,
  googleLoading: false,
  error: null,
  registered: false,
}

export const useAuthModalStore = create<State & Actions>(set => ({
  ...INIT,
  set: patch => set(patch),
  reset: (mode = 'login') => set({ ...INIT, mode }),
}))
