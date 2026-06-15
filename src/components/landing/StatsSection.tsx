'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Stagger, StaggerItem } from '@/src/components/landing/Motion'
import { PRIM } from '@/src/constants/brand'

export function StatsSection() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const stats = t('landing.stats', { returnObjects: true }) as { value: string; label: string }[]

  return (
    <section className="px-6 pb-20">
      <Stagger
        className="grid gap-px max-w-3xl mx-auto overflow-hidden rounded-[14px]"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          border: `1px solid ${C.border}`,
        }}
      >
        {stats.map(({ value, label }) => (
          <StaggerItem
            key={value}
            className="py-7 text-center"
            style={{ background: C.card } as never}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: PRIM }}>
              {value}
            </div>
            <div className="text-[13px]" style={{ color: C.muted }}>
              {label}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
