import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/src/lib/api-client'
import type { ShortenRequest, ShortenResult, QRRequest, QRResult } from '@/src/types/chat'

export function useShortenMutation() {
  return useMutation<ShortenResult, Error, ShortenRequest>({
    mutationFn: (params) => apiClient.shortenUrl(params),
  })
}

export function useQRMutation() {
  return useMutation<QRResult, Error, QRRequest>({
    mutationFn: (params) => apiClient.generateQR(params),
  })
}
