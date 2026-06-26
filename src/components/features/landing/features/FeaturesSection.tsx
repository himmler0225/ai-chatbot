'use client'

import { ExclamationCircleOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { Reveal } from '../shared/Motion'
import { useColors } from '../shared/useColors'
import { PhoneMockup } from './PhoneMockup'
import {
  CoreBody,
  CoreCopy,
  CoreGrid,
  CoreLabel,
  CoreSection,
  CoreTitle,
  QuestionIcon,
  QuestionItem,
  QuestionList,
  QuestionText,
} from './features.style'

const QUESTION_ICONS = [SearchOutlined, ThunderboltOutlined, ExclamationCircleOutlined]

export function FeaturesSection() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const questions = t('landing.core.questions', { returnObjects: true }) as string[]

  return (
    <CoreSection id="features" as="section">
      <CoreGrid>
        <Reveal>
          <CoreCopy>
            <CoreLabel>{t('landing.core.label')}</CoreLabel>
            <CoreTitle $C={C}>{t('landing.core.title')}</CoreTitle>
            <CoreBody $C={C}>{t('landing.core.body')}</CoreBody>

            <QuestionList staggerMs={90}>
              {questions.map((text, i) => {
                const Icon = QUESTION_ICONS[i] ?? SearchOutlined
                return (
                  <QuestionItem key={text} $C={C}>
                    <QuestionIcon>
                      <Icon />
                    </QuestionIcon>
                    <QuestionText $C={C}>{text}</QuestionText>
                  </QuestionItem>
                )
              })}
            </QuestionList>
          </CoreCopy>
        </Reveal>

        <Reveal delay={0.12}>
          <PhoneMockup />
        </Reveal>
      </CoreGrid>
    </CoreSection>
  )
}
