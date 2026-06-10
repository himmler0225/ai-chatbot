import { AiLayerClient } from './client'

export { AiLayerClient }     from './client'
export { AiLayerOfflineError, AiLayerTimeoutError, AiLayerUpstreamError } from './errors'

export const aiLayer = new AiLayerClient()
