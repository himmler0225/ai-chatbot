'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, onScroll, stagger, type JSAnimation, type TargetsParam } from 'animejs'

interface ChildrenProps {
  children: ReactNode
  className?: string
}

function runScrollReveal(
  targets: TargetsParam,
  scrollTarget: HTMLElement,
  options?: { delay?: number; staggerMs?: number; duration?: number; slide?: boolean },
): JSAnimation {
  const { delay = 0, staggerMs, duration = 560, slide = true } = options ?? {}

  return animate(targets, {
    ...(slide ? { y: [28, 0] } : {}),
    opacity: [0, 1],
    duration,
    ease: 'out(3)',
    delay: staggerMs ? stagger(staggerMs, { start: delay }) : delay,
    autoplay: onScroll({
      target: scrollTarget,
      enter: 'bottom top-=12%',
      repeat: false,
    }),
  })
}

export function Reveal({ children, delay = 0, className }: ChildrenProps & { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const anim = runScrollReveal(el, el, { delay })
    return () => { anim.revert() }
  }, [delay])

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}

export function Stagger({ children, className = '', staggerMs = 100 }: ChildrenProps & { staggerMs?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const items = root.querySelectorAll('[data-anime-stagger]')
    if (!items.length) return

    const anim = runScrollReveal(items, root, { staggerMs, slide: false })
    const cleanups: (() => void)[] = []
    const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

    if (canHover) {
      items.forEach(item => {
        const el = item as HTMLElement
        const onEnter = () => animate(el, { y: -4, duration: 220, ease: 'out(2)' })
        const onLeave = () => animate(el, { y: 0, duration: 220, ease: 'out(2)' })
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mouseleave', onLeave)
        })
      })
    }

    return () => {
      anim.revert()
      cleanups.forEach(fn => fn())
    }
  }, [staggerMs])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function StaggerItem({ children, className = '' }: ChildrenProps) {
  return (
    <div data-anime-stagger className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
