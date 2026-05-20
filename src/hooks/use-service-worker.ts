import { useEffect, useState } from 'react'

export function useServiceWorker() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('[SW] Registered successfully:', registration)
        setIsReady(true)

        // Check for updates periodically
        const interval = setInterval(() => {
          registration.update()
        }, 60000) // Check every minute

        return () => clearInterval(interval)
      }).catch((error) => {
        console.error('[SW] Registration failed:', error)
      })
    } else {
      // Development or SW not supported
      setIsReady(true)
    }
  }, [])

  return { isReady }
}
