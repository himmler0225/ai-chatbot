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
          <Skeleton.Button active block style={{ height: 36, borderRadius: 8, marginBottom: 16 }} />
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
          gap={10}
          style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            flexShrink: 0,
          }}
        >
          {isMobile && (
            <Skeleton.Avatar active size={32} shape="square" style={{ borderRadius: 6 }} />
          )}
          <Skeleton.Avatar
            active
            size={52}
            shape="square"
            style={{ borderRadius: 10, flexShrink: 0 }}
          />
          <Skeleton.Input active style={{ width: 160, height: 20, borderRadius: 6 }} />
          <Flex gap={8} style={{ marginLeft: 'auto' }}>
            <Skeleton.Avatar active size={28} shape="circle" />
            <Skeleton.Avatar active size={28} shape="circle" />
            <Skeleton.Avatar active size={32} shape="circle" />
          </Flex>
        </Flex>

        <div className="flex-1 flex flex-col gap-5 px-10 py-6 overflow-y-hidden">
          <div className="max-w-[760px] w-full mx-auto flex flex-col gap-5">
            <Flex align="flex-start" gap={12}>
              <Skeleton.Avatar active size={36} />
              <div className="flex-1 max-w-[70%]">
                <Skeleton active paragraph={{ rows: 2 }} title={false} style={{ margin: 0 }} />
              </div>
            </Flex>

            <Flex justify="flex-end">
              <Skeleton.Input active style={{ width: 260, height: 44, borderRadius: 16 }} />
            </Flex>

            <Flex align="flex-start" gap={12}>
              <Skeleton.Avatar active size={36} />
              <div className="flex-1 max-w-[80%]">
                <Skeleton active paragraph={{ rows: 4 }} title={false} style={{ margin: 0 }} />
              </div>
            </Flex>

            <Flex justify="flex-end">
              <Skeleton.Input active style={{ width: 200, height: 44, borderRadius: 16 }} />
            </Flex>
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
