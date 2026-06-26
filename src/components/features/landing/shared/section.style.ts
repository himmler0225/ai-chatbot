'use client'

import styled from 'styled-components'
import { LANDING_ACCENT } from '@/constants/brand'
import type { LandingThemeProps } from './types'

export const LandingPage = styled.div<LandingThemeProps>`
  min-height: 100vh;
  overflow-x: hidden;
  background: ${p => p.$C.bg};
  color: ${p => p.$C.fg};
`

export const SectionContainer = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1rem;

  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (min-width: 768px) {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
`

export const HeroContainer = styled.section`
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 5rem 1rem 3rem;
  text-align: center;

  @media (min-width: 640px) {
    padding: 6rem 1.5rem 4rem;
  }

  @media (min-width: 1024px) {
    padding: 7rem 1.5rem 4.5rem;
  }
`

export const SectionTitle = styled.h2<LandingThemeProps>`
  font-weight: 700;
  text-align: center;
  font-size: clamp(28px, 3.5vw, 40px);
  color: ${p => p.$C.fg};
  margin-bottom: 0.75rem;
`

export const SectionTitleSpaced = styled(SectionTitle)`
  margin-bottom: 2.5rem;
`

export const SectionSubtitle = styled.p<LandingThemeProps>`
  font-size: clamp(15px, 2vw, 16px);
  text-align: center;
  color: ${p => p.$C.muted};
  margin-bottom: 2.5rem;
  padding: 0 0.5rem;

  @media (min-width: 640px) {
    margin-bottom: 3.5rem;
  }
`

export const FeatureCard = styled.div<LandingThemeProps>`
  padding: 1.25rem;
  border-radius: 1rem;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 640px) {
    padding: 1.75rem;
  }
`

export const IconBox = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${LANDING_ACCENT}10;
  border: 1px solid ${LANDING_ACCENT}30;
`

export const IconBoxLg = styled(IconBox)`
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
`

export const CardTitle = styled.h3<LandingThemeProps & { $large?: boolean }>`
  font-size: ${p => (p.$large ? '1.25rem' : '1.125rem')};
  font-weight: 600;
  color: ${p => p.$C.fg};
  margin: 0.25rem 0 0.75rem;
`

export const CardBody = styled.p<LandingThemeProps>`
  font-size: 0.875rem;
  line-height: 1.65;
  color: ${p => p.$C.muted};
  margin: 0;
`

export const StepNumber = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${LANDING_ACCENT};
  margin-bottom: 1.25rem;
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

export const StyledGlyph = styled.span<{ $size: number }>`
  font-size: ${p => p.$size}px;
  color: ${LANDING_ACCENT};
  display: inline-flex;
`

export const StepsGrid = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const FeaturesGrid = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);
  }
`

export const MainFeatureCard = styled(FeatureCard)`
  @media (min-width: 768px) {
    grid-row: span 2;
  }
`
