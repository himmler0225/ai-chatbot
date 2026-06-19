import { BaseApi } from '@/lib/api/client'
import type { ApiResponse, ShortenRequest, ShortenResult, QRRequest, QRResult } from '@/types/chat'

class UtilitiesApi extends BaseApi {
  constructor() {
    super('/api/utilities')
  }

  async shorten(params: ShortenRequest): Promise<ShortenResult> {
    const data = await this.post<ApiResponse<ShortenResult>>('/shorten', params)
    if (!data.success) throw new Error(data.error ?? 'Rút gọn URL thất bại')
    return data.data
  }

  async qr(params: QRRequest): Promise<QRResult> {
    const data = await this.post<ApiResponse<QRResult>>('/qr', params)
    if (!data.success) throw new Error(data.error ?? 'Tạo mã QR thất bại')
    return data.data
  }
}

export const utilitiesApi = new UtilitiesApi()
