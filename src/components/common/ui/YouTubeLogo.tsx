'use client'

import Image from 'next/image'
import { useTheme } from '@/contexts/theme'

interface Props {
  size?: number
  className?: string
  style?: React.CSSProperties
}

const imageStyle = (height: number, style?: React.CSSProperties): React.CSSProperties => ({
  width: 'auto',
  height,
  minHeight: height,
  maxHeight: height,
  objectFit: 'contain',
  display: 'inline-block',
  verticalAlign: '-0.12em',
  flexShrink: 0,
  ...style,
})

const textStyle = (color: string, style?: React.CSSProperties): React.CSSProperties => {
  const { verticalAlign: _va, lineHeight: _lh, ...rest } = style ?? {}
  return {
    display: 'inline',
    fontSize: '1em',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 'inherit',
    verticalAlign: 'baseline',
    color,
    ...rest,
  }
}

export function YouTubeLogo({ size = 18, className, style }: Props) {
  const { isDark } = useTheme()

  if (isDark) {
    return (
      <span className={className} style={textStyle('#ff4d4f', style)}>
        YouTube
      </span>
    )
  }

  const height = Math.round(size * 1.1)
  return (
    <Image
      src="/youtube.png"
      alt="YouTube"
      width={height * 2}
      height={height}
      className={className}
      style={imageStyle(height, style)}
    />
  )
}
