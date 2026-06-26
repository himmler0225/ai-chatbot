'use client'

import styled from 'styled-components'
import { Button } from 'antd'
import { motion } from 'framer-motion'
import { PRIM, LANDING_ACCENT, LANDING_FOREST } from '@/constants/brand'
import type { LandingThemeProps, LandingThemeWithModeProps } from '../shared/types'

export const HeroSectionRoot = styled.section`
  position: relative;
  overflow: hidden;
`

export const HeroRadarLayer = styled.div<{ $isDark: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`

export const HeroRadarMesh = styled.div<{ $isDark: boolean }>`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 90% 70% at 50% 72%, ${p => (p.$isDark ? `${PRIM}14` : `${PRIM}10`)} 0%, transparent 62%),
    radial-gradient(ellipse 55% 40% at 50% 38%, ${p => (p.$isDark ? `${PRIM}08` : `${PRIM}06`)} 0%, transparent 55%);
`

export const HeroRadarGrid = styled.div<{ $isDark: boolean }>`
  position: absolute;
  left: 50%;
  top: 72%;
  width: min(920px, 140vw);
  height: min(920px, 140vw);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  opacity: ${p => (p.$isDark ? 0.55 : 0.4)};
  background-image:
    radial-gradient(circle at center, ${PRIM}22 0%, transparent 48%),
    repeating-radial-gradient(
      circle at center,
      transparent 0,
      transparent 34px,
      ${PRIM}10 34px,
      ${PRIM}10 35px
    );
  mask-image: radial-gradient(circle at center, black 0%, black 42%, transparent 72%);
`

export const HeroRadarCrosshair = styled.div<{ $isDark: boolean }>`
  position: absolute;
  left: 50%;
  top: 72%;
  width: min(920px, 140vw);
  height: min(920px, 140vw);
  transform: translate(-50%, -50%);
  opacity: ${p => (p.$isDark ? 0.35 : 0.22)};

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: linear-gradient(90deg, transparent, ${PRIM}35, transparent);
  }

  &::before {
    top: 50%;
    left: 8%;
    right: 8%;
    height: 1px;
    transform: translateY(-50%);
  }

  &::after {
    left: 50%;
    top: 8%;
    bottom: 8%;
    width: 1px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, transparent, ${PRIM}35, transparent);
  }
`

export const HeroRadarCore = styled.div<{ $isDark: boolean }>`
  position: absolute;
  left: 50%;
  top: 72%;
  width: 7rem;
  height: 7rem;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  border: 2px solid ${PRIM}55;
  box-shadow:
    0 0 40px ${PRIM}35,
    inset 0 0 28px ${PRIM}18;
  animation: radar-glow-breathe 4s ease-in-out infinite;
`

export const HeroRadarPulse = styled.div<{ $delay: number; $duration: number }>`
  position: absolute;
  left: 50%;
  top: 72%;
  width: min(720px, 120vw);
  height: min(720px, 120vw);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  border: 1px solid ${PRIM}40;
  animation: radar-pulse ${p => p.$duration}s ease-out infinite;
  animation-delay: ${p => p.$delay}s;
`

export const HeroRadarPulseSlow = styled(HeroRadarPulse)`
  animation-name: radar-pulse-slow;
`

export const HeroRadarSweep = styled.div<{ $isDark: boolean; $length: number; $duration: number; $reverse?: boolean }>`
  position: absolute;
  left: 50%;
  top: 72%;
  width: 2px;
  height: ${p => p.$length}px;
  transform-origin: center bottom;
  transform: translate(-50%, -100%);
  background: linear-gradient(
    to top,
    ${p => (p.$isDark ? 'rgba(0, 229, 153, 0.75)' : 'rgba(0, 229, 153, 0.55)')},
    transparent
  );
  filter: blur(0.3px);
  opacity: ${p => (p.$reverse ? 0.45 : 1)};
  animation: radar-sweep ${p => p.$duration}s linear infinite;
  animation-direction: ${p => (p.$reverse ? 'reverse' : 'normal')};
`

export const HeroRadarSweepCone = styled.div<{ $duration: number }>`
  position: absolute;
  left: 50%;
  top: 72%;
  width: min(460px, 75vw);
  height: min(460px, 75vw);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    ${PRIM}00 280deg,
    ${PRIM}18 310deg,
    ${PRIM}28 330deg,
    ${PRIM}00 360deg
  );
  animation: radar-sweep-slow ${p => p.$duration}s linear infinite;
  mask-image: radial-gradient(circle at center, black 0%, black 35%, transparent 70%);
  opacity: 0.85;
`

export const HeroRadarVignette = styled.div<{ $isDark: boolean }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    ${p => (p.$isDark ? 'rgba(10,12,20,0.35)' : 'rgba(244,246,248,0.55)')} 0%,
    transparent 28%,
    transparent 72%,
    ${p => (p.$isDark ? 'rgba(10,12,20,0.5)' : 'rgba(244,246,248,0.75)')} 100%
  );
`

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`

export const HeroGlow = styled.div<{ $isDark: boolean }>`
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(720px, 95vw);
  height: min(420px, 55vw);
  border-radius: 9999px;
  pointer-events: none;
  background: radial-gradient(
    ellipse,
    ${p => (p.$isDark ? `${PRIM}16` : `${LANDING_ACCENT}22`)} 0%,
    transparent 68%
  );
`

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 1.75rem;
  letter-spacing: 0.025em;
  background: ${PRIM}10;
  border: 1px solid ${PRIM}30;
  color: ${PRIM};
`

export const HeroBadgeIcon = styled.span`
  font-size: 10px;
  color: ${PRIM};
`

