'use client'

import { Button, Flex, Grid, Tooltip, Typography } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { theme } from 'antd'
import '@/i18n/config'
import { useTheme } from '@/contexts/theme'
import { LocaleDropdown } from '@/components/common/ui/LocaleDropdown'
import { APP_NAME } from '@/constants/brand'
import { CHAT_DARK } from '@/lib/theme'

const { Text } = Typography
const { useBreakpoint } = Grid

interface Props {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function ChatHeader({ sidebarOpen, onToggleSidebar }: Props) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const showHeaderToggle = isMobile || !sidebarOpen

  const toggleBtn = (
    <Button
      type="text"
      size="small"
      icon={sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      onClick={onToggleSidebar}
      aria-label={sidebarOpen ? t('chat.hideSidebar') : t('chat.showSidebar')}
      style={{ color: token.colorTextSecondary, flexShrink: 0 }}
    />
  )

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        flexShrink: 0,
        paddingTop: 20,
        paddingBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
        background: isDark ? CHAT_DARK.bg : token.colorBgLayout,
      }}
    >
      <Flex align="center" gap={8} style={{ minWidth: 0, flex: 1 }}>
        {showHeaderToggle && (
          isMobile ? toggleBtn : (
            <Tooltip destroyOnHidden title={t('chat.showSidebar')}>
              {toggleBtn}
            </Tooltip>
          )
        )}
        <Text
          strong
          style={{
            fontSize: 15,
            letterSpacing: '-0.01em',
            color: token.colorText,
            lineHeight: 1,
            margin: 0,
          }}
          className="truncate"
        >
          {APP_NAME}
        </Text>
      </Flex>

      <Flex gap={4} align="center" style={{ flexShrink: 0 }}>
        <LocaleDropdown buttonStyle={{ color: token.colorTextSecondary }} />
        <Tooltip title={isDark ? t('theme.light') : t('theme.dark')}>
          <Button
            type="text"
            size="small"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ color: token.colorTextSecondary }}
          />
        </Tooltip>
      </Flex>
    </Flex>
  )
}
