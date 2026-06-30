'use client'

import type { ReactNode } from 'react'
import { Breadcrumb, Flex, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useAdminColors } from '@/constants/admin-theme'
import { AdminTopBar } from './AdminTopBar'

const { Title, Text } = Typography

type Props = {
  breadcrumbs: string[]
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  wide?: boolean
}

export function AdminPageLayout({ breadcrumbs, title, description, actions, children, wide }: Props) {
  const c = useAdminColors()

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      <AdminTopBar />
      <div className="flex-1 overflow-y-auto admin-page-scroll" style={{ background: c.bg }}>
        <div
          className={`px-5 md:px-8 py-6 md:py-8 w-full ${wide ? 'max-w-[1440px]' : 'max-w-[1200px]'} mx-auto`}
        >
          <Breadcrumb
            separator={<RightOutlined style={{ fontSize: 10, color: c.textSubtle }} />}
            className="mb-4"
            items={breadcrumbs.map(label => ({
              title: <span style={{ color: c.textMuted, fontSize: 13 }}>{label}</span>,
            }))}
          />

          <Flex
            justify="space-between"
            align="flex-start"
            wrap="wrap"
            gap={16}
            className="mb-8"
          >
            <div className="min-w-0 max-w-2xl">
              <Title level={2} className="!m-0 !mb-2 !font-bold" style={{ color: c.text }}>
                {title}
              </Title>
              {description && (
                <Text style={{ color: c.textMuted, fontSize: 15 }} className="block">
                  {description}
                </Text>
              )}
            </div>
            {actions && (
              <Flex gap={10} wrap="wrap" className="shrink-0">
                {actions}
              </Flex>
            )}
          </Flex>

          {children}
        </div>
      </div>
    </div>
  )
}
