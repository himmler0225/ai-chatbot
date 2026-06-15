import type { ThemeConfig } from 'antd'
import { theme } from 'antd'
import { PRIM } from '@/src/constants/brand'

const TOKEN: ThemeConfig['token'] = {
  colorPrimary: PRIM,
  colorLink: PRIM,
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',

  fontFamily: 'var(--font-sans), -apple-system, sans-serif',
  fontFamilyCode: 'var(--font-mono), "JetBrains Mono", monospace',
  fontSize: 14,

  borderRadius: 8,
  borderRadiusLG: 12,
  borderRadiusSM: 6,
  borderRadiusXS: 4,

  wireframe: false,
}

const DARK_TOKEN: ThemeConfig['token'] = {
  ...TOKEN,
  colorBgBase: '#0a0a0a',
  colorBgContainer: '#141414',
  colorBgElevated: '#1a1a1a',
  colorBgSpotlight: '#242424',
  colorBgLayout: '#0d0d0d',
  colorBorder: '#303030',
  colorBorderSecondary: '#242424',
}

const COMPONENTS: ThemeConfig['components'] = {
  Button: { borderRadius: 8, borderRadiusLG: 10, borderRadiusSM: 6 },
  Input: { borderRadius: 8 },
  Select: { borderRadius: 8 },
  Modal: { borderRadius: 16 },
  Card: { borderRadius: 12 },
  Dropdown: { borderRadius: 10 },
  Menu: { borderRadius: 8 },
  Table: { borderRadius: 8 },
  Tag: { borderRadius: 6 },
}

export function getAntdTheme(isDark: boolean): ThemeConfig {
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: isDark ? DARK_TOKEN : TOKEN,
    components: {
      ...COMPONENTS,
      Layout: {
        siderBg:  isDark ? '#141414' : '#ffffff',
        bodyBg:   isDark ? '#0d0d0d' : '#f5f5f5',
        headerBg: isDark ? '#141414' : '#ffffff',
      },
    },
  }
}
