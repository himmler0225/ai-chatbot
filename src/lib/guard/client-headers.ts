import { CLIENT_HEADER, CLIENT_HEADER_VALUE } from './api-routes'

/** Marker header set by in-app fetch/axios only (checked in middleware). */
export function clientGuardHeaders(): Record<string, string> {
  return { [CLIENT_HEADER]: CLIENT_HEADER_VALUE }
}
