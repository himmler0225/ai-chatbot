import { useMutation } from '@tanstack/react-query'
import { utilitiesApi } from '@/src/lib/api/utilities'
import type { ShortenRequest, ShortenResult, QRRequest, QRResult } from '@/src/types/chat'

export function useShortenMutation() {
  return useMutation<ShortenResult, Error, ShortenRequest>({
    mutationFn: params => utilitiesApi.shorten(params),
  })
}

export function useQRMutation() {
  return useMutation<QRResult, Error, QRRequest>({
    mutationFn: params => utilitiesApi.qr(params),
  })
}
