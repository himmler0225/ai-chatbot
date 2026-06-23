import Image from 'next/image'

interface Props {
  size?: number
  /** compact = chỉ phần FPT; full = cả wordmark; auto = compact khi size ≤ 52 */
  variant?: 'auto' | 'compact' | 'full'
  className?: string
  style?: React.CSSProperties
}

export function FptShopLogo({ size = 18, variant = 'auto', className, style }: Props) {
  const compact = variant === 'compact' || (variant === 'auto' && size <= 52)

  if (compact) {
    const w = Math.round(size * 1.35)
    return (
      <span
        className={className}
        aria-label="FPT Shop"
        style={{
          display: 'inline-block',
          width: w,
          height: size,
          overflow: 'hidden',
          flexShrink: 0,
          verticalAlign: 'middle',
          ...style,
        }}
      >
        <Image
          src="/fpt.png"
          alt="FPT Shop"
          width={w}
          height={Math.round(size * 2.5)}
          priority={size >= 36}
          style={{
            width: w,
            height: 'auto',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
        />
      </span>
    )
  }

  const w = Math.round(size * 2.1)
  return (
    <Image
      src="/fpt.png"
      alt="FPT Shop"
      width={w}
      height={size}
      className={className}
      style={{
        width: w,
        height: size,
        objectFit: 'contain',
        objectPosition: 'left center',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
