'use client'

import { Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Reveal, Stagger, StaggerItem } from '@/src/components/landing/Motion'
import { SectionLabel, Badge } from '@/src/components/landing/Widgets'
import { FEAT_ICONS } from '@/src/components/landing/icons'

export function FeaturesSection() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const features = t('landing.features.items', { returnObjects: true }) as {
    badge: string
    title: string
    body: string
  }[]

  return (
    <section className="px-6 py-24 max-w-[1000px] mx-auto">
      <SectionLabel text={t('landing.features.label')} />
      <Reveal delay={0.1}>
        <h2
          className="font-bold mb-3"
          style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: C.fg }}
        >
          {t('landing.features.title')}
        </h2>
        <p className="text-base mb-12" style={{ color: C.muted }}>
          {t('landing.features.subtitle')}
        </p>
      </Reveal>
      <Stagger
        className="grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {features.map(({ badge, title, body }, i) => (
          <StaggerItem
            key={title}
            className="p-7 rounded-[14px]"
            style={{ background: C.card2, border: `1px solid ${C.border}` } as never}
          >
            <Flex align="center" justify="space-between" className="mb-4">
              {FEAT_ICONS[i]}
              <Badge label={badge} />
            </Flex>
            <div className="text-[17px] font-semibold mb-2.5" style={{ color: C.fg }}>
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
