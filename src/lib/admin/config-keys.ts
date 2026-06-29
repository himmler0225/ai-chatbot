import schema from './config-schema.json'

export const ADMIN_CONFIG_GROUPS: Record<string, string[]> = schema.admin.groups

export const ADMIN_CONFIG_WHITELIST = new Set(
  Object.values(ADMIN_CONFIG_GROUPS).flat(),
)

export const SECRET_CONFIG_KEYS = new Set<string>(schema.admin.secret_keys)

export const JSON_CONFIG_KEYS = new Set<string>(schema.admin.json_keys)

export const LONG_TEXT_KEYS = new Set<string>(schema.admin.long_text_keys)

/** Nested paths whose string values are masked inside JSON config blobs. */
export const JSON_SECRET_PATHS: Record<string, string[][]> = schema.admin
  .json_secret_paths as Record<string, string[][]>

export const USER_ROLES = ['user', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]
