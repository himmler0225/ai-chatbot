'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import '@/i18n/config'
import { Button, Input, Modal } from 'antd'
import {
  CheckCircleOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/supabase'
import { useTheme } from '@/contexts/theme'
import { Logo } from '@/components/common/ui/Logo'
import { PRIM, APP_NAME, getModalColors } from '@/constants/brand'
import { useAuthModalStore } from '@/stores/authModalStore'
import {
  AuthAccent,
  AuthBody,
  AuthBrandRow,
  AuthHeader,
  AuthSubtitle,
  AuthTitle,
  ErrorBox,
  FieldGroup,
  GoogleBtn,
  ModeButton,
  ModeSwitch,
  OrRow,
  SuccessBody,
  SuccessIcon,
  SwitchHint,
  SwitchLink,
} from './authModal.style'

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

  const modalCardStyle = {
    padding: 0,
    borderRadius: 20,
    overflow: 'hidden' as const,
    background: BG,
    border: `1px solid ${BORDER}`,
    boxShadow: isDark
      ? '0 24px 64px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.04)'
      : '0 24px 56px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0, 229, 153, 0.06)',
  }

  const { mode, name, email, password, loading, googleLoading, error, registered, set, reset } =
    useAuthModalStore()

  const k = `auth.${mode}`

  useEffect(() => {
    if (open) reset(defaultMode)
  }, [open, defaultMode, reset])

  const close = () => {
    onClose()
    reset()
  }

  const afterLogin = () => {
    close()
    if (!window.location.pathname.startsWith('/app')) router.push('/app')
  }

  const switchMode = (next: Mode) => {
    if (next === mode) return
    reset(next)
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
          name.trim() || undefined,
        )
        if (err) {
          set({ error: t(mapError(err.message)) })
          return
        }
        if (data.session) {
          afterLogin()
          return
        }
        // Email confirmation disabled — close modal directly
        close()
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

  const inputStyle = {
    height: 46,
    borderRadius: 12,
    background: INPUT,
    borderColor: BORDER,
  }

  const inputInner = { color: FG, background: INPUT }

  const modalProps = {
    open,
    footer: null,
    width: 420,
    centered: true,
    destroyOnHidden: true,
    className: 'auth-modal-dark',
    onCancel: close,
    styles: {
      content: modalCardStyle,
      body: { padding: 0 },
    },
  }

  if (registered) {
    return (
      <Modal {...modalProps}>
        <AuthAccent />
        <SuccessBody>
          <SuccessIcon>
            <CheckCircleOutlined />
          </SuccessIcon>
          <AuthTitle $isDark={isDark}>{t('auth.register.successTitle')}</AuthTitle>
          <AuthSubtitle $isDark={isDark}>{t('auth.register.successDesc')}</AuthSubtitle>
          <Button
            type="primary"
            block
            size="large"
            onClick={close}
            style={{
              marginTop: 8,
              height: 46,
              borderRadius: 12,
              background: PRIM,
              borderColor: PRIM,
              fontWeight: 600,
            }}
          >
            {t('auth.register.successBtn')}
          </Button>
        </SuccessBody>
      </Modal>
    )
  }

  return (
    <Modal {...modalProps}>
      <AuthAccent />
      <AuthBody>
          <AuthHeader>
            <AuthBrandRow>
              <Logo size={40} />
              <span style={{ fontSize: 16, fontWeight: 700, color: FG, letterSpacing: '-0.01em' }}>
                {APP_NAME}
              </span>
            </AuthBrandRow>
            <AuthTitle $isDark={isDark}>{t(`${k}.title`)}</AuthTitle>
            <AuthSubtitle $isDark={isDark}>{t(`${k}.subtitle`)}</AuthSubtitle>
          </AuthHeader>

          <ModeSwitch $isDark={isDark}>
            <ModeButton
              type="button"
              $active={mode === 'login'}
              $isDark={isDark}
              onClick={() => switchMode('login')}
            >
              {t('auth.login.title')}
            </ModeButton>
            <ModeButton
              type="button"
              $active={mode === 'register'}
              $isDark={isDark}
              onClick={() => switchMode('register')}
            >
              {t('auth.register.title')}
            </ModeButton>
          </ModeSwitch>

          <FieldGroup>
            {mode === 'register' && (
              <Input
                size="large"
                prefix={<UserOutlined style={{ color: MUTED }} />}
                placeholder={t(`${k}.name`)}
                value={name}
                onChange={e => set({ name: e.target.value })}
                style={inputStyle}
                styles={{ input: inputInner }}
              />
            )}
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: MUTED }} />}
              placeholder={t(`${k}.email`)}
              value={email}
              onChange={e => set({ email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && void handleSubmit()}
              style={inputStyle}
              styles={{ input: inputInner }}
            />
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: MUTED }} />}
              placeholder={t(`${k}.password`)}
              value={password}
              onChange={e => set({ password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && void handleSubmit()}
              style={inputStyle}
              styles={{ input: inputInner }}
            />

            {error && <ErrorBox>{error}</ErrorBox>}

            <Button
              block
              size="large"
              type="primary"
              loading={loading}
              disabled={!email.trim() || !password.trim()}
              onClick={() => void handleSubmit()}
              style={{
                height: 46,
                borderRadius: 12,
                background: PRIM,
                borderColor: PRIM,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              {t(`${k}.submit`)}
            </Button>
          </FieldGroup>

          <OrRow $isDark={isDark}>{t(`${k}.or`)}</OrRow>

          <GoogleBtn
            type="button"
            $isDark={isDark}
            $loading={googleLoading}
            disabled={googleLoading}
            onClick={() => void handleGoogle()}
          >
            <GoogleOutlined style={{ fontSize: 17 }} />
            {t(`${k}.withGoogle`)}
          </GoogleBtn>

          <SwitchHint $isDark={isDark}>
            {t(`${k}.switchPrompt`)}
            <SwitchLink type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              {t(`${k}.switchAction`)}
            </SwitchLink>
          </SwitchHint>
      </AuthBody>
    </Modal>
  )
}
