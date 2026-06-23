import { notFound } from 'next/navigation'

/** Internal rewrite target for unknown FE routes (see middleware). */
export default function InternalNotFoundPage() {
  notFound()
}
