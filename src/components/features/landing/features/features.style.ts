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
    ${p => p.$fullHeight ? 'grid-row: span 2;' : ''}
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

export const TikiPlatformWrap = styled.div<LandingThemeProps>`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 180px;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-top: 1.5rem;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
`
