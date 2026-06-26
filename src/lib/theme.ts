import type { ThemeConfig } from 'antd'
import { theme } from 'antd'
import { PRIM } from '@/constants/brand'

/** ChatGPT-like dark palette */
export const CHAT_DARK = {
  bg: '#0d0d0d',
  sidebar: '#171717',
  elevated: '#212121',
  input: '#2f2f2f',
  border: '#2f2f2f',
  borderSubtle: '#424242',
  text: '#ececec',
  textMuted: '#b4b4b4',
} as const

const TOKEN: ThemeConfig['token'] = {
  colorPrimary: PRIM,
  colorLink: PRIM,
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',

  fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif',
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
  colorBgBase: CHAT_DARK.bg,
  colorBgContainer: CHAT_DARK.elevated,
  colorBgElevated: CHAT_DARK.input,
  colorBgSpotlight: '#424242',
  colorBgLayout: CHAT_DARK.bg,
  colorBorder: CHAT_DARK.borderSubtle,
  colorBorderSecondary: CHAT_DARK.border,
  colorText: CHAT_DARK.text,
  colorTextSecondary: CHAT_DARK.textMuted,
  colorTextTertiary: '#8e8e8e',
  colorFillSecondary: '#2f2f2f',
  colorFillTertiary: '#424242',
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
    components: isDark
      ? {
          ...COMPONENTS,
          Layout: {
            siderBg: CHAT_DARK.sidebar,
            bodyBg: CHAT_DARK.bg,
            headerBg: CHAT_DARK.bg,
          },
          Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: CHAT_DARK.input,
            darkItemHoverBg: CHAT_DARK.input,
            itemBg: 'transparent',
            itemSelectedBg: CHAT_DARK.input,
            itemHoverBg: CHAT_DARK.input,
            itemBorderRadius: 8,
          },
          Button: {
            ...COMPONENTS.Button,
            defaultBg: CHAT_DARK.elevated,
            defaultBorderColor: CHAT_DARK.border,
            defaultColor: CHAT_DARK.text,
          },
        }
      : {
          ...COMPONENTS,
          Layout: {
            siderBg: '#ffffff',
            bodyBg: '#f5f5f5',
            headerBg: '#ffffff',
          },
        },
  }
}

/** Admin console is always dark — independent of chat light/dark toggle. */
export function getAdminAntdTheme(): ThemeConfig {
  const base = getAntdTheme(true)
  return {
    ...base,
    token: {
      ...base.token,
      colorText: '#f0f4f8',
      colorTextSecondary: '#b8c4d4',
      colorTextTertiary: '#8b95a8',
      colorTextQuaternary: '#6b7689',
      colorBgContainer: '#111820',
      colorBgElevated: '#161a24',
      colorBorder: '#2a3344',
      colorBorderSecondary: '#1e2330',
    },
    components: {
      ...base.components,
      Input: {
        colorBgContainer: '#161a24',
        colorText: '#f0f4f8',
        colorTextPlaceholder: '#8b95a8',
        colorBorder: '#2a3344',
        hoverBorderColor: '#3d4a5c',
        activeBorderColor: PRIM,
      },
      Tabs: {
        colorText: '#b8c4d4',
        itemSelectedColor: PRIM,
        itemHoverColor: '#f0f4f8',
        inkBarColor: PRIM,
      },
      Form: {
        labelColor: '#b8c4d4',
      },
      Card: {
        colorBgContainer: '#111820',
        colorBorderSecondary: '#1e2330',
        colorTextHeading: '#f0f4f8',
      },
      Alert: {
        colorWarningBg: '#1a1508',
        colorWarningBorder: '#594214',
        colorText: '#f0f4f8',
      },
      Statistic: {
        colorTextDescription: '#b8c4d4',
      },
    },
  }
}
