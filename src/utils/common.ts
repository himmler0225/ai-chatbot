export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function toTitle(msg: string, max = 40): string {
  return msg.length > max ? msg.slice(0, max) + '…' : msg
}
