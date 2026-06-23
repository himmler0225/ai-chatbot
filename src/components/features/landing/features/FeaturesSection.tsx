'use client'

import { SearchOutlined, ShopOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme'
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
  ChatMock,
  ChatMockGreeting,
  ChatMockInput,
  ChatMockInputBar,
  ChatMockSend,
  ChatMockStoreChip,
  ChatMockStores,
  ChatMockSuggestion,
  ChatMockSuggestions,
  FeatureVisualWrap,
  FeaturesStagger,
  FeaturesCard,
  MainFeatureItem,
  ProductGrid,
  ProductTile,
  SearchMockBar,
  SideFeatureItem,
  SkeletonImg,
  SkeletonLine,
  StoreMock,
} from './features.style'

const FALLBACK_SUGGESTIONS = [
  'What do users say about iPhone 16 Pro Max?',
  'Is the Samsung Galaxy S24 worth buying based on YouTube reviews?',
  'Compare MacBook Air M3 vs Dell XPS on TikTok',
]

function ChatReviewVisual() {
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const { t } = useTranslation()

  const raw = t('chat.suggestions', { returnObjects: true })
  const suggestions = (Array.isArray(raw) ? raw : FALLBACK_SUGGESTIONS).slice(0, 3)

  return (
    <FeatureVisualWrap $C={C}>
      <ChatMock $C={C}>
        <ChatMockGreeting $C={C}>{t('chat.greeting')}</ChatMockGreeting>
        <ChatMockSuggestions>
          {suggestions.map(text => (
            <ChatMockSuggestion key={text} $C={C}>
              {text}
            </ChatMockSuggestion>
          ))}
        </ChatMockSuggestions>
        <ChatMockStores>
          <ChatMockStoreChip $C={C}>
            <ShopOutlined />
            <span>{t('landing.features.browseProducts')}</span>
          </ChatMockStoreChip>
        </ChatMockStores>
        <ChatMockInputBar $C={C}>
          <ChatMockInput $C={C}>{t('chat.inputPlaceholderShort')}</ChatMockInput>
          <ChatMockSend>→</ChatMockSend>
        </ChatMockInputBar>
      </ChatMock>
    </FeatureVisualWrap>
  )
}

function StoreSearchVisual() {
  const { isDark } = useTheme()
  const C = useColors(isDark)
  const { t } = useTranslation()

  return (
    <FeatureVisualWrap $C={C}>
      <StoreMock $C={C}>
        <SearchMockBar $C={C}>
          <SearchOutlined />
          <span>{t('landing.features.searchPlaceholder')}</span>
        </SearchMockBar>
        <ProductGrid>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <ProductTile key={i} $C={C}>
              <SkeletonImg $C={C} />
              <SkeletonLine $C={C} $w="85%" />
              <SkeletonLine $C={C} $w="55%" />
            </ProductTile>
          ))}
        </ProductGrid>
      </StoreMock>
    </FeatureVisualWrap>
  )
}

function FeatureIcon({ index }: { index: number }) {
  if (index >= 1) {
    return (
      <IconBox>
        <ShopOutlined style={{ fontSize: 22, opacity: 0.85 }} />
      </IconBox>
    )
  }
  return <IconBox>{FEAT_ICONS[0]}</IconBox>
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
            <ChatReviewVisual />
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
              <StoreSearchVisual />
            </FeaturesCard>
          </SideFeatureItem>
        ))}
      </FeaturesStagger>
    </SectionContainer>
  )
}
