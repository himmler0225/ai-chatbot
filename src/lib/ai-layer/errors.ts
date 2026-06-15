export class AiLayerOfflineError extends Error {
  constructor(url: string, cause: string) {
    super(`Không thể kết nối đến AI Layer (${url}).\n\n${cause}`)
    this.name = 'AiLayerOfflineError'
  }
}

export class AiLayerTimeoutError extends Error {
  constructor() {
    super('Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại với câu hỏi ngắn hơn.')
    this.name = 'AiLayerTimeoutError'
  }
}

export class AiLayerUpstreamError extends Error {
  constructor(
    public readonly status: number,
    body: string
  ) {
    super(body)
    this.name = 'AiLayerUpstreamError'
  }
}
