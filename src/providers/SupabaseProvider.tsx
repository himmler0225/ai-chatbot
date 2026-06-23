'use client'

import type { SupabasePublicConfig } from '@/lib/env'
import { initSupabase } from '@/lib/supabase'

type Props = {
  config: SupabasePublicConfig
  children: React.ReactNode
}

export function SupabaseProvider({ config, children }: Props) {
  if (config.url && config.anonKey) {
    initSupabase(config.url, config.anonKey)
  }
  return <>{children}</>
}
