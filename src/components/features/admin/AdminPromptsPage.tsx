'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AppstoreOutlined,
  FileTextOutlined,
  MessageOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Flex, Tag, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { adminFetch } from '@/lib/admin/client'
import {
  PROMPT_GROUPS,
  type PromptGroupKey,
  type PromptsDocument,
  parsePrompts,
  stringifyPrompts,
} from '@/lib/admin/prompt-groups'
import { AdminPageLayout } from '@/components/features/admin/AdminPageLayout'
import { PromptRichEditor } from '@/components/features/admin/PromptRichEditor'
import { AdminConfigSkeleton } from '@/components/features/admin/AdminSkeletons'
import { useAdminColors, adminCardStyle, type AdminColors } from '@/constants/admin-theme'
import { CHAT_SHELL } from '@/constants/chat-shell-theme'

const { Text, Title } = Typography

const GROUP_KEYS = Object.keys(PROMPT_GROUPS) as PromptGroupKey[]

const GROUP_ICONS: Record<PromptGroupKey, typeof MessageOutlined> = {
  agent: MessageOutlined,
  review_summary: FileTextOutlined,
  aspect_group: AppstoreOutlined,
  aspect_summary: UnorderedListOutlined,
}

type ConfigRes = {
  success: boolean
  data: {
    config: Record<string, string>
    devMode?: boolean
  }
}

function PromptGroupNav({
  active,
  onChange,
  c,
}: {
  active: PromptGroupKey
  onChange: (group: PromptGroupKey) => void
  c: AdminColors
}) {
  const { t } = useTranslation()

  return (
    <nav className="admin-prompt-nav shrink-0">
      <Text
        className="text-[10px] font-semibold uppercase tracking-wider block px-3 pt-1 pb-3"
        style={{ color: c.textSubtle }}
      >
        {t('admin.prompts.navLabel')}
      </Text>
      <Flex vertical gap={2}>
        {GROUP_KEYS.map(group => {
          const Icon = GROUP_ICONS[group]
          const isActive = active === group
          return (
            <button
              key={group}
              type="button"
              onClick={() => onChange(group)}
              className="admin-prompt-nav__item w-full text-left flex items-start gap-3 transition-colors"
              style={{
                color: isActive ? c.text : c.textMuted,
                background: isActive ? c.accentSoft : 'transparent',
                borderLeft: isActive ? `3px solid ${c.accent}` : '3px solid transparent',
                padding: '10px 14px 10px 11px',
                borderRadius: `0 ${CHAT_SHELL.radiusSm}px ${CHAT_SHELL.radiusSm}px 0`,
              }}
            >
              <Icon
                style={{
                  fontSize: 15,
                  marginTop: 2,
                  color: isActive ? c.accent : c.textSubtle,
                  flexShrink: 0,
                }}
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug">
                  {t(`admin.prompts.groups.${group}.title`)}
                </span>
                <span
                  className="block text-xs leading-snug mt-0.5 line-clamp-2"
                  style={{ color: c.textSubtle }}
                >
                  {t(`admin.prompts.groups.${group}.hint`)}
                </span>
              </span>
            </button>
          )
        })}
      </Flex>
    </nav>
  )
}

