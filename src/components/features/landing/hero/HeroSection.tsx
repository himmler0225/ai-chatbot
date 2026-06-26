'use client'

import { PlayCircleOutlined, RocketOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { HeroContainer } from '../shared/section.style'
import { useColors } from '../shared/useColors'
import { ChatDemo } from './ChatDemo'
import {
  DemoWrap,
  HeroActions,
  HeroContent,
  HeroCtaLink,
  HeroDesc,
  HeroGlow,
  HeroHighlight,
  HeroPrimaryButton,
  HeroSecondaryButton,
  HeroSectionRoot,
  HeroTitle,
  RealReviewsBadge,
} from './hero.style'

interface Props {
  ctaAction: () => void
}

export function HeroSection({ ctaAction }: Props) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <HeroSectionRoot>
      <HeroGlow $isDark={isDark} />

      <HeroContainer>
        <HeroContent>
          <HeroTitle
            $C={C}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            {t('landing.hero.title1')}{' '}
            <HeroHighlight>{t('landing.hero.titleHighlight')}</HeroHighlight>
            <br />
            {t('landing.hero.title2')}
          </HeroTitle>

          <HeroDesc
            $C={C}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            {t('landing.hero.desc')}
          </HeroDesc>

          <HeroActions
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            <HeroPrimaryButton
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={ctaAction}
            >
              {t('landing.hero.cta')}
            </HeroPrimaryButton>
            <HeroCtaLink href="#how-it-works">
              <HeroSecondaryButton size="large" icon={<PlayCircleOutlined />}>
                {t('landing.hero.howto')}
              </HeroSecondaryButton>
            </HeroCtaLink>
          </HeroActions>

          <div id="demo">
            <DemoWrap>
              <RealReviewsBadge>{t('landing.hero.realReviewsBadge')}</RealReviewsBadge>
              <ChatDemo />
            </DemoWrap>
          </div>
        </HeroContent>
      </HeroContainer>
    </HeroSectionRoot>
  )
}
