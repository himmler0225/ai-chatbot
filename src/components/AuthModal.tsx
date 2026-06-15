'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import '@/src/i18n/config'
import { Button, Divider, Flex, Input, Modal, Typography } from 'antd'
import {
  CheckCircleOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/src/lib/supabase'
import { useTheme } from '@/src/context/theme'
import { Logo } from '@/src/components/ui/Logo'
import { PRIM, APP_NAME, getModalColors } from '@/src/constants/brand'
import { useAuthModalStore } from '@/src/store/authModalStore'

const { Text, Title } = Typography

type Mode = 'login' | 'register'

interface Props {
  open: boolean
  defaultMode: Mode
  onClose: () => void
}

function mapError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'auth.error.invalidCredentials'
  if (msg.includes('Email not confirmed')) return 'auth.error.emailNotConfirmed'
  if (msg.includes('User already registered')) return 'auth.error.alreadyRegistered'
  if (msg.includes('Password should be')) return 'auth.error.weakPassword'
  return 'auth.error.generic'
}

export default function AuthModal({ open, defaultMode, onClose }: Props) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const router = useRouter()
  const { bg: BG, border: BORDER, muted: MUTED, fg: FG, input: INPUT } = getModalColors(isDark)

  const { mode, name, email, password, loading, googleLoading, error, registered, set, reset } =
    useAuthModalStore()

  const k = `auth.${mode}`

  useEffect(() => {
    if (open) reset(defaultMode)
  }, [open, defaultMode])

  const close = () => {
    onClose()
    reset()
  }

  const afterLogin = () => {
    close()
    if (!window.location.pathname.startsWith('/app')) router.push('/app')
  }

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return
    set({ loading: true, error: null })
    try {
      if (mode === 'login') {
        const { error: err } = await signInWithEmail(email, password)
        if (err) {
          set({ error: t(mapError(err.message)) })
          return
        }
        afterLogin()
      } else {
        const { error: err, data } = await signUpWithEmail(
          email,
          password,
          name.trim() || undefined
        )
        if (err) {
          set({ error: t(mapError(err.message)) })
          return
        }
        if (data.session) {
          afterLogin()
          return
        }
        set({ registered: true })
      }
    } finally {
      set({ loading: false })
    }
  }

  const handleGoogle = async () => {
    set({ googleLoading: true })
    try {
      await signInWithGoogle('/app')
    } finally {
      set({ googleLoading: false })
    }
  }

  const inputProps = {
    size: 'large' as const,
    style: { background: INPUT, borderColor: BORDER },
    styles: { input: { color: FG, background: INPUT } },
  }

  const modalProps = {
    open,
    footer: null,
    width: 400,
    centered: true,
    destroyOnHidden: true,
    style: { padding: 0 },
    className: 'auth-modal-dark',
    onCancel: close,
  }

  if (registered) {
    return (
      <Modal {...modalProps}>
        <Flex
          vertical
          align="center"
          className="px-8 py-10 rounded-2xl"
          gap={12}
          style={{ background: BG, border: `1px solid ${BORDER}` }}
        >
          <CheckCircleOutlined style={{ fontSize: 48, color: PRIM }} />
          <Title level={4} className="!m-0" style={{ color: FG }}>
            {t('auth.register.successTitle')}
          </Title>
          <Text className="text-center text-[13px]" style={{ color: MUTED }}>
            {t('auth.register.successDesc')}
          </Text>
          <Button type="primary" block size="large" className="!mt-2 !h-11" onClick={close}>
            {t('auth.register.successBtn')}
          </Button>
        </Flex>
      </Modal>
    )
  }

  return (
    <Modal {...modalProps}>
      <Flex
        vertical
        align="center"
        className="px-8 pt-9 pb-7 rounded-2xl"
        gap={0}
      >
        <Flex align="center" gap={8} className="mb-6">
          <Logo size={36} />
          <Text strong style={{ fontSize: 16, color: FG }}>
            {APP_NAME}
          </Text>
        </Flex>

        <Divider />

        <Title level={4} className="!m-0 !mb-1" style={{ color: FG, fontWeight: 600 }}>
          {t(`${k}.title`)}
        </Title>
        <Text className="!mb-7 text-[13px]" style={{ color: MUTED }}>
          {t(`${k}.subtitle`)}
        </Text>

        <Flex vertical gap={8} className="w-full mb-3">
          {mode === 'register' && (
            <Input
              {...inputProps}
              prefix={<UserOutlined style={{ color: MUTED }} />}
              placeholder={t(`${k}.name`)}
              value={name}
              onChange={e => set({ name: e.target.value })}
            />
          )}
          <Input
            {...inputProps}
            prefix={<MailOutlined style={{ color: MUTED }} />}
            placeholder={t(`${k}.email`)}
            value={email}
            onChange={e => set({ email: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && void handleSubmit()}
          />
          <Input.Password
            {...inputProps}
            prefix={<LockOutlined style={{ color: MUTED }} />}
            placeholder={t(`${k}.password`)}
            value={password}
            onChange={e => set({ password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && void handleSubmit()}
          />

          {error && <Text style={{ color: '#ff4d4f', fontSize: 12 }}>{error}</Text>}

          <Button
            block
            size="large"
            type="primary"
            loading={loading}
            disabled={!email.trim() || !password.trim()}
            onClick={() => void handleSubmit()}
            style={{ height: 44, background: PRIM, borderColor: PRIM }}
          >
            {t(`${k}.submit`)}
          </Button>
        </Flex>

        <Divider style={{ borderColor: BORDER, margin: '12px 0', color: MUTED, fontSize: 12 }}>
          {t(`${k}.or`)}
        </Divider>

        <Button
          icon={<GoogleOutlined />}
          block
          size="large"
          loading={googleLoading}
          onClick={handleGoogle}
          className="!mb-4"
          style={{
            background: INPUT,
            color: FG,
            border: `1px solid ${BORDER}`,
            height: 46,
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          {t(`${k}.withGoogle`)}
        </Button>

        <Text className="text-[13px]" style={{ color: MUTED }}>
          {t(`${k}.switchPrompt`)}{' '}
          <span
            onClick={() => reset(mode === 'login' ? 'register' : 'login')}
            className="cursor-pointer font-medium"
            style={{ color: PRIM }}
          >
            {t(`${k}.switchAction`)}
          </span>
        </Text>
      </Flex>
    </Modal>
  )
}
