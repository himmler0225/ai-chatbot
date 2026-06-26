'use client'

import styled from 'styled-components'
import { PRIM } from '@/constants/brand'
import type { LandingThemeProps } from '@/components/features/landing/shared/types'

export const LegalPageRoot = styled.div<LandingThemeProps>`
  min-height: 100vh;
  background: ${p => p.$C.bg};
  color: ${p => p.$C.fg};
`

export const LegalHeader = styled.header<LandingThemeProps>`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid ${p => p.$C.border};
  background: ${p => p.$C.nav};
  backdrop-filter: blur(12px);
`

export const LegalHeaderInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (min-width: 640px) {
    padding: 0.875rem 1.5rem;
  }
`

export const LegalBrand = styled.a<LandingThemeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  color: ${p => p.$C.fg};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;

  &:hover {
    color: ${PRIM};
  }
`

export const LegalHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

export const LegalMain = styled.main`
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  @media (min-width: 640px) {
    padding: 2.5rem 1.5rem 5rem;
  }
`

export const LegalDocTitle = styled.h1<LandingThemeProps>`
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.5rem;
  color: ${p => p.$C.fg};
`

export const LegalUpdated = styled.p<LandingThemeProps>`
  margin: 0 0 1.75rem;
  font-size: 0.875rem;
  color: ${p => p.$C.muted};
`

export const LegalIntro = styled.p<LandingThemeProps>`
  margin: 0 0 2rem;
  font-size: 1rem;
  line-height: 1.7;
  color: ${p => p.$C.muted};
`

export const LegalSection = styled.section`
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`

export const LegalSectionTitle = styled.h2<LandingThemeProps>`
  font-size: 1.0625rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: ${p => p.$C.fg};
`

export const LegalParagraph = styled.p<LandingThemeProps>`
  margin: 0 0 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${p => p.$C.muted};

  &:last-child {
    margin-bottom: 0;
  }

  a {
    color: ${PRIM};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`

export const LegalList = styled.ul<LandingThemeProps>`
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: ${p => p.$C.muted};
  }
`

export const LegalFooterLinks = styled.nav<LandingThemeProps>`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${p => p.$C.border};
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;

  a {
    color: ${p => p.$C.muted};
    text-decoration: none;

    &:hover {
      color: ${PRIM};
    }
  }
`
