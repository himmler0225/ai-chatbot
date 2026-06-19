'use client'

import styled from 'styled-components'
import { PRIM } from '@/constants/brand'

export const LabelWrap = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`

export const LabelPill = styled.span`
  display: inline-block;
  padding: 0.25rem 0.875rem;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: ${PRIM}10;
  border: 1px solid ${PRIM}30;
  color: ${PRIM};
`

export const BadgePill = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  background: ${PRIM}12;
  color: ${PRIM};
  border: 1px solid ${PRIM}30;
`
