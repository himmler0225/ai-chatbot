'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { utilitiesApi } from '@/lib/api/utilities'
import { useProductPanelContext } from '@/contexts/productPanel'

function fmtPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

export function useProductActions(
  productUrl: string,
  productName: string,
  productPrice?: number,
) {
  const { t } = useTranslation()
  const panelCtx = useProductPanelContext()
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [qrImg, setQrImg] = useState<string | null>(null)
  const [qrOpen, setQrOpen] = useState(false)

  const shortenMut = useMutation({
    mutationFn: () => utilitiesApi.shorten({ url: productUrl }),
    onSuccess: async (data) => {
      setShortUrl(data.short)
      await navigator.clipboard.writeText(data.short)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    },
    onError: async () => {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    },
  })

  const qrMut = useMutation({
    mutationFn: () => utilitiesApi.qr({ url: shortUrl ?? productUrl, size: 220 }),
    onSuccess: (data) => setQrImg(data.image),
  })

  const handleShorten = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      shortenMut.mutate()
    }
  }

  const handleQR = () => {
    setQrOpen(true)
    if (!qrImg) qrMut.mutate()
  }

  const handleAIReview = () => {
    const prompt = t('utilities.product.aiReviewPrompt', {
      name: productName,
      price: productPrice != null ? fmtPrice(productPrice) : '',
      url: productUrl,
    })
    panelCtx?.onAIReview(prompt)
  }

  return {
    shortUrl,
    copied,
    qrImg,
    qrOpen,
    setQrOpen,
    handleShorten,
    handleQR,
    handleAIReview,
    isShortLoading: shortenMut.isPending,
    isQRLoading: qrMut.isPending,
  }
}
