'use client'
import { Flex, Typography } from 'antd'
import { motion } from 'framer-motion'
import { useTheme } from '@/src/context/theme'
import { useColors } from '@/src/components/landing/useColors'
import { Logo } from '@/src/components/ui/Logo'
import { APP_NAME, PRIM } from '@/src/constants/brand'

const { Text } = Typography

export function PageLoader() {
  const { isDark } = useTheme()
  const C = useColors(isDark)

  return (
    <Flex align="center" justify="center" style={{ height: '100vh', background: C.bg }}>
      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [1, 0.75, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <Logo size={72} />
        </motion.div>

        <Flex gap={10} align="center">
          {[0, 0.18, 0.36].map((delay, i) => (
            <motion.div
              key={i}
              style={{ width: 8, height: 8, borderRadius: '50%', background: PRIM }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.75, delay, ease: 'easeInOut' }}
            />
          ))}
        </Flex>

        <Text style={{ color: C.muted, fontSize: 13, letterSpacing: '0.02em' }}>{APP_NAME}</Text>
      </motion.div>
    </Flex>
  )
}
