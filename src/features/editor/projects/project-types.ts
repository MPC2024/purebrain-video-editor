export interface VideoProject {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  duration: number // seconds
  aspectRatio: string // e.g., "9:16", "16:9", "1:1"
  thumbnailGradient: string // CSS gradient for thumbnail
  data?: any // scene state serialization (optional for now)
  tags?: string[]
}

export type AspectRatioOption = '9:16' | '16:9' | '1:1' | '4:5' | '4:3'

export const ASPECT_RATIOS: Record<AspectRatioOption, { width: number; height: number; label: string }> = {
  '9:16': { width: 9, height: 16, label: 'Instagram Story / TikTok' },
  '16:9': { width: 16, height: 9, label: 'YouTube / Landscape' },
  '1:1': { width: 1, height: 1, label: 'Square / Instagram Feed' },
  '4:5': { width: 4, height: 5, label: 'Instagram Reels' },
  '4:3': { width: 4, height: 3, label: 'Standard' },
}

export const DEFAULT_PROJECT_SETTINGS = {
  aspectRatio: '9:16' as AspectRatioOption,
  duration: 0,
  fps: 30,
  exportQuality: '1080p',
}
