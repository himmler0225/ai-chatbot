'use client'

import styled from 'styled-components'
import type { LandingThemeProps, LandingThemeWithModeProps } from '../shared/types'

export const FooterRoot = styled.footer<LandingThemeWithModeProps>`
  padding: 2rem 1rem 2.5rem;
  border-top: 1px solid ${p => p.$C.border};
  background: ${p => (p.$isDark ? '#080a10' : p.$C.bg)};

  @media (min-width: 640px) {
    padding: 2.5rem 1.5rem 3rem;
  }
`

export const FooterInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

export const FooterTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const FooterBrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

export const FooterBrand = styled.span<LandingThemeProps>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.$C.fg};
`

export const FooterUtilities = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

export const FooterCopyright = styled.p<LandingThemeProps>`
  margin: 0;
  font-size: 13px;
  color: ${p => p.$C.muted};
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`

export const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 1.5rem;
`

export const FooterLink = styled.a<LandingThemeProps>`
  font-size: 13px;
  color: ${p => p.$C.muted};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${p => p.$C.fg};
  }
`

/** @deprecated unused in new footer layout */
export const FooterBar = styled.div``