export const HeroTitle = styled(motion.h1)<LandingThemeProps>`
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  padding: 0 0.25rem;
  font-size: clamp(28px, 8vw, 56px);
  color: ${p => p.$C.fg};

  @media (min-width: 640px) {
    margin-bottom: 1.5rem;
  }
`

export const HeroHighlight = styled.span`
  color: ${LANDING_ACCENT};
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 600;
`

export const DemoWrap = styled.div`
  position: relative;
  max-width: 640px;
  margin: 0 auto;
`

export const RealReviewsBadge = styled.span`
  position: absolute;
  top: -0.75rem;
  right: 0.5rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: #ffffff;
  border: 1px solid ${LANDING_ACCENT}55;
  color: ${LANDING_FOREST};
  box-shadow: 0 8px 24px rgba(0, 77, 64, 0.1);

  @media (min-width: 640px) {
    right: -0.5rem;
    top: -1rem;
  }
`

export const HeroDesc = styled(motion.p)<LandingThemeProps>`
  font-size: 15px;
  line-height: 1.65;
  margin: 0 auto 2rem;
  max-width: 560px;
  padding: 0 0.25rem;
  color: ${p => p.$C.muted};

  @media (min-width: 640px) {
    font-size: 17px;
    margin-bottom: 2.5rem;
  }
`

export const HeroActions = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 0 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 4rem;
  }
`

export const HeroCtaLink = styled.a`
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
`

export const HeroPrimaryButton = styled(Button)`
  &.ant-btn-primary {
    height: 48px;
    width: 100%;
    padding: 0 2rem;
    font-size: 15px;
    font-weight: 600;
    background: ${LANDING_ACCENT};
    border-color: ${LANDING_ACCENT};
    color: ${LANDING_FOREST};
    border-radius: 9999px;
    box-shadow: 0 4px 14px rgba(0, 230, 118, 0.35);

    &:hover {
      background: #00d96a !important;
      border-color: #00d96a !important;
      color: ${LANDING_FOREST} !important;
    }
  }

  @media (min-width: 640px) {
    &.ant-btn-primary {
      height: 50px;
      width: auto;
    }
  }
`

export const HeroSecondaryButton = styled(Button)`
  &.ant-btn {
    height: 48px;
    width: 100%;
    padding: 0 1.75rem;
    font-size: 15px;
    border-radius: 9999px;
    border-color: ${LANDING_FOREST}30;
    color: ${LANDING_FOREST};
    background: transparent;
  }

  @media (min-width: 640px) {
    &.ant-btn {
      height: 50px;
      width: auto;
    }
  }
`

export const ChatWindow = styled(motion.div)<LandingThemeWithModeProps>`
  border-radius: 1rem;
  overflow: hidden;
  text-align: left;
  width: 100%;
  margin: 0 auto;
  background: ${p => p.$C.card};
  border: 1px solid ${p => p.$C.border};
  box-shadow: ${p =>
    p.$isDark ? '0 24px 80px rgba(0,0,0,0.45)' : '0 24px 60px rgba(0,0,0,0.1)'};
`

export const ChatTitleBar = styled.div<LandingThemeWithModeProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 14px;
  background: ${p => (p.$isDark ? '#161a24' : '#f1f5f9')};
  border-bottom: 1px solid ${p => p.$C.border};
`

export const TrafficLights = styled.div`
  display: flex;
  gap: 6px;
`

export const TrafficDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background: ${p => p.$color};
`

export const ChatTitleCenter = styled.div<LandingThemeProps>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: ${p => p.$C.muted};
`

export const ChatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 22px 20px 20px;
`

export const UserRow = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const UserBubble = styled.div<{ $isDark: boolean }>`
  font-size: 0.875rem;
  max-width: 88%;
  line-height: 1.55;
  padding: 12px 16px;
  border-radius: 16px;
  background: ${p => (p.$isDark ? '#1a3d32' : '#d1fae5')};
  color: ${p => (p.$isDark ? '#e8fff5' : '#065f46')};
  border: 1px solid ${PRIM}25;
`

export const AiRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

export const AiAvatar = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${PRIM}15;
  border: 1px solid ${PRIM}30;
`

export const AiBubble = styled.div<LandingThemeProps>`
  font-size: 0.875rem;
  flex: 1;
  min-width: 0;
  line-height: 1.65;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${p => p.$C.card2};
  color: ${p => p.$C.muted};
  border: 1px solid ${p => p.$C.border};
`

export const AiText = styled.span<LandingThemeProps>`
  color: ${p => p.$C.fg};
`

export const TypingCursor = styled.span`
  animation: blink 1s infinite;
  margin-left: 2px;
  color: ${PRIM};
`

export const InsightBlock = styled(motion.div)`
  margin-top: 1rem;
`

export const InsightTitleIcon = styled.span`
  margin-right: 6px;
  color: ${PRIM};
`

export const InsightTitle = styled.div<LandingThemeProps>`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${p => p.$C.fg};
`

export const InsightQuote = styled.div<LandingThemeProps>`
  font-size: 12px;
  color: ${p => p.$C.muted};
`

export const ChatInputBar = styled.div<LandingThemeWithModeProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px 16px;
  border-top: 1px solid ${p => p.$C.border};
  background: ${p => (p.$isDark ? '#0e1018' : '#fafbfc')};
`

export const ChatInput = styled.div<LandingThemeProps>`
  flex: 1;
  font-size: 0.875rem;
  padding: 10px 16px;
  border-radius: 12px;
  background: ${p => p.$C.card2};
  color: ${p => p.$C.muted};
  border: 1px solid ${p => p.$C.border};
`

export const SendButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${PRIM};
  font-size: 14px;
  font-weight: 700;
  color: #0a0c14;
`

export const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  height: 24px;
`

export const TypingDot = styled(motion.span)`
  font-size: 8px;
  color: ${PRIM};
`
