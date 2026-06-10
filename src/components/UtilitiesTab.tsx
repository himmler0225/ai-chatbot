'use client'

import { Card, Space, Tabs } from 'antd'
import { LinkOutlined, QrcodeOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import URLShortener from './utilities/URLShortener'
import QRGenerator  from './utilities/QRGenerator'
import '@/src/i18n/config'

export default function UtilitiesTab() {
  const { t } = useTranslation()

  return (
    <div className='px-20 py-24' style={{ maxWidth: 620, margin: '0 auto' }}>
      <Tabs size="large" defaultActiveKey="shorten" items={[
        {
          key:      'shorten',
          label:    <Space size={6}><LinkOutlined />{t('utilities.shortener.tabLabel')}</Space>,
          children: <Card style={{ borderRadius: 12, marginTop: 4 }}><URLShortener /></Card>,
        },
        {
          key:      'qr',
          label:    <Space size={6}><QrcodeOutlined />{t('utilities.qr.tabLabel')}</Space>,
          children: <Card style={{ borderRadius: 12, marginTop: 4 }}><QRGenerator /></Card>,
        },
      ]} />
    </div>
  )
}
