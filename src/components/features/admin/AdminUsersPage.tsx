'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Select, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { adminFetch } from '@/lib/admin/client'
import { USER_ROLES, type UserRole } from '@/lib/admin/config-keys'
import { AdminHeader } from '@/components/features/admin/AdminHeader'
import { AdminPageBody } from '@/components/features/admin/AdminPageBody'
import { AdminTableSkeleton } from '@/components/features/admin/AdminSkeletons'
import { useAdmin } from '@/hooks/admin/useAdmin'
import { useAdminColors } from '@/constants/admin-theme'
import { PRIM } from '@/constants/brand'

const { Text } = Typography

type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  created_at: string
}

type UsersRes = { success: boolean; data: Profile[] }

const ROLE_COLOR: Record<UserRole, string> = {
  admin: PRIM,
  user: '#8b95a8',
}

export function AdminUsersPage() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US'
  const { profile: me } = useAdmin()
  const qc = useQueryClient()
  const c = useAdminColors()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminFetch<UsersRes>('/api/admin/users'),
  })

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
          <Text style={{ color: c.text }}>{email ?? '—'}</Text>
        ),
      },
      {
        title: t('admin.users.columns.name'),
        dataIndex: 'full_name',
        render: (v: string | null) => (
          <Text style={{ color: c.textMuted }}>{v || '—'}</Text>
        ),
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
              style={{ width: 130 }}
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
            color={ROLE_COLOR[role]}
            style={{
              border: 'none',
              fontWeight: 600,
              color: role === 'user' ? c.text : undefined,
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

  return (
    <>
      <AdminHeader titleKey="admin.users.title" subtitleKey="admin.users.subtitle" />
      <AdminPageBody>
        {isLoading ? (
          <AdminTableSkeleton />
        ) : (
        <div className="overflow-x-auto -mx-1 px-1">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data?.data ?? []}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 640 }}
          className="admin-table"
        />
        </div>
        )}
      </AdminPageBody>
    </>
  )
}
