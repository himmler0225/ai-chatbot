'use client'

import styled from 'styled-components'
import type { LandingThemeProps, LandingThemeWithModeProps } from '../shared/types'

export const FooterRoot = styled.footer<LandingThemeWithModeProps>`
  padding: 3rem 1rem 1.5rem;
  border-top: 1px solid ${p => p.$C.border};
  background: ${p => (p.$isDark ? '#080a10' : p.$C.bg)};

  @media (min-width: 640px) {
    padding: 4rem 1.5rem 2rem;
  }
`

export const FooterInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

export const FooterGrid = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 2.5rem;

  @media (min-width: 640px) {
    gap: 2.5rem;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 3rem;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1.4fr 1fr 1fr;
  }
`

export const BrandCol = styled.div`
  @media (min-width: 640px) {
    grid-column: span 2;
  }

  @media (min-width: 768px) {
    grid-column: span 1;
  }
`

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
`

export const BrandTitle = styled.h4<LandingThemeProps>`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.$C.fg};
`

export const BrandDesc = styled.p<LandingThemeProps>`
  font-size: 14px;
  line-height: 1.65;
  margin: 0 0 1.5rem;
  max-width: 340px;
  color: ${p => p.$C.muted};
`

export const SocialRow = styled.div`
  display: flex;
  gap: 10px;
`

export const SocialIcon = styled.span`
  font-size: 16px;
`

export const SocialLink = styled.a<LandingThemeProps>`
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
  color: ${p => p.$C.muted};

  &:hover {
    opacity: 0.8;
  }
`

export const ColumnTitle = styled.span<LandingThemeProps>`
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: ${p => p.$C.muted};
`

export const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const FooterLink = styled.a<LandingThemeProps>`
  font-size: 14px;
  color: ${p => p.$C.fg};
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

export const Copyright = styled.div<LandingThemeProps>`
  padding-top: 1.5rem;
  text-align: center;
  font-size: 13px;
  border-top: 1px solid ${p => p.$C.border};
  color: ${p => p.$C.muted};
`
