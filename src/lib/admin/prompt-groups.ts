/** Mirrors ai-layer `config/remote-schema.json` → PROMPTS.groups */
export const PROMPT_GROUPS = {
  agent: ['system', 'synth_system'],
  review_summary: ['system', 'prompt'],
  aspect_group: ['system', 'prompt'],
  aspect_summary: ['system', 'prompt'],
} as const

export type PromptGroupKey = keyof typeof PROMPT_GROUPS

export type PromptsDocument = Record<string, Record<string, string>>

export function emptyPrompts(): PromptsDocument {
  const doc: PromptsDocument = {}
  for (const [group, fields] of Object.entries(PROMPT_GROUPS)) {
    doc[group] = {}
    for (const field of fields) {
      doc[group][field] = ''
    }
  }
  return doc
}

export function parsePrompts(raw: string | undefined): PromptsDocument {
  const base = emptyPrompts()
  if (!raw?.trim()) return base
  try {
    const parsed = JSON.parse(raw) as PromptsDocument
    if (!parsed || typeof parsed !== 'object') return base
    for (const [group, fields] of Object.entries(PROMPT_GROUPS)) {
      const section = parsed[group]
      if (!section || typeof section !== 'object') continue
      for (const field of fields) {
        const value = section[field]
        if (typeof value === 'string') {
          base[group][field] = value
        }
      }
    }
    return base
  } catch {
    return base
  }
}

export function stringifyPrompts(doc: PromptsDocument): string {
  const out: PromptsDocument = {}
  for (const [group, fields] of Object.entries(PROMPT_GROUPS)) {
    out[group] = {}
    for (const field of fields) {
      out[group][field] = doc[group]?.[field] ?? ''
    }
  }
  return JSON.stringify(out, null, 2)
}
