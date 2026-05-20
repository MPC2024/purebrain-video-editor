"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"

interface ExportPreset {
  id: string
  name: string
  description: string
  width: number
  height: number
  aspectRatio: string
  fps: number
}

const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: "youtube",
    name: "YouTube",
    description: "Full HD widescreen",
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
    fps: 30,
  },
  {
    id: "tiktok",
    name: "TikTok / Reels",
    description: "Vertical portrait",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    fps: 30,
  },
  {
    id: "instagram-square",
    name: "Instagram Square",
    description: "Perfect for posts",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    fps: 30,
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    description: "Vertical for stories",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    fps: 30,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    description: "HD landscape",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
    fps: 30,
  },
]

type QualityLevel = "low" | "medium" | "high"

interface ExportModalProps {
  onExport?: (preset: ExportPreset, quality: QualityLevel) => void
  isExporting?: boolean
}

const ExportModal = ({ onExport, isExporting = false }: ExportModalProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string>("youtube")
  const [quality, setQuality] = useState<QualityLevel>("medium")

  const preset = EXPORT_PRESETS.find((p) => p.id === selectedPreset)

  const qualityOptions = {
    low: "720p",
    medium: "1080p",
    high: "4K",
  }

  const handleExport = () => {
    if (preset) {
      onExport?.(preset, quality)
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Preset Selection */}
      <div>
        <Label htmlFor="preset" className="text-base font-semibold mb-3 block">
          Export Platform
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {EXPORT_PRESETS.map((p) => (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPreset(p.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPreset === p.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/50 bg-muted/30"
              }`}
            >
              <h4 className="font-semibold text-sm">{p.name}</h4>
              <p className="text-xs text-muted-foreground">{p.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {p.width}x{p.height} ({p.aspectRatio})
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quality Selection */}
      <div>
        <Label htmlFor="quality" className="text-base font-semibold mb-3 block">
          Output Quality
        </Label>
        <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - 720p (Smaller file)</SelectItem>
            <SelectItem value="medium">Medium - 1080p (Recommended)</SelectItem>
            <SelectItem value="high">High - 4K (Larger file)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      {preset && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-lg"
        >
          <h4 className="text-sm font-semibold mb-2">Preview</h4>
          <div
            className="bg-black rounded border border-border/50 mx-auto mb-3 flex items-center justify-center"
            style={{
              aspectRatio: `${preset.width}/${preset.height}`,
              maxWidth: "100%",
              width: "100%",
            }}
          >
            <span className="text-xs text-muted-foreground">
              {preset.aspectRatio}
            </span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Resolution: {preset.width}x{preset.height}</p>
            <p>Quality: {qualityOptions[quality]}</p>
            <p>Frame Rate: {preset.fps} fps</p>
          </div>
        </motion.div>
      )}

      {/* Export Button */}
      <Button
        onClick={handleExport}
        disabled={isExporting}
        size="lg"
        className="w-full h-12 text-base"
      >
        {isExporting ? "Exporting..." : "Export Video"}
      </Button>
    </div>
  )
}

export default ExportModal
