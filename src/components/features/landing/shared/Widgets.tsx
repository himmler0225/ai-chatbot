'use client'

import { PRIM } from '@/constants/brand'
import { Reveal } from './Motion'
import { BadgePill, LabelPill, LabelWrap } from './widgets.style'

export function SectionLabel({ text }: { text: string }) {
  return (
    <Reveal>
      <LabelWrap>
        <LabelPill>{text}</LabelPill>
      </LabelWrap>
    </Reveal>
  )
}

export function Badge({ label }: { label: string }) {
  return <BadgePill>{label}</BadgePill>
}

export { PRIM }
