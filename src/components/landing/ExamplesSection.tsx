'use client'

import { MessageOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Reveal, Stagger } from '@/src/components/landing/Motion'
import { SectionLabel } from '@/src/components/landing/Widgets'
import { PRIM, EASE } from '@/src/constants/brand'

export function ExamplesSection() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const examples = t('landing.examples.items', { returnObjects: true }) as {
    q: string
    a: string
  }[]

  return (
    <section className="px-6 py-24 max-w-[720px] mx-auto">
      <SectionLabel text={t('landing.examples.label')} />
      <Reveal delay={0.1}>
        <h2
          className="font-bold mb-12"
          style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: C.fg }}
        >
          {t('landing.examples.title')}
        </h2>
      </Reveal>
      <Stagger className="flex flex-col gap-4">
        {examples.map(({ q, a }) => (
          <motion.div
            key={q}
            className="flex gap-5 items-start p-5 rounded-[14px]"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
            whileHover={{ x: 4, transition: { duration: 0.2 } }}
          >
            <MessageOutlined className="text-xl flex-shrink-0 mt-0.5" style={{ color: PRIM }} />
            <div>
              <div className="text-[15px] font-medium mb-1.5" style={{ color: C.fg }}>
                {q}
              </div>
              <div className="text-sm leading-relaxed" style={{ color: C.muted }}>
                {a}
              </div>
            </div>
          </motion.div>
        ))}
      </Stagger>
    </section>
  )
}
