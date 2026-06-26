'use client'

import styled from 'styled-components'
import { motion } from 'framer-motion'
import { LANDING_ACCENT, LANDING_FOREST, EASE } from '@/constants/brand'
import { Stagger, StaggerItem } from '../shared/Motion'
import { SectionContainer } from '../shared/section.style'
import type { LandingThemeProps } from '../shared/types'

export const CoreSection = styled(SectionContainer)`
  padding-top: 3rem;
  padding-bottom: 3.5rem;

  @media (min-width: 768px) {
    padding-top: 4rem;
    padding-bottom: 5rem;
  }
`

export const CoreGrid = styled.div`
  display: grid;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
`

export const CoreCopy = styled.div`
  max-width: 32rem;
`

export const CoreLabel = styled.span`
  display: inline-block;
  margin-bottom: 0.75rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${LANDING_ACCENT};
`

export const CoreTitle = styled.h2<LandingThemeProps>`
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${p => p.$C.fg};
`

export const CoreBody = styled.p<LandingThemeProps>`
  margin: 0 0 1.5rem;
  font-size: 1rem;
  line-height: 1.7;
  color: ${p => p.$C.muted};
`

export const QuestionList = styled(Stagger)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const QuestionItem = styled(StaggerItem)<LandingThemeProps>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${p => p.$C.border};
  background: ${p => p.$C.card};
  cursor: default;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: ${LANDING_ACCENT}55;
    box-shadow: 0 4px 16px rgba(0, 77, 64, 0.06);
  }
`

export const QuestionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  background: ${LANDING_ACCENT}14;
  color: ${LANDING_FOREST};
  font-size: 14px;
`

export const QuestionText = styled.span<LandingThemeProps>`
  font-size: 0.9rem;
  line-height: 1.45;
  color: ${p => p.$C.fg};
`

export const PhoneStage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PhoneBackdrop = styled.div`
  position: relative;
  width: min(100%, 320px);
  aspect-ratio: 1;
  border-radius: 1.5rem;
  background: linear-gradient(145deg, ${LANDING_FOREST} 0%, #00695c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-shadow: 0 24px 48px rgba(0, 77, 64, 0.25);
`

export const PhoneFrame = styled(motion.div)<LandingThemeProps>`
  width: 100%;
  max-width: 220px;
  border-radius: 1.75rem;
  border: 3px solid rgba(255, 255, 255, 0.15);
  background: ${p => p.$C.card};
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
`

export const PhoneNotch = styled.div<LandingThemeProps>`
  height: 1.25rem;
  background: ${p => p.$C.bg};
`

export const PhoneScreen = styled.div<LandingThemeProps>`
  padding: 0.75rem;
  min-height: 280px;
  background: ${p => p.$C.bg};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const PhoneBubbleUser = styled.div`
  align-self: flex-end;
  max-width: 85%;
  padding: 0.5rem 0.65rem;
  border-radius: 0.75rem 0.75rem 0.2rem 0.75rem;
  background: ${LANDING_FOREST};
  color: #fff;
  font-size: 10px;
  line-height: 1.4;
`

export const PhoneBubbleAi = styled.div<LandingThemeProps>`
  align-self: flex-start;
  max-width: 90%;
  padding: 0.5rem 0.65rem;
  border-radius: 0.75rem 0.75rem 0.75rem 0.2rem;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
  font-size: 10px;
  line-height: 1.45;
  color: ${p => p.$C.muted};
`

export const PhoneAnalyzing = styled(motion.div)`
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.95);
  color: ${LANDING_FOREST};
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`

export const PhonePulse = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: ${LANDING_ACCENT};
  animation: phone-pulse 1.2s ease-in-out infinite;
`

export const phoneEnter = {
  initial: { opacity: 0, y: 24, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.65, ease: EASE },
}
