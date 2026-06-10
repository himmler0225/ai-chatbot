export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function toTitle(msg: string, max = 40): string {
  return msg.length > max ? msg.slice(0, max) + '…' : msg
}

export const CHAT_SUGGESTIONS = [
  'Review iPhone 17 trên TikTok',
  'Trending YouTube hôm nay',
  'So sánh Samsung vs iPhone trên YouTube',
] as const
