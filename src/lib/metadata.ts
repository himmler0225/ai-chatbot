import type { Metadata } from 'next'
import vi from '@/i18n/locales/vi.json'
import en from '@/i18n/locales/en.json'

type MetaCopy = {
  title: string
  description: string
  titleTemplate: string
  adminTitle: string
}

const ICONS: Metadata['icons'] = {
  icon: [{ url: '/logo.png', type: 'image/png' }],
  apple: '/logo.png',
}

function buildRootMetadata(meta: MetaCopy, locale: 'vi' | 'en'): Metadata {
  return {
    title: {
      default: meta.title,
      template: meta.titleTemplate,
    },
    description: meta.description,
    icons: ICONS,
    alternates: {
      canonical: '/',
      languages: {
        'vi-VN': '/',
        'en-US': '/?lang=en',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
    },
  }
}

/** Default SEO metadata (vi — matches i18n defaultLng). */
export const rootMetadata: Metadata = buildRootMetadata(vi.meta, 'vi')

export function buildAdminMetadata(meta: MetaCopy = vi.meta): Metadata {
  return {
    title: meta.adminTitle,
    description: meta.description,
    icons: ICONS,
    robots: { index: false, follow: false },
  }
}

export const adminMetadata: Metadata = buildAdminMetadata(vi.meta)

/** English alternate copy for future locale-aware generateMetadata. */
export const rootMetadataEn: Metadata = buildRootMetadata(en.meta, 'en')
