'use client'

import { PlayCircleOutlined, RocketOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { HeroContainer } from '../shared/section.style'
import { useColors } from '../shared/useColors'
import { PlatformTrans } from '@/components/common/ui/PlatformTrans'
import { ChatDemo } from './ChatDemo'
import {
  HeroActions,
  HeroBadge,
  HeroBadgeIcon,
  HeroContent,
  HeroCtaLink,
  HeroDesc,
  HeroHighlight,
  HeroPrimaryButton,
  HeroRadarCore,
  HeroRadarCrosshair,
  HeroRadarGrid,
  HeroRadarLayer,
  HeroRadarMesh,
  HeroRadarPulse,
  HeroRadarPulseSlow,
  HeroRadarSweep,
  HeroRadarSweepCone,
  HeroRadarVignette,
  HeroSecondaryButton,
  HeroSectionRoot,
  HeroTitle,
} from './hero.style'

interface Props {
  ctaAction: () => void
}

function HeroRadarBackground({ isDark }: { isDark: boolean }) {
  return (
    <HeroRadarLayer $isDark={isDark}>
      <HeroRadarMesh $isDark={isDark} />
      <HeroRadarGrid $isDark={isDark} />
      <HeroRadarCrosshair $isDark={isDark} />
      <HeroRadarPulse $delay={0} $duration={4.5} />
      <HeroRadarPulse $delay={1.5} $duration={4.5} />
      <HeroRadarPulse $delay={3} $duration={4.5} />
      <HeroRadarPulseSlow $delay={0.8} $duration={6.5} />
      <HeroRadarPulseSlow $delay={3.2} $duration={6.5} />
      <HeroRadarSweepCone $duration={9} />
      <HeroRadarSweep $isDark={isDark} $length={360} $duration={5} />
      <HeroRadarSweep $isDark={isDark} $length={260} $duration={8} $reverse />
      <HeroRadarCore $isDark={isDark} />
      <HeroRadarVignette $isDark={isDark} />
    </HeroRadarLayer>
  )
}

export function HeroSection({ ctaAction }: Props) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <HeroSectionRoot>
      <HeroRadarBackground isDark={isDark} />

      <HeroContainer>
        <HeroContent>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HeroBadge>
              <HeroBadgeIcon>✦</HeroBadgeIcon>
              {t('landing.badge')}
            </HeroBadge>
          </motion.div>

          <HeroTitle
            $C={C}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
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
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <PlatformTrans i18nKey="landing.hero.desc" size={20} />
          </HeroDesc>

          <HeroActions
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
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
              <HeroSecondaryButton
                size="large"
                icon={<PlayCircleOutlined />}
              >
                {t('landing.hero.howto')}
              </HeroSecondaryButton>
            </HeroCtaLink>
          </HeroActions>

          <div id="demo">
            <ChatDemo />
          </div>
        </HeroContent>
      </HeroContainer>
    </HeroSectionRoot>
  )
}
