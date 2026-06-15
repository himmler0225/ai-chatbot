'use client'
import { PRIM } from '@/src/constants/brand'
import { Reveal } from '@/src/components/landing/Motion'

export function SectionLabel({ text }: { text: string }) {
  return (
    <Reveal>
      <span
        className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
        style={{ background: `${PRIM}15`, border: `1px solid ${PRIM}40`, color: PRIM }}
      >
        {text}
      </span>
    </Reveal>
  )
}

export function Badge({ label }: { label: string }) {
  return (
    <span
      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
      style={{ background: `${PRIM}18`, color: PRIM, border: `1px solid ${PRIM}35` }}
    >
      {label}
    </span>
  )
}
