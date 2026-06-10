import axios, { type AxiosInstance } from 'axios'
import type {
  ApiResponse,
  ChatPayload, ChatResponse,
  ShortenRequest, ShortenResult,
  QRRequest, QRResult,
} from '@/src/types/chat'

class ApiClient {
  private readonly http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: '/',
      headers: { 'Content-Type': 'application/json' },
      timeout: 90_000,
    })
  }

  // ── Chat ───────────────────────────────────────────────────────────────────

  async chat(payload: ChatPayload): Promise<ChatResponse> {
    const { data } = await this.http.post<ChatResponse>('/api/chat', payload)
    return data
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  async shortenUrl(params: ShortenRequest): Promise<ShortenResult> {
    const { data } = await this.http.post<ApiResponse<ShortenResult>>('/api/utilities/shorten', params)
    if (!data.success) throw new Error(data.error ?? 'Rút gọn URL thất bại')
    return data.data
  }

  async generateQR(params: QRRequest): Promise<QRResult> {
    const { data } = await this.http.post<ApiResponse<QRResult>>('/api/utilities/qr', params)
    if (!data.success) throw new Error(data.error ?? 'Tạo mã QR thất bại')
    return data.data
  }
}

export const apiClient = new ApiClient()
