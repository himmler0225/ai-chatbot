'use client'

import { Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/contexts/theme'
import { LOCALES, normalizeLocale, type AppLocale } from '@/i18n/locale'

interface Props {
  buttonStyle?: React.CSSProperties
}

export function LocaleDropdown({ buttonStyle }: Props) {
  const { t, i18n } = useTranslation()
  const { setLocale } = useLocale()
  const locale = normalizeLocale(i18n.language)

  const labelFor = (key: AppLocale) =>
    key === 'vi' ? t('lang.vi') : t('lang.en')

  return (
    <Dropdown
      key={locale}
      trigger={['click']}
      menu={{
        selectedKeys: [locale],
        items: LOCALES.map(key => ({
          key,
          label: labelFor(key),
        })),
        onClick: ({ key }) => setLocale(key as AppLocale),
      }}
    >
      <Button
        type="text"
        size="small"
        title={t('lang.toggle')}
        style={{
          padding: '4px 8px',
          height: 30,
          fontSize: 13,
          fontWeight: 500,
          minWidth: 32,
          ...buttonStyle,
        }}
      >
        {locale === 'vi' ? 'VI' : 'EN'}
      </Button>
    </Dropdown>
  )
}
