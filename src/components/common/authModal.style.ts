'use client'

import styled from 'styled-components'
import { PRIM } from '@/constants/brand'
import { getModalColors } from '@/constants/brand'

export const AuthAccent = styled.div`
  height: 3px;
  background: linear-gradient(90deg, transparent, ${PRIM}, transparent);
`

export const AuthBody = styled.div`
  padding: 28px 28px 24px;
`

export const AuthHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
`

export const AuthBrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const AuthTitle = styled.h2<{ $isDark: boolean }>`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${p => getModalColors(p.$isDark).fg};
  text-align: center;
`

export const AuthSubtitle = styled.p<{ $isDark: boolean }>`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${p => getModalColors(p.$isDark).muted};
  text-align: center;
`

export const ModeSwitch = styled.div<{ $isDark: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  margin-bottom: 22px;
  border-radius: 12px;
  background: ${p => getModalColors(p.$isDark).input};
  border: 1px solid ${p => getModalColors(p.$isDark).border};
`

export const ModeButton = styled.button<{ $active: boolean; $isDark: boolean }>`
  border: none;
  border-radius: 9px;
  height: 38px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${p => (p.$active ? (p.$isDark ? '#0a0c14' : '#0a0c14') : getModalColors(p.$isDark).muted)};
  background: ${p => (p.$active ? PRIM : 'transparent')};
  box-shadow: ${p => (p.$active ? `0 4px 14px ${PRIM}35` : 'none')};

  &:hover {
    color: ${p => (p.$active ? '#0a0c14' : getModalColors(p.$isDark).fg)};
  }
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`

export const ErrorBox = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: #ff6b6b;
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.22);
`

export const OrRow = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0 16px;
  color: ${p => getModalColors(p.$isDark).muted};
  font-size: 12px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${p => getModalColors(p.$isDark).border};
  }
`

export const SwitchHint = styled.p<{ $isDark: boolean }>`
  margin: 18px 0 0;
  text-align: center;
  font-size: 13px;
  color: ${p => getModalColors(p.$isDark).muted};
`

export const SwitchLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin-left: 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${PRIM};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const SuccessBody = styled.div`
  padding: 40px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`

export const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${PRIM}18;
  border: 1px solid ${PRIM}35;
  color: ${PRIM};
  font-size: 30px;
`

export const GoogleBtn = styled.button<{ $isDark: boolean; $loading?: boolean }>`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 1px solid ${p => getModalColors(p.$isDark).border};
  background: ${p => getModalColors(p.$isDark).input};
  color: ${p => getModalColors(p.$isDark).fg};
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: ${p => (p.$loading ? 'wait' : 'pointer')};
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${PRIM}55;
    background: ${p => (p.$isDark ? '#1a1f2b' : '#f3f4f6')};
  }

  &:disabled {
    opacity: 0.7;
  }
`
