'use client'
import { Flex, Grid, Layout, Skeleton } from 'antd'
import { theme } from 'antd'

const { Sider, Content } = Layout
const { useBreakpoint } = Grid

export function ChatSkeleton() {
  const { token } = theme.useToken()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  return (
    <Layout className="h-screen overflow-hidden">
      {!isMobile && (
        <Sider
          width={260}
          style={{
            height: '100vh',
            overflow: 'hidden',
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            padding: '16px 12px',
          }}
        >
          <Skeleton.Button active block style={{ height: 40, borderRadius: 10, marginBottom: 12 }} />
          <Skeleton.Input active size="small" style={{ width: 80, height: 12, marginBottom: 8, marginLeft: 10 }} />
          <Skeleton.Button active block style={{ height: 36, borderRadius: 10, marginBottom: 16 }} />
          <Skeleton.Input active size="small" style={{ width: 70, height: 12, margin: '12px 0 8px 10px' }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Flex key={i} align="center" gap={8} style={{ marginBottom: 10 }}>
              <Skeleton.Avatar
                active
                size={16}
                shape="square"
                style={{ borderRadius: 3, flexShrink: 0 }}
              />
              <Skeleton.Input
                active
                size="small"
                style={{ flex: 1, height: 16, borderRadius: 4 }}
              />
            </Flex>
          ))}
        </Sider>
      )}

      <Content
        style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
      >
        <Flex
          align="center"
          justify="space-between"
          gap={10}
          style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            flexShrink: 0,
          }}
        >
          <Flex gap={8} align="center">
            <Skeleton.Avatar active size={32} shape="square" style={{ borderRadius: 6 }} />
            <Skeleton.Input active style={{ width: 120, height: 18, borderRadius: 4 }} />
          </Flex>

          <Flex gap={8}>
            <Skeleton.Avatar active size={28} shape="circle" />
            <Skeleton.Avatar active size={28} shape="circle" />
            <Skeleton.Avatar active size={32} shape="circle" />
          </Flex>
        </Flex>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 overflow-y-hidden" style={{ paddingBottom: '12vh' }}>
          <Skeleton.Avatar active size={52} shape="square" style={{ borderRadius: 26 }} />
          <Skeleton.Input active style={{ width: 280, height: 32, borderRadius: 8 }} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 10,
              width: '100%',
              maxWidth: 640,
            }}
          >
            <Skeleton.Button active style={{ height: 44, borderRadius: 24 }} />
            <Skeleton.Button active style={{ height: 44, borderRadius: 24 }} />
            <Skeleton.Button active style={{ height: 44, borderRadius: 24 }} />
          </div>
        </div>

        <Flex
          align="center"
          gap={8}
          style={{
            padding: '16px 24px 20px',
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            flexShrink: 0,
          }}
        >
          <div className="max-w-[760px] w-full mx-auto">
            <Skeleton.Input active block style={{ height: 52, borderRadius: 24 }} />
          </div>
        </Flex>
      </Content>
    </Layout>
  )
}
