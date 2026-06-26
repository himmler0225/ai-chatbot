'use client'

import { useEffect, useState } from 'react'

const NAV_OFFSET = 72

/** Tracks which `#section` anchor is currently in view on the landing page. */
export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = sectionIds
      .map(id => document.querySelector(id))
      .filter((el): el is HTMLElement => el instanceof HTMLElement)

    if (!sections.length) return

    const update = () => {
      const marker = window.scrollY + NAV_OFFSET
      const ordered = [...sections].sort((a, b) => a.offsetTop - b.offsetTop)
      let current = ordered[0] ? `#${ordered[0].id}` : null

      for (const el of ordered) {
        if (el.offsetTop <= marker) {
          current = `#${el.id}`
        }
      }

      setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionIds.join('|')])

  return activeId
}
