"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export type BottomSheetState = "collapsed" | "half" | "full"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  const [state, setState] = useState<BottomSheetState>("half")
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const stateHeights = {
    collapsed: "20%",
    half: "50%",
    full: "90%",
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    if (sheetRef.current) {
      startHeight.current = sheetRef.current.clientHeight
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY
    const diff = startY.current - endY

    // Swipe up = more height, swipe down = less height
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped up
        if (state === "collapsed") setState("half")
        else if (state === "half") setState("full")
      } else {
        // Swiped down
        if (state === "full") setState("half")
        else if (state === "half") setState("collapsed")
        else onClose()
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ height: "20%" }}
            animate={{ height: stateHeights[state] }}
            exit={{ height: "0%", opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 rounded-t-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex flex-col items-center justify-center py-3 px-4 cursor-grab active:cursor-grabbing border-b border-border/50">
              <div className="w-12 h-1 rounded-full bg-border/40 mb-2" />
              {title && <h3 className="text-sm font-semibold">{title}</h3>}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BottomSheet
