'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Form, Input, Tabs, Typography, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { adminFetch } from '@/lib/admin/client'
import { ADMIN_CONFIG_GROUPS } from '@/lib/admin/config-keys'
import { AdminPageLayout } from '@/components/features/admin/AdminPageLayout'
import { AdminConfigSkeleton } from '@/components/features/admin/AdminSkeletons'
import { useAdminConfigStore } from '@/stores/adminConfigStore'
import { useAdminColors } from '@/constants/admin-theme'

const { TextArea } = Input
const { Text } = Typography

type ConfigRes = {
  success: boolean
  data: {
    config: Record<string, string>
    devMode?: boolean
    meta: { longTextKeys: string[]; jsonKeys: string[] }
  }
}

export function AdminConfigPage() {
  const { t } = useTranslation()
  const c = useAdminColors()
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
              <Text code style={{ color: c.accent, fontSize: 12 }}>
                {key}
              </Text>
            }
            extra={jsonKeys.has(key) ? t('admin.config.jsonHint') : undefined}
          >
            {longText.has(key) || jsonKeys.has(key) ? (
              <TextArea
                rows={jsonKeys.has(key) ? 16 : 12}
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
    <AdminPageLayout
      breadcrumbs={[t('admin.breadcrumb'), t('admin.nav.config')]}
      title={t('admin.config.title')}
      description={t('admin.config.restartWarning')}
      actions={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saveMut.isPending}
          disabled={!dirty || isLoading}
          onClick={() => saveMut.mutate()}
          style={{ background: c.accent }}
        >
          {t('admin.config.save')}
        </Button>
      }
    >
      {data?.data?.devMode && (
        <Alert
          type="info"
          showIcon
          className="mb-6"
          title={t('admin.devMode.title')}
          description={t('admin.devMode.desc')}
        />
      )}

      {isLoading ? (
        <AdminConfigSkeleton />
      ) : (
        <div
          className="rounded-xl p-4 md:p-6"
          style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
        >
          <Tabs items={tabItems} className="admin-tabs" />
        </div>
      )}
    </AdminPageLayout>
  )
}
