import { theme as antdTheme } from 'antd'

export const PRIMARY_COLOR = '#10a37f'

export const DARK_COLORS = {
  bgContainer: '#212121',
  bgElevated:  '#2f2f2f',
  bgLayout:    '#171717',
  siderBg:     '#171717',
  itemHoverBg: '#2a2a2a',
  itemSelBg:   '#2a2a2a',
  itemColor:   '#ececec',
} as const

export const LIGHT_COLORS = {
  bgContainer: '#ffffff',
  bgElevated:  '#f9f9f9',
  bgLayout:    '#f0f0f0',
  siderBg:     '#f9f9f9',
  itemHoverBg: '#f0f0f0',
  itemSelBg:   '#e6f4f1',
  itemColor:   '#333333',
} as const

export function buildAntTheme(isDark: boolean) {
  const c = isDark ? DARK_COLORS : LIGHT_COLORS
  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary:     PRIMARY_COLOR,
      borderRadius:     8,
      fontFamily:       'var(--font-sans), sans-serif',
      colorBgContainer: c.bgContainer,
      colorBgElevated:  c.bgElevated,
      colorBgLayout:    c.bgLayout,
    },
    components: {
      Layout: {
        siderBg:  c.siderBg,
        bodyBg:   c.bgContainer,
        headerBg: c.siderBg,
      },
      Menu: {
        itemBg:           'transparent',
        itemHoverBg:      c.itemHoverBg,
        itemSelectedBg:   c.itemSelBg,
        itemColor:        c.itemColor,
        itemSelectedColor: isDark ? '#ffffff' : PRIMARY_COLOR,
      },
    },
  }
}
