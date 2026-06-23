'use client'

import type { ReactNode } from 'react'

export function AdminPageBody({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
}
