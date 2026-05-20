"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface CaptionSegment {
  start: number
  end: number
  text: string
}

interface AutoCaptionButtonProps {
  projectId?: string
  onCaptionsGenerated?: (captions: CaptionSegment[]) => void
  disabled?: boolean
}

const AutoCaptionButton = ({
  projectId,
  onCaptionsGenerated,
  disabled = false,
}: AutoCaptionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerateCaptions = async () => {
    if (!projectId) {
      toast.error("No project loaded")
      return
    }

    try {
      setIsLoading(true)
      setProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 20
          return Math.min(next, 90)
        })
      }, 500)

      // Call transcription API
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Failed to transcribe audio")
      }

      const data = await response.json()

      // Parse response and convert to caption segments
      // This assumes the API returns captions with timing
      const captions: CaptionSegment[] = data.captions || []

      if (captions.length === 0) {
        toast.info("No speech detected in audio")
      } else {
        onCaptionsGenerated?.(captions)
        toast.success(`Generated ${captions.length} captions`)
      }
    } catch (error) {
      console.error("Caption generation error:", error)
      toast.error("Failed to generate captions")
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGenerateCaptions}
        disabled={disabled || isLoading}
        variant={isLoading ? "outline" : "default"}
        className="w-full h-10 gap-2"
      >
        <Zap size={18} className={isLoading ? "animate-pulse" : ""} />
        {isLoading ? "Generating Captions..." : "Auto Caption"}
      </Button>

      {/* Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="w-full bg-muted rounded-full h-2 overflow-hidden origin-left"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-primary rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Automatically transcribe audio and generate synced captions
      </p>
    </div>
  )
}

export default AutoCaptionButton
