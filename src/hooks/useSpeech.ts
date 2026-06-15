'use client'

import { useCallback, useEffect, useState } from 'react'

/** Strip markdown so the TTS reads clean prose, not symbols. */
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/[*_~#>|]/g, '') // md symbols
    .replace(/^\s*[-•]\s*/gm, '') // bullets
    .replace(/\n{2,}/g, '. ') // paragraph breaks → pause
    .replace(/\s+/g, ' ')
    .trim()
}

export function useSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(
    () => () => {
      if (supported) window.speechSynthesis.cancel()
    },
    [supported]
  )

  const speak = useCallback(
    (id: string, text: string, lang: 'vi' | 'en' = 'vi') => {
      if (!supported) return
      const synth = window.speechSynthesis

      if (speakingId === id) {
        synth.cancel()
        setSpeakingId(null)
        return
      }

      synth.cancel()
      const utter = new SpeechSynthesisUtterance(stripMarkdown(text))
      const want = lang === 'en' ? 'en' : 'vi'
      const voice = synth.getVoices().find(v => v.lang.toLowerCase().startsWith(want))
      if (voice) utter.voice = voice
      utter.lang = want === 'vi' ? 'vi-VN' : 'en-US'
      utter.rate = 1.05
      utter.onend = () => setSpeakingId(null)
      utter.onerror = () => setSpeakingId(null)

      setSpeakingId(id)
      synth.speak(utter)
    },
    [supported, speakingId]
  )

  return { speak, speakingId, supported }
}