export function AdminPromptsPage() {
  const { t } = useTranslation()
  const c = useAdminColors()
  const qc = useQueryClient()
  const [draft, setDraft] = useState<PromptsDocument | null>(null)
  const [dirty, setDirty] = useState(false)
  const [activeGroup, setActiveGroup] = useState<PromptGroupKey>('agent')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'config'],
    queryFn: () => adminFetch<ConfigRes>('/api/admin/config'),
  })

  const saved = useMemo(() => parsePrompts(data?.data?.config?.PROMPTS), [data])
  const current = dirty && draft ? draft : saved
  const card = adminCardStyle(c)

  useEffect(() => {
    if (!dirty) setDraft(saved)
  }, [saved, dirty])

  const updateField = (group: PromptGroupKey, field: string, value: string) => {
    setDraft(prev => {
      const base = prev ?? saved
      return {
        ...base,
        [group]: { ...base[group], [field]: value },
      }
    })
    setDirty(true)
  }

  const saveMut = useMutation({
    mutationFn: () =>
      adminFetch<{ message?: string }>('/api/admin/config', {
        method: 'PATCH',
        json: { updates: { PROMPTS: stringifyPrompts(current) } },
      }),
    onSuccess: (res: { message?: string }) => {
      message.success(res?.message ?? t('admin.prompts.saved'))
      setDirty(false)
      qc.invalidateQueries({ queryKey: ['admin', 'config'] })
    },
    onError: (e: Error) => message.error(e.message),
  })

  const fields = PROMPT_GROUPS[activeGroup]

  return (
    <AdminPageLayout
      wide
      breadcrumbs={[t('admin.breadcrumb'), t('admin.nav.prompts')]}
      title={t('admin.prompts.title')}
      description={t('admin.prompts.guideBody')}
      actions={
        <Flex align="center" gap={10} wrap="wrap">
          {dirty && (
            <Tag color="processing" style={{ margin: 0, border: 'none' }}>
              {t('admin.prompts.unsaved')}
            </Tag>
          )}
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saveMut.isPending}
            disabled={!dirty || isLoading}
            onClick={() => saveMut.mutate()}
            style={{ background: c.accent }}
          >
            {t('admin.prompts.save')}
          </Button>
        </Flex>
      }
    >
      {isLoading ? (
        <AdminConfigSkeleton />
      ) : (
        <div
          className="admin-prompt-workspace overflow-hidden"
          style={{ ...card, boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
        >
          <div
            className="px-5 md:px-6 py-2.5 flex flex-wrap items-center gap-3"
            style={{ borderBottom: `1px solid ${c.border}`, background: c.borderLight }}
          >
            {data?.data?.devMode && (
              <Tag color="blue" style={{ margin: 0 }}>
                {t('admin.devMode.title')}
              </Tag>
            )}
            <Text className="text-xs" style={{ color: c.textMuted }}>
              {t('admin.prompts.restartWarning')}
            </Text>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[560px]">
            <div
              className="lg:w-[248px] shrink-0 p-3 lg:p-4 border-b lg:border-b-0"
              style={{ borderColor: c.border }}
            >
              <div className="lg:hidden mb-2">
                <Text className="text-xs" style={{ color: c.textMuted }}>
                  {t('admin.prompts.pickGroup')}
                </Text>
              </div>
              <PromptGroupNav active={activeGroup} onChange={setActiveGroup} c={c} />
            </div>

            <div
              className="flex-1 min-w-0 flex flex-col border-t lg:border-t-0 lg:border-l"
              style={{ borderColor: c.border }}
            >
              <div
                className="px-5 md:px-7 py-5 md:py-6"
                style={{ borderBottom: `1px solid ${c.border}`, background: c.cardBg }}
              >
                <Title level={4} className="!m-0 !mb-1.5 !font-semibold" style={{ color: c.text }}>
                  {t(`admin.prompts.groups.${activeGroup}.title`)}
                </Title>
                <Text style={{ color: c.textMuted, fontSize: 14, lineHeight: 1.55 }}>
                  {t(`admin.prompts.groups.${activeGroup}.hint`)}
                </Text>
              </div>

              <Flex vertical gap={0} className="px-5 md:px-7 py-6 md:py-7 flex-1">
                {fields.map((field, index) => (
                  <section
                    key={field}
                    className="admin-prompt-field"
                    style={
                      index > 0
                        ? { marginTop: 28, paddingTop: 28, borderTop: `1px solid ${c.border}` }
                        : undefined
                    }
                  >
                    <Flex
                      justify="space-between"
                      align="flex-start"
                      gap={12}
                      wrap="wrap"
                      className="mb-3"
                    >
                      <div className="min-w-0">
                        <Text strong style={{ color: c.text, fontSize: 15, display: 'block' }}>
                          {t(`admin.prompts.fields.${field}.title`)}
                        </Text>
                        <Text
                          style={{ color: c.textMuted, fontSize: 13, display: 'block', marginTop: 4, lineHeight: 1.5 }}
                        >
                          {t(`admin.prompts.fields.${field}.desc`)}
                        </Text>
                      </div>
                      <Text
                        className="text-[11px] font-mono shrink-0 px-2 py-1 rounded"
                        style={{ color: c.textSubtle, background: c.bg }}
                      >
                        {activeGroup}.{field}
                      </Text>
                    </Flex>
                    <PromptRichEditor
                      value={current[activeGroup]?.[field] ?? ''}
                      onChange={v => updateField(activeGroup, field, v)}
                      placeholder={t('admin.prompts.emptyPlaceholder')}
                      minHeight={field === 'system' || field === 'synth_system' ? 280 : 220}
                    />
                  </section>
                ))}
              </Flex>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  )
}
