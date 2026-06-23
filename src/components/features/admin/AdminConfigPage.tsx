'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Flex, Form, Input, Tabs, Typography, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { adminFetch } from '@/lib/admin/client'
import { ADMIN_CONFIG_GROUPS } from '@/lib/admin/config-keys'
import { AdminHeader } from '@/components/features/admin/AdminHeader'
import { AdminPageBody } from '@/components/features/admin/AdminPageBody'
import { AdminConfigSkeleton } from '@/components/features/admin/AdminSkeletons'
import { useAdminConfigStore } from '@/stores/adminConfigStore'
import { PRIM } from '@/constants/brand'

const { TextArea } = Input
const { Text } = Typography

type ConfigRes = {
  success: boolean
  data: {
    config: Record<string, string>
    meta: { longTextKeys: string[]; jsonKeys: string[] }
  }
}

export function AdminConfigPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { draft, dirty, setKey, resetDraft } = useAdminConfigStore()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'config'],
    queryFn: () => adminFetch<ConfigRes>('/api/admin/config'),
  })

  const config = useMemo(() => {
    const base = data?.data?.config ?? {}
    return dirty ? { ...base, ...draft } : base
  }, [data, draft, dirty])

  const longText = new Set(data?.data?.meta?.longTextKeys ?? [])
  const jsonKeys = new Set(data?.data?.meta?.jsonKeys ?? [])

  const saveMut = useMutation({
    mutationFn: () =>
      adminFetch<{ message?: string }>('/api/admin/config', {
        method: 'PATCH',
        json: { updates: draft },
      }),
    onSuccess: (res: { message?: string }) => {
      message.success(res?.message ?? t('admin.config.saved'))
      resetDraft()
      qc.invalidateQueries({ queryKey: ['admin', 'config'] })
    },
    onError: (e: Error) => message.error(e.message),
  })

  const tabItems = Object.entries(ADMIN_CONFIG_GROUPS).map(([group, keys]) => ({
    key: group,
    label: t(`admin.config.tabs.${group}`, { defaultValue: group }),
    children: (
      <Form layout="vertical" className="max-w-3xl w-full">
        {keys.map(key => (
          <Form.Item
            key={key}
            label={
              <Text code style={{ color: PRIM, fontSize: 12 }}>
                {key}
              </Text>
            }
            extra={jsonKeys.has(key) ? t('admin.config.jsonHint') : undefined}
          >
            {longText.has(key) ? (
              <TextArea
                rows={12}
                value={config[key] ?? ''}
                placeholder={t('admin.config.emptyPlaceholder')}
                onChange={e => setKey(key, e.target.value)}
                className="font-mono text-sm"
              />
            ) : (
              <Input
                value={config[key] ?? ''}
                placeholder={t('admin.config.emptyPlaceholder')}
                onChange={e => setKey(key, e.target.value)}
                className="font-mono text-sm"
              />
            )}
          </Form.Item>
        ))}
      </Form>
    ),
  }))

  return (
    <>
      <AdminHeader titleKey="admin.config.title" subtitleKey="admin.config.subtitle" />
      <AdminPageBody>
        <Flex
          gap={12}
          align="flex-start"
          justify="space-between"
          wrap="wrap"
          className="mb-6"
        >
          <Alert
            type="warning"
            showIcon
            message={t('admin.config.restartWarning')}
            className="flex-1 min-w-[min(100%,280px)] !mb-0"
          />
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saveMut.isPending}
            disabled={!dirty || isLoading}
            onClick={() => saveMut.mutate()}
            className="w-full sm:w-auto shrink-0"
            style={{ background: PRIM, borderColor: PRIM, color: '#0a0c10' }}
          >
            {t('admin.config.save')}
          </Button>
        </Flex>

        {isLoading ? (
          <AdminConfigSkeleton />
        ) : (
          <Tabs items={tabItems} className="admin-tabs" />
        )}
      </AdminPageBody>
    </>
  )
}
