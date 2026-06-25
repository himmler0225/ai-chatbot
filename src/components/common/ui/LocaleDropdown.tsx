'use client'
import Image from 'next/image'
import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/contexts/theme'

const FLAG = {
  vi: { src: '/vietnam.webp', label: 'Tiếng Việt' },
  en: { src: '/eng.svg', label: 'English' },
} as const

interface Props {
  buttonStyle?: React.CSSProperties
}

export function LocaleDropdown({ buttonStyle }: Props) {
  const { t } = useTranslation()
  const { locale, toggleLocale } = useLocale()
  const current = FLAG[locale as keyof typeof FLAG] ?? FLAG.vi

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectedKeys: [locale],
        items: Object.entries(FLAG).map(([key, { src, label }]) => ({
          key,
          label,
          icon: (
            <Image
              src={src}
              alt={key}
              width={16}
              height={12}
              style={{ objectFit: 'cover', borderRadius: 2 }}
            />
          ),
        })),
        onClick: ({ key }) => {
          if (key !== locale) toggleLocale()
        },
      }}
    >
      <Button
        type="text"
        size="small"
        title={t('lang.toggle')}
        style={{ padding: '4px 6px', height: 30, ...buttonStyle }}
      >
        <Image
          src={current.src}
          alt={locale}
          width={22}
          height={16}
          style={{ width: 22, height: 'auto', objectFit: 'cover', borderRadius: 3, display: 'block' }}
        />
      </Button>
    </Dropdown>
  )
}
