// Supabase tạm thời bị vô hiệu hóa — bật lại khi có NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
// import { createClient } from '@supabase/supabase-js'
//
// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
// const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
//
// if (!SUPABASE_URL || !SUPABASE_KEY) {
//   console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
// }
//
// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const disabledError = { message: 'Supabase is temporarily disabled' }

export const supabase = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: (_cb: unknown) => ({
            data: { subscription: { unsubscribe: () => {} } },
        }),
        signInWithOAuth: async () => ({ data: null, error: disabledError }),
        signInWithPassword: async () => ({ data: { session: null, user: null }, error: disabledError }),
        signUp: async () => ({ data: { session: null, user: null }, error: disabledError }),
        signOut: async () => ({ error: null }),
    },
}

export async function signInWithGoogle(_redirectPath = '/app') {
    return { data: null, error: disabledError }
}

export async function signInWithEmail(_email: string, _password: string) {
    return { data: { session: null, user: null }, error: disabledError }
}

export async function signUpWithEmail(_email: string, _password: string, _name?: string) {
    return { data: { session: null, user: null }, error: disabledError }
}

export async function signOut() {
    return { error: null }
}

export async function getSession() {
    return null
}

export async function getUser() {
    return null
}
