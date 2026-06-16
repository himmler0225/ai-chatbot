'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { utilitiesApi } from '@/src/lib/api/utilities'
import { useChatStore } from '@/src/store/chatStore'
import { useUIStore } from '@/src/store/uiStore'

export function useProductActions(productUrl: string, productName: string) {
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied,   setCopied]   = useState(false)
  const [qrImg,    setQrImg]    = useState<string | null>(null)
  const [qrOpen,   setQrOpen]   = useState(false)

  const setInput = (v: string) => useChatStore.setState({ input: v })
  const setView  = useUIStore(s => s.set)

  const shortenMut = useMutation({
    mutationFn: () => utilitiesApi.shorten({ url: productUrl }),
    onSuccess: async (data) => {
      setShortUrl(data.short)
      await navigator.clipboard.writeText(data.short)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    },
    onError: async () => {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    },
  })

  const qrMut = useMutation({
    mutationFn: () => utilitiesApi.qr({ url: shortUrl ?? productUrl, size: 220 }),
    onSuccess: (data) => setQrImg(data.image),
  })

  const handleShorten = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } else {
      shortenMut.mutate()
    }
  }

  const handleQR = () => {
    setQrOpen(true)
    if (!qrImg) qrMut.mutate()
  }

  const handleAIReview = () => {
    setInput(`Review ${productName} trên YouTube và TikTok`)
    setView({ view: 'chat' })
  }

  return {
    shortUrl, copied, qrImg, qrOpen, setQrOpen,
    handleShorten, handleQR, handleAIReview,
    isShortLoading: shortenMut.isPending,
    isQRLoading:    qrMut.isPending,
  }
}
