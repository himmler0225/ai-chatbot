'use client'

import styled from 'styled-components'
import { LANDING_ACCENT } from '@/constants/brand'

export const LabelWrap = styled.div<{ $compact?: boolean }>`
  text-align: center;
  margin-bottom: ${p => (p.$compact ? '0.5rem' : '1rem')};
`

export const LabelPill = styled.span`
  display: inline-block;
  padding: 0.25rem 0.875rem;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: ${LANDING_ACCENT}12;
  border: 1px solid ${LANDING_ACCENT}40;
  color: ${LANDING_ACCENT};
`

export const BadgePill = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  background: ${LANDING_ACCENT}12;
  color: ${LANDING_ACCENT};
  border: 1px solid ${LANDING_ACCENT}30;
`
