'use client'

import styled from 'styled-components'
import { Button } from 'antd'
import { motion } from 'framer-motion'
import { PRIM } from '@/constants/brand'
import type { LandingThemeProps } from '../shared/types'

export const NavBar = styled(motion.nav)<LandingThemeProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 56px;
  background: ${p => p.$C.nav};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid ${p => p.$C.border};
`

export const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  cursor: pointer;

  @media (min-width: 400px) {
    gap: 0.625rem;
  }
`

export const BrandName = styled.span<LandingThemeProps>`
  display: none;
  font-size: 14px;
  font-weight: 600;
  color: ${p => p.$C.fg};
  letter-spacing: -0.2px;

  @media (min-width: 400px) {
    display: block;
  }
`

export const DesktopLinks = styled.div`
  display: none;
  align-items: center;
  gap: 1.75rem;

  @media (min-width: 1024px) {
    display: flex;
  }
`

export const NavLink = styled.a<LandingThemeProps>`
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.$C.muted};
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;

  @media (min-width: 640px) {
    gap: 0.5rem;
  }
`

export const NavDivider = styled.div<LandingThemeProps>`
  display: none;
  width: 1px;
  height: 18px;
  background: ${p => p.$C.border};

  @media (min-width: 1024px) {
    display: block;
  }
`

export const CtaShort = styled.span`
  @media (min-width: 1024px) {
    display: none;
  }
`

export const CtaFull = styled.span`
  display: none;

  @media (min-width: 1024px) {
    display: inline;
  }
`

export const DrawerLink = styled.a<LandingThemeProps>`
  display: block;
  padding: 0.75rem 1.25rem;
  font-size: 15px;
  font-weight: 500;
  color: ${p => p.$C.fg};
  text-decoration: none;
`

export const DrawerDivider = styled.div<LandingThemeProps>`
  margin: 0.75rem 1.25rem;
  height: 1px;
  background: ${p => p.$C.border};
`

export const DrawerActions = styled.div`
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const NavLoginButton = styled(Button)<LandingThemeProps>`
  &.ant-btn {
    display: none;
    color: ${p => p.$C.fg};
    font-weight: 500;
  }

  @media (min-width: 1024px) {
    &.ant-btn {
      display: inline-flex;
    }
  }
`

export const NavPrimaryButton = styled(Button)`
  &.ant-btn-primary {
    display: none;
    background: ${PRIM};
    border-color: ${PRIM};
    color: #0a0c14;
    border-radius: 8px;
    font-weight: 600;
  }

  @media (min-width: 1024px) {
    &.ant-btn-primary {
      display: inline-flex;
    }
  }
`

export const NavMenuButton = styled(Button)<LandingThemeProps>`
  &.ant-btn {
    display: inline-flex;
    color: ${p => p.$C.fg};
  }

  @media (min-width: 1024px) {
    &.ant-btn {
      display: none;
    }
  }
`

export const DrawerPrimaryButton = styled(Button)`
  &.ant-btn-primary {
    background: ${PRIM};
    border-color: ${PRIM};
    color: #0a0c14;
    border-radius: 8px;
    font-weight: 600;
  }
`
