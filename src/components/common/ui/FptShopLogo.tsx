import Image from 'next/image'

interface Props {
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function FptShopLogo({ size = 18, className, style }: Props) {
  return (
    <Image
      src="/fpt.webp"
      alt="FPT Shop"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
