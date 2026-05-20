'use client'

import { useServiceWorker } from '@/hooks/use-service-worker'

export function ServiceWorkerInit() {
  useServiceWorker()
  return null
}
