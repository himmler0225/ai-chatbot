'use client'

import styled from 'styled-components'
import { Button } from 'antd'
import { motion } from 'framer-motion'
import { LANDING_ACCENT, LANDING_FOREST } from '@/constants/brand'
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

export const NavLink = styled.a<LandingThemeProps & { $active?: boolean }>`
  position: relative;
  padding: 0.25rem 0 0.35rem;
  font-size: 14px;
  font-weight: ${p => (p.$active ? 600 : 500)};
  color: ${p => (p.$active ? p.$C.fg : p.$C.muted)};
  text-decoration: none;
  transition: color 0.2s;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    border-radius: 9999px;
    background: ${LANDING_ACCENT};
    transform: scaleX(${p => (p.$active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.22s ease;
  }

  &:hover {
    color: ${p => p.$C.fg};
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
  display: none;

  @media (min-width: 640px) and (max-width: 1023px) {
    display: inline;
  }
`

export const CtaFull = styled.span`
  display: none;

  @media (min-width: 1024px) {
    display: inline;
  }
`

export const DrawerLink = styled.a<LandingThemeProps & { $active?: boolean }>`
  display: block;
  padding: 0.75rem 1.25rem;
  font-size: 15px;
  font-weight: ${p => (p.$active ? 600 : 500)};
  color: ${p => (p.$active ? LANDING_FOREST : p.$C.fg)};
  text-decoration: none;
  border-left: 3px solid ${p => (p.$active ? LANDING_ACCENT : 'transparent')};
  background: ${p => (p.$active ? `${LANDING_ACCENT}10` : 'transparent')};
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
    align-items: center;
    height: 36px;
    padding-inline: 1rem !important;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    background: ${LANDING_ACCENT};
    border-color: ${LANDING_ACCENT};
    color: ${LANDING_FOREST};
    border-radius: 9999px;
    box-shadow: 0 2px 12px rgba(0, 230, 118, 0.32);
    transition:
      background 0.2s,
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.15s;

    &:hover {
      background: #00d96a !important;
      border-color: #00d96a !important;
      color: ${LANDING_FOREST} !important;
      box-shadow: 0 4px 16px rgba(0, 230, 118, 0.4) !important;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 230, 118, 0.28) !important;
    }
  }

  @media (min-width: 1024px) {
    &.ant-btn-primary {
      display: inline-flex;
      height: 38px;
      padding-inline: 1.35rem !important;
      font-size: 14px;
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
    height: 44px;
    font-weight: 600;
    background: ${LANDING_ACCENT};
    border-color: ${LANDING_ACCENT};
    color: ${LANDING_FOREST};
    border-radius: 9999px;
    box-shadow: 0 2px 12px rgba(0, 230, 118, 0.32);

    &:hover {
      background: #00d96a !important;
      border-color: #00d96a !important;
      color: ${LANDING_FOREST} !important;
    }
  }
`
