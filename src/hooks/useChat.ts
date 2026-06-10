import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/src/lib/api-client'
import type { ChatPayload, ChatResponse } from '@/src/types/chat'

export function useChatMutation() {
  return useMutation<ChatResponse, Error, ChatPayload>({
    mutationFn: (payload) => apiClient.chat(payload),
  })
}
