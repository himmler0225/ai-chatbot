'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
import { TikiLogo } from '@/components/common/ui/TikiLogo'
import { PlatformInline } from '@/components/common/ui/PlatformTrans'
import { Reveal } from '../shared/Motion'
import { Badge, SectionLabel } from '../shared/Widgets'
import { FEAT_ICONS } from '../shared/icons'
import {
  CardBody,
  CardHeader,
  CardTitle,
  IconBox,
  SectionContainer,
  SectionSubtitle,
  SectionTitle,
} from '../shared/section.style'
import { useColors } from '../shared/useColors'
import {
  FeaturesStagger,
  FeaturesCard,
  MainFeatureItem,
  SideFeatureItem,
  TikiPlatformWrap,
} from './features.style'

function ChatPlatformVisual() {
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <TikiPlatformWrap $C={C}>
      <Image
        src="/chat_platform.png"
        alt="Chat AI platform"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
    </TikiPlatformWrap>
  )
}

function TikiPlatformVisual() {
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <TikiPlatformWrap $C={C}>
      <Image
        src="/tiki_platform.png"
        alt="Tiki platform"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
    </TikiPlatformWrap>
  )
}

function FeatureIcon({ index }: { index: number }) {
  if (index === 1) {
    return (
      <IconBox>
        <TikiLogo size={40} />
      </IconBox>
    )
  }
  return <IconBox>{FEAT_ICONS[index]}</IconBox>
}

function FeatureBody({ body }: { body: string }) {
  if (body.includes('<yt>') || body.includes('<tt>')) {
    return <PlatformInline text={body} size={18} />
  }
  return <>{body}</>
}

export function FeaturesSection() {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const features = t('landing.features.items', { returnObjects: true }) as {
    badge: string
    title: string
    body: string
  }[]

  const mainFeature = features[0]
  const sideFeatures = features.slice(1)

  return (
    <SectionContainer id="features" as="section">
      <SectionLabel text={t('landing.features.label')} />
      <Reveal delay={0.1}>
        <SectionTitle $C={C}>{t('landing.features.title')}</SectionTitle>
        <SectionSubtitle $C={C}>{t('landing.features.subtitle')}</SectionSubtitle>
      </Reveal>

      <FeaturesStagger>
        <MainFeatureItem>
          <FeaturesCard $C={C}>
            <CardHeader>
              <FeatureIcon index={0} />
              <Badge label={mainFeature.badge} />
            </CardHeader>
            <CardTitle $C={C} $large>
              {mainFeature.title}
            </CardTitle>
            <CardBody $C={C}><FeatureBody body={mainFeature.body} /></CardBody>
            <ChatPlatformVisual />
          </FeaturesCard>
        </MainFeatureItem>

        {sideFeatures.map((feat, i) => (
          <SideFeatureItem key={feat.title} $fullHeight={sideFeatures.length === 1}>
            <FeaturesCard $C={C}>
              <CardHeader>
                <FeatureIcon index={i + 1} />
                <Badge label={feat.badge} />
              </CardHeader>
              <CardTitle $C={C}>{feat.title}</CardTitle>
              <CardBody $C={C}><FeatureBody body={feat.body} /></CardBody>
              {i === 0 && <TikiPlatformVisual />}
            </FeaturesCard>
          </SideFeatureItem>
        ))}
      </FeaturesStagger>
    </SectionContainer>
  )
}
