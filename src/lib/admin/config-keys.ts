export const ADMIN_CONFIG_GROUPS: Record<string, string[]> = {
  models: [
    'OPENAI_MODEL',
    'OPENAI_TOOL_MODEL',
    'DEEP_SEEK_MODEL',
    'DEEP_SEEK_TOOL_MODEL',
    'OPENAI_MAX_TOKENS',
    'OPENAI_TOOL_MAX_TOKENS',
  ],
  agent: [
    'AGENT_MAX_ITER',
    'AGENT_MAX_RESULT_CHARS',
    'AGENT_MAX_COMMENTS',
    'AGENT_MAX_COMMENT_LEN',
    'AGENT_MAX_LIST_ITEMS',
    'AGENT_RATE_LIMIT',
    'SHORTEN_RATE_LIMIT',
    'QR_RATE_LIMIT',
    'YOUTUBE_RATE_LIMIT',
  ],
  prompts: ['AGENT_SYSTEM', 'AGENT_SYNTH_SYSTEM', 'REVIEW_SUMMARY_SYSTEM', 'REVIEW_SUMMARY_PROMPT'],
  secrets: ['OPENAI_API_KEY', 'DATA_MINER_KEY'],
  miner: [
    'PROXY_VN',
    'PROXY_US',
    'RATE_LIMIT_DEFAULT',
    'RATE_LIMIT_BURST',
    'RATE_LIMITS',
    'BURST_LIMITS',
    'SERVICE_RATE_LIMITS',
  ],
}

export const ADMIN_CONFIG_WHITELIST = new Set(
  Object.values(ADMIN_CONFIG_GROUPS).flat(),
)

export const SECRET_CONFIG_KEYS = new Set([
  'OPENAI_API_KEY',
  'DATA_MINER_KEY',
  'PROXY_VN',
  'PROXY_US',
])

export const JSON_CONFIG_KEYS = new Set([
  'RATE_LIMITS',
  'BURST_LIMITS',
  'SERVICE_RATE_LIMITS',
])

export const LONG_TEXT_KEYS = new Set([
  'AGENT_SYSTEM',
  'AGENT_SYNTH_SYSTEM',
  'REVIEW_SUMMARY_SYSTEM',
  'REVIEW_SUMMARY_PROMPT',
])

export const USER_ROLES = ['user', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]
