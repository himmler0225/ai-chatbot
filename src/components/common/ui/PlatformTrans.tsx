'use client'

import { Trans } from 'react-i18next'
import { YouTubeLogo } from '@/components/common/ui/YouTubeLogo'
import { TikTokLogo } from '@/components/common/ui/TikTokLogo'

interface Props {
  i18nKey: string
  size?: number
  values?: Record<string, unknown>
}

export function PlatformTrans({ i18nKey, size = 18, values }: Props) {
  return (
    <Trans
      i18nKey={i18nKey}
      values={values}
      components={{
        yt: <YouTubeLogo size={size} style={{ marginInline: 4 }} />,
        tt: <TikTokLogo size={size} style={{ marginInline: 4 }} />,
      }}
    />
  )
}

interface InlineProps {
  text: string
  size?: number
}

/** Render plain i18n string that may contain <yt/> and <tt/> tags */
export function PlatformInline({ text, size = 18 }: InlineProps) {
  return (
    <Trans
      defaults={text}
      components={{
        yt: <YouTubeLogo size={size} style={{ marginInline: 4 }} />,
        tt: <TikTokLogo size={size} style={{ marginInline: 4 }} />,
      }}
    />
  )
}
