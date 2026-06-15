import Image from 'next/image'
import { APP_NAME } from '@/src/constants/brand'

interface Props {
  size?: number
}

export function Logo({ size = 36 }: Props) {
  return (
    <Image
      src="/logo.png"
      alt={APP_NAME}
      width={size}
      height={size}
      style={{ borderRadius: size * 0.25, objectFit: 'cover', width: size, height: size }}
    />
  )
}
