'use client'

import styled from 'styled-components'
import { PRIM } from '@/constants/brand'
import { Stagger, StaggerItem } from '../shared/Motion'
import type { LandingThemeProps } from '../shared/types'

export const FeaturesStagger = styled(Stagger)`
  display: grid;
  gap: 1.25rem;
  align-items: stretch;

  & > [data-anime-stagger] {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* iPad: 1 cột */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: 1fr;
    max-width: 560px;
    margin-inline: auto;
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr 1fr;
    align-items: stretch;
  }
`

export const MainFeatureItem = styled(StaggerItem)`
  @media (min-width: 1024px) {
    grid-row: span 2;
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }
`

export const SideFeatureItem = styled(StaggerItem)<{ $fullHeight?: boolean }>`
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    ${p => (p.$fullHeight ? 'grid-row: span 2;' : '')}
  }
`

export const FeaturesCard = styled.div<LandingThemeProps>`
  flex: 1;
  min-height: 0;
  padding: 1.25rem;
  border-radius: 1rem;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    padding: 1.75rem;
  }
`

export const RadarWrap = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 180px;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-top: 1.5rem;
  background: linear-gradient(180deg, rgba(0, 229, 153, 0.04) 0%, rgba(0, 229, 153, 0.01) 100%);
  border: 1px solid ${PRIM}20;
`

export const RadarGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at center, ${PRIM}18 0%, transparent 55%),
    repeating-radial-gradient(circle at center, transparent 0, transparent 28px, ${PRIM}08 28px, ${PRIM}08 29px);
`

export const RadarRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  border: 2px solid ${PRIM}50;
  box-shadow: 0 0 30px ${PRIM}30, inset 0 0 20px ${PRIM}15;
`

export const RadarSweep = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 90px;
  transform-origin: bottom center;
  transform: translate(-50%, -100%) rotate(30deg);
  background: linear-gradient(to top, ${PRIM}80, transparent);
  animation: radar-sweep 3s linear infinite;
`

export const FeatureVisualWrap = styled.div<LandingThemeProps>`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 160px;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-top: 1.25rem;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
`

/** @deprecated use FeatureVisualWrap */
export const TikiPlatformWrap = FeatureVisualWrap

export const StoreMock = styled.div<LandingThemeProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 160px;
  padding: 0.75rem;
  gap: 0.625rem;
  background: ${p => p.$C.bg};
`

export const SearchMockBar = styled.div<LandingThemeProps>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid ${p => p.$C.border};
  background: ${p => p.$C.card};
  font-size: 10px;
  color: ${p => p.$C.muted};

  .anticon {
    font-size: 11px;
    opacity: 0.5;
    flex-shrink: 0;
  }
`

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  flex: 1;
`

export const ProductTile = styled.div<LandingThemeProps>`
  padding: 0.45rem;
  border-radius: 0.5rem;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

export const SkeletonImg = styled.div<LandingThemeProps>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0.35rem;
  background: ${p => p.$C.border};
  opacity: 0.55;
`

export const SkeletonLine = styled.div<LandingThemeProps & { $w?: string }>`
  height: 6px;
  width: ${p => p.$w ?? '70%'};
  border-radius: 999px;
  background: ${p => p.$C.border};
  opacity: 0.7;
`

export const ChatMock = styled.div<LandingThemeProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 240px;
  padding: 0.875rem 0.75rem 0.65rem;
  gap: 0.45rem;
  background: ${p => p.$C.bg};
`

export const ChatMockGreeting = styled.p<LandingThemeProps>`
  margin: 0 0 0.15rem;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.$C.fg};
  line-height: 1.35;
`

export const ChatMockSuggestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

export const ChatMockSuggestion = styled.div<LandingThemeProps>`
  padding: 0.45rem 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid ${p => p.$C.border};
  background: ${p => p.$C.card};
  color: ${p => p.$C.muted};
  font-size: 10px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ChatMockStores = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.1rem;
`

export const ChatMockStoreChip = styled.div<LandingThemeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  border: 1px solid ${p => p.$C.border};
  background: ${p => p.$C.card};
  color: ${p => p.$C.fg};
  font-size: 9px;
  font-weight: 500;

  .anticon {
    font-size: 10px;
    opacity: 0.65;
  }
`

export const ChatMockInputBar = styled.div<LandingThemeProps>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
  padding: 0.4rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${p => p.$C.border};
  background: ${p => p.$C.card};
`

export const ChatMockInput = styled.span<LandingThemeProps>`
  flex: 1;
  font-size: 9px;
  color: ${p => p.$C.muted};
  opacity: 0.85;
`

export const ChatMockSend = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.35rem;
  background: ${PRIM};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
`
