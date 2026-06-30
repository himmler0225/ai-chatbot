'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  FilterOutlined,
  InboxOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Col, Empty, Flex, Row, Select, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { useAppLocale } from '@/i18n/locale'
import { adminFetch } from '@/lib/admin/client'
import { USER_ROLES, type UserRole } from '@/lib/admin/config-keys'
import { AdminPageLayout } from '@/components/features/admin/AdminPageLayout'
import { EnterpriseStatCard } from '@/components/features/admin/EnterpriseStatCard'
import { AdminTableSkeleton } from '@/components/features/admin/AdminSkeletons'
import { useAdmin } from '@/hooks/admin/useAdmin'
import { useAdminColors, adminCardStyle } from '@/constants/admin-theme'

const { Text } = Typography

type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  created_at: string
}

type UsersRes = { success: boolean; data: Profile[]; devMode?: boolean }

export function AdminUsersPage() {
  const { t } = useTranslation()
  const c = useAdminColors()
  const { intlLocale: locale } = useAppLocale()
  const { profile: me } = useAdmin()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminFetch<UsersRes>('/api/admin/users'),
  })

  const users = data?.data ?? []
  const adminCount = users.filter(u => u.role === 'admin').length

  const updateRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      adminFetch('/api/admin/users', { method: 'PATCH', json: { userId, role } }),
    onSuccess: () => {
      message.success(t('admin.users.roleUpdated'))
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (e: Error) => message.error(e.message),
  })

  const columns: ColumnsType<Profile> = useMemo(
    () => [
      {
        title: t('admin.users.columns.email'),
        dataIndex: 'email',
        render: (email: string | null) => (
          <Text style={{ color: c.text, fontWeight: 500 }}>{email ?? '—'}</Text>
        ),
      },
      {
        title: t('admin.users.columns.name'),
        dataIndex: 'full_name',
        render: (v: string | null) => <Text style={{ color: c.textMuted }}>{v || '—'}</Text>,
      },
      {
        title: t('admin.users.columns.role'),
        dataIndex: 'role',
        render: (role: UserRole, row) => {
          const isSelf = row.id === me?.id
          return (
            <Select
              size="small"
              value={role}
              disabled={isSelf}
              style={{ width: 120 }}
              onChange={v => updateRole.mutate({ userId: row.id, role: v })}
              options={USER_ROLES.map(r => ({ value: r, label: r }))}
            />
          )
        },
      },
      {
        title: t('admin.users.columns.badge'),
        dataIndex: 'role',
        render: (role: UserRole) => (
          <Tag
            style={{
              border: 'none',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.06em',
              background: role === 'admin' ? c.accentSoft : c.borderLight,
              color: role === 'admin' ? c.accent : c.textMuted,
            }}
          >
            {role.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: t('admin.users.columns.joined'),
        dataIndex: 'created_at',
        render: (d: string) => (
          <Text className="text-xs" style={{ color: c.textMuted }}>
            {new Date(d).toLocaleDateString(locale)}
          </Text>
        ),
      },
    ],
    [t, locale, me?.id, updateRole.mutate, c],
  )

  const card = adminCardStyle(c)

  return (
    <AdminPageLayout
      breadcrumbs={[t('admin.breadcrumb'), t('admin.nav.users')]}
      title={t('admin.users.title')}
      description={t('admin.users.description')}
      actions={
        <>
          <Button icon={<FilterOutlined />}>{t('admin.users.filters')}</Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ background: c.accent }}>
            {t('admin.users.addUser')}
          </Button>
        </>
      }
    >
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} xl={6}>
          <EnterpriseStatCard
            label={t('admin.users.stats.total')}
            value={users.length}
            hint={t('admin.users.stats.totalHint')}
            hintNeutral
            icon={<UserOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <EnterpriseStatCard
            label={t('admin.users.stats.active')}
            value={users.length}
            hint={t('admin.users.stats.stable')}
            hintNeutral
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <EnterpriseStatCard
            label={t('admin.users.stats.admins')}
            value={adminCount}
            hint={t('admin.users.stats.adminHint', { count: adminCount })}
            hintUp={adminCount > 0}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <EnterpriseStatCard
            label={t('admin.users.stats.pending')}
            value={0}
            hint={t('admin.users.stats.inReview')}
            hintNeutral
          />
        </Col>
      </Row>

      {isLoading ? (
        <AdminTableSkeleton />
      ) : (
        <div style={{ ...card, overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 640 }}
            className="admin-table admin-table-enterprise"
            locale={{
              emptyText: (
                <Empty
                  image={<InboxOutlined style={{ fontSize: 48, color: c.accent }} />}
                  description={
                    <div>
                      <Text strong style={{ color: c.text, display: 'block', marginBottom: 4 }}>
                        {t('admin.users.emptyTitle')}
                      </Text>
                      <Text style={{ color: c.textMuted }}>{t('admin.users.emptyDesc')}</Text>
                    </div>
                  }
                >
                  <Flex gap={10} justify="center" className="mt-4">
                    <Button type="primary" icon={<PlusOutlined />} style={{ background: c.text }}>
                      {t('admin.users.createFirst')}
                    </Button>
                    <Button>{t('admin.users.importCsv')}</Button>
                  </Flex>
                </Empty>
              ),
            }}
          />
          <Flex
            justify="space-between"
            align="center"
            className="px-4 py-3 text-xs"
            style={{ borderTop: `1px solid ${c.border}`, color: c.textMuted }}
          >
            <span>{t('admin.users.showing', { shown: users.length, total: users.length })}</span>
          </Flex>
        </div>
      )}

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} md={12}>
          <div
            className="rounded-xl p-5 h-full"
            style={{ ...card, background: c.accentSoft, borderColor: 'rgba(37,99,235,0.15)' }}
          >
            <Flex align="start" gap={14}>
              <span
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{ width: 44, height: 44, background: c.cardBg, color: c.accent }}
              >
                <SafetyCertificateOutlined style={{ fontSize: 20 }} />
              </span>
              <div>
                <Text strong style={{ color: c.text, display: 'block', marginBottom: 4 }}>
                  {t('admin.users.rolesCard.title')}
                </Text>
                <Text style={{ color: c.textMuted, fontSize: 13, display: 'block', marginBottom: 12 }}>
                  {t('admin.users.rolesCard.desc')}
                </Text>
                <Button type="link" className="!p-0 !h-auto" style={{ color: c.accent }}>
                  {t('admin.users.rolesCard.cta')} →
                </Button>
              </div>
            </Flex>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div
            className="rounded-xl p-5 h-full"
            style={{ ...card, background: c.accentSoft, borderColor: 'rgba(37,99,235,0.15)' }}
          >
            <Flex align="start" gap={14}>
              <span
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{ width: 44, height: 44, background: c.cardBg, color: c.accent }}
              >
                <SyncOutlined style={{ fontSize: 20 }} />
              </span>
              <div>
                <Text strong style={{ color: c.text, display: 'block', marginBottom: 4 }}>
                  {t('admin.users.ssoCard.title')}
                </Text>
                <Text style={{ color: c.textMuted, fontSize: 13, display: 'block', marginBottom: 12 }}>
                  {t('admin.users.ssoCard.desc')}
                </Text>
                <Button type="link" className="!p-0 !h-auto" style={{ color: c.accent }}>
                  {t('admin.users.ssoCard.cta')} →
                </Button>
              </div>
            </Flex>
          </div>
        </Col>
      </Row>
    </AdminPageLayout>
  )
}
