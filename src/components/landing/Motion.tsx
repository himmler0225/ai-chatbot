'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE } from '@/src/constants/brand'

interface ChildrenProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Reveal({ children, delay = 0 }: ChildrenProps & { delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0 })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className = '', style }: ChildrenProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0 })
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', style }: ChildrenProps) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  )
}
