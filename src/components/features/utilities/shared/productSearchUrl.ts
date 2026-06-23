export type ProductStore = 'tiki' | 'fpt'

export const TIKI_QUERY_KEY = 'tiki_q'
export const FPT_QUERY_KEY = 'fpt_q'

export function queryKeyForStore(store: ProductStore): string {
  return store === 'fpt' ? FPT_QUERY_KEY : TIKI_QUERY_KEY
}

export function readStoreQuery(params: URLSearchParams, store: ProductStore): string {
  const key = queryKeyForStore(store)
  const value = params.get(key)
  if (value) return value
  // legacy shared `q` — only for the active store tab
  if (params.get('store') === store) {
    return params.get('q') ?? ''
  }
  return ''
}

export function applyStoreSearch(
  params: URLSearchParams,
  store: ProductStore,
  q: string,
): URLSearchParams {
  params.set('tab', 'util')
  params.set('store', store)
  params.set(queryKeyForStore(store), q.trim())
  params.delete('util')
  params.delete('q')
  return params
}

export function clearProductPanelParams(params: URLSearchParams): URLSearchParams {
  params.delete('tab')
  params.delete('util')
  params.delete('store')
  params.delete('q')
  params.delete(TIKI_QUERY_KEY)
  params.delete(FPT_QUERY_KEY)
  return params
}
