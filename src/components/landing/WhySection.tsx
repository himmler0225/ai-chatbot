'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Reveal, Stagger, StaggerItem } from '@/src/components/landing/Motion'
import { SectionLabel } from '@/src/components/landing/Widgets'
import { WHY_ICONS } from '@/src/components/landing/icons'

export function WhySection() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const items = t('landing.why.items', { returnObjects: true }) as { title: string; body: string }[]

  return (
    <section className="px-6 py-20 text-center max-w-[1000px] mx-auto">
      <SectionLabel text={t('landing.why.label')} />
      <Reveal delay={0.1}>
        <h2
          className="font-bold mb-12"
          style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: C.fg }}
        >
          {t('landing.why.title')}
        </h2>
      </Reveal>
      <Stagger
        className="grid gap-5 max-w-[800px] mx-auto"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
      >
        {items.map(({ title, body }, i) => (
          <StaggerItem
            key={title}
            className="p-6 rounded-[14px]"
            style={{ background: C.card, border: `1px solid ${C.border}` } as never}
          >
            <div className="mb-3">{WHY_ICONS[i]}</div>
            <div className="text-[15px] font-semibold mb-2" style={{ color: C.fg }}>
              {title}
            </div>
            <div className="text-[13px] leading-relaxed" style={{ color: C.muted }}>
              {body}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
