'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { Reveal } from '../shared/Motion'
import { SectionLabel } from '../shared/Widgets'
import { STEP_ICONS } from '../shared/icons'
import {
  CardBody,
  CardTitle,
  FeatureCard,
  IconBoxLg,
  SectionContainer,
  SectionTitleSpaced,
  StepNumber,
} from '../shared/section.style'
import { useColors } from '../shared/useColors'
import { PlatformInline } from '@/components/common/ui/PlatformTrans'
import { HowStagger, HowStepItem } from './how.style'

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
    <SectionContainer id="how-it-works" as="section">
      <SectionLabel text={t('landing.how.label')} />
      <Reveal delay={0.1}>
        <SectionTitleSpaced $C={C}>{t('landing.how.title')}</SectionTitleSpaced>
      </Reveal>
      <HowStagger>
          {steps.map(({ n, title, body }, i) => (
            <HowStepItem key={n}>
              <FeatureCard $C={C}>
                <StepNumber>
                  {t('landing.how.stepPrefix')} {n}
                </StepNumber>
                <IconBoxLg>{STEP_ICONS[i]}</IconBoxLg>
                <CardTitle $C={C}>{title}</CardTitle>
                <CardBody $C={C}><PlatformInline text={body} size={16} /></CardBody>
              </FeatureCard>
            </HowStepItem>
          ))}
      </HowStagger>
    </SectionContainer>
  )
}
