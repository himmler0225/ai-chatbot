/** Batch SSE text deltas to one store update per animation frame. */
export function createDeltaBatcher(append: (chunk: string) => void) {
  let pending = ''
  let rafId: number | null = null

  const flush = () => {
    rafId = null
    if (!pending) return
    const chunk = pending
    pending = ''
    append(chunk)
  }

  return {
    push(delta: string) {
      if (!delta) return
      pending += delta
      if (rafId == null) {
        rafId = requestAnimationFrame(flush)
      }
    },
    flush() {
      if (rafId != null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      flush()
    },
  }
}
