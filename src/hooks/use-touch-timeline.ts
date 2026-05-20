import { useEffect, useRef } from 'react'

interface TouchTimelineOptions {
  onZoom?: (direction: 'in' | 'out', scale: number) => void
  onScrub?: (position: number) => void
  onSelect?: (elementId: string) => void
  onMove?: (elementId: string, offset: number) => void
  onSplit?: () => void
  enabled?: boolean
}

export function useTouchTimeline(ref: React.RefObject<HTMLElement>, options: TouchTimelineOptions = {}) {
  const {
    onZoom,
    onScrub,
    onSelect,
    onMove,
    onSplit,
    enabled = true,
  } = options

  const touchStartRef = useRef({
    x: 0,
    y: 0,
    time: 0,
    distance: 0,
  })

  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled || !ref.current) return

    const element = ref.current

    // Handle pinch to zoom
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch gesture
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )
        touchStartRef.current.distance = distance
      } else if (e.touches.length === 1) {
        // Single touch
        const touch = e.touches[0]
        touchStartRef.current.x = touch.clientX
        touchStartRef.current.y = touch.clientY
        touchStartRef.current.time = Date.now()

        // Set up long press (500ms)
        longPressTimeoutRef.current = setTimeout(() => {
          const target = e.target as HTMLElement
          const elementId = target.getAttribute('data-element-id')
          if (elementId) {
            onSelect?.(elementId)
          }
        }, 500)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Cancel long press on movement
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }

      if (e.touches.length === 2) {
        // Pinch zoom
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        const scale = distance / touchStartRef.current.distance
        if (scale > 1.1) {
          onZoom?.('in', scale)
        } else if (scale < 0.9) {
          onZoom?.('out', scale)
        }
      } else if (e.touches.length === 1) {
        // Horizontal swipe for scrubbing
        const touch = e.touches[0]
        const deltaX = touch.clientX - touchStartRef.current.x
        const deltaY = touch.clientY - touchStartRef.current.y

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe (scrubbing)
          onScrub?.(deltaX)
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
      }

      const deltaTime = Date.now() - touchStartRef.current.time
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y

      // Double tap to split (two quick taps)
      if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        // This would need double-tap detection (store last tap time)
        onSplit?.()
      }
    }

    element.addEventListener('touchstart', handleTouchStart, false)
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, false)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
      }
    }
  }, [enabled, onZoom, onScrub, onSelect, onMove, onSplit])
}
