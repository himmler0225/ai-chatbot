'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Reveal, Stagger, StaggerItem } from '@/src/components/landing/Motion'
import { SectionLabel } from '@/src/components/landing/Widgets'
import { STEP_ICONS } from '@/src/components/landing/icons'
import { PRIM } from '@/src/constants/brand'

export function HowSection() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const steps = t('landing.how.steps', { returnObjects: true }) as {
    n: string
    title: string
    body: string
  }[]

  return (
    <section id="how-it-works" className="px-6 py-24 max-w-[1000px] mx-auto">
      <SectionLabel text={t('landing.how.label')} />
      <Reveal delay={0.1}>
        <h2
          className="font-bold mb-12"
          style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: C.fg }}
        >
          {t('landing.how.title')}
        </h2>
      </Reveal>
      <Stagger
        className="grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))' }}
      >
        {steps.map(({ n, title, body }, i) => (
          <StaggerItem
            key={n}
            className="p-7 rounded-[14px]"
            style={{ background: C.card, border: `1px solid ${C.border}` } as never}
          >
            <div className="text-[11px] font-bold tracking-[2px] mb-3.5" style={{ color: PRIM }}>
              {t('landing.how.stepPrefix')} {n}
            </div>
            <div className="mb-3.5">{STEP_ICONS[i]}</div>
            <div className="text-[17px] font-semibold mb-2.5 mt-5" style={{ color: C.fg }}>
              {title}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
              {body}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
