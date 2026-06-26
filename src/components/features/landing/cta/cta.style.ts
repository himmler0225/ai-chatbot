'use client'

import styled from 'styled-components'
import { Button } from 'antd'
import { LANDING_ACCENT, LANDING_FOREST } from '@/constants/brand'
import { SectionContainer } from '../shared/section.style'

export const CtaSection = styled(SectionContainer)`
  padding-top: 2rem;
  padding-bottom: 3rem;

  @media (min-width: 768px) {
    padding-bottom: 4rem;
  }
`

export const CtaCard = styled.div`
  border-radius: 1.5rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  background: linear-gradient(145deg, ${LANDING_FOREST} 0%, #00695c 100%);
  box-shadow: 0 24px 48px rgba(0, 77, 64, 0.2);

  @media (min-width: 640px) {
    padding: 3rem 2.5rem;
  }
`

export const CtaTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.25;
  color: #ffffff;
`

export const CtaDesc = styled.p`
  margin: 0 auto 1.75rem;
  max-width: 28rem;
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78);
`

export const CtaActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

export const CtaPrimaryButton = styled(Button)`
  &.ant-btn-primary {
    height: 48px;
    padding: 0 1.75rem;
    font-weight: 600;
    border-radius: 9999px;
    background: ${LANDING_ACCENT};
    border-color: ${LANDING_ACCENT};
    color: ${LANDING_FOREST};
    min-width: 200px;
  }
`

export const CtaSecondaryButton = styled(Button)`
  &.ant-btn {
    height: 48px;
    padding: 0 1.75rem;
    font-weight: 600;
    border-radius: 9999px;
    border-color: rgba(255, 255, 255, 0.45);
    color: #ffffff;
    background: transparent;
    min-width: 200px;

    &:hover {
      border-color: #ffffff !important;
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.08) !important;
    }
  }
`
