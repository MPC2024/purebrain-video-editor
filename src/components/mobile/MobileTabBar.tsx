"use client"

import { useState } from "react"
import {
  FileImage,
  Type,
  Wand2,
  Music,
  Download,
  Zap,
  Film,
  Settings,
} from "lucide-react"
import BottomSheet from "./BottomSheet"
import { motion } from "framer-motion"

interface MobileTabBarProps {
  onMediaClick?: () => void
  onTextClick?: () => void
  onEffectsClick?: () => void
  onAudioClick?: () => void
  onExportClick?: () => void
  onAnimationClick?: () => void
  onTemplateClick?: () => void
  onSettingsClick?: () => void
  onBrandKitClick?: () => void
  mediaContent?: React.ReactNode
  textContent?: React.ReactNode
  effectsContent?: React.ReactNode
  audioContent?: React.ReactNode
  exportContent?: React.ReactNode
  animationContent?: React.ReactNode
  templateContent?: React.ReactNode
  musicContent?: React.ReactNode
  soundFxContent?: React.ReactNode
  stickerContent?: React.ReactNode
  cropContent?: React.ReactNode
  speedContent?: React.ReactNode
  brandKitContent?: React.ReactNode
  settingsContent?: React.ReactNode
}

type TabType = "media" | "text" | "effects" | "audio" | "export" | "animation" | "template" | "settings" | "brandkit" | null
type MediaSubTabType = "videos" | "music" | "soundfx" | null
type EffectsSubTabType = "filters" | "stickers" | "speed" | "crop" | null

const MobileTabBar = ({
  onMediaClick,
  onTextClick,
  onEffectsClick,
  onAudioClick,
  onExportClick,
  onAnimationClick,
  onTemplateClick,
  onSettingsClick,
  onBrandKitClick,
  mediaContent,
  textContent,
  effectsContent,
  audioContent,
  exportContent,
  animationContent,
  templateContent,
  musicContent,
  soundFxContent,
  stickerContent,
  cropContent,
  speedContent,
  brandKitContent,
  settingsContent,
}: MobileTabBarProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(null)
  const [mediaSubTab, setMediaSubTab] = useState<MediaSubTabType>("videos")
  const [effectsSubTab, setEffectsSubTab] = useState<EffectsSubTabType>("filters")

  const tabs = [
    { id: "media", label: "Media", icon: FileImage, onClick: onMediaClick },
    { id: "text", label: "Text", icon: Type, content: textContent, onClick: onTextClick },
    { id: "effects", label: "Effects", icon: Wand2, onClick: onEffectsClick },
    { id: "audio", label: "Audio", icon: Music, content: audioContent, onClick: onAudioClick },
    { id: "animation", label: "Animate", icon: Zap, content: animationContent, onClick: onAnimationClick },
    { id: "template", label: "Templates", icon: Film, content: templateContent, onClick: onTemplateClick },
    { id: "export", label: "Export", icon: Download, content: exportContent, onClick: onExportClick },
    { id: "brandkit", label: "Brand Kit", icon: Settings, onClick: onBrandKitClick },
    { id: "settings", label: "Settings", icon: Settings, content: settingsContent, onClick: onSettingsClick },
  ]

  const handleTabClick = (tabId: TabType) => {
    if (activeTab === tabId) {
      setActiveTab(null)
    } else {
      setActiveTab(tabId)
      const tab = tabs.find((t) => t.id === tabId)
      tab?.onClick?.()
    }
  }

  const activeTabData = tabs.find((t) => t.id === activeTab)

  // Helper to render tab content with sub-tabs for Media
  const renderMediaContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-4 py-3 border-b border-border">
        <button
          onClick={() => setMediaSubTab("videos")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            mediaSubTab === "videos"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Videos/Photos
        </button>
        <button
          onClick={() => setMediaSubTab("music")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            mediaSubTab === "music"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Music
        </button>
        <button
          onClick={() => setMediaSubTab("soundfx")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            mediaSubTab === "soundfx"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Sound FX
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {mediaSubTab === "videos" && mediaContent}
        {mediaSubTab === "music" && musicContent}
        {mediaSubTab === "soundfx" && soundFxContent}
      </div>
    </div>
  )

  // Helper to render tab content with sub-tabs for Effects
  const renderEffectsContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-4 py-3 border-b border-border overflow-x-auto">
        <button
          onClick={() => setEffectsSubTab("filters")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
            effectsSubTab === "filters"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Filters
        </button>
        <button
          onClick={() => setEffectsSubTab("stickers")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
            effectsSubTab === "stickers"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Stickers
        </button>
        <button
          onClick={() => setEffectsSubTab("speed")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
            effectsSubTab === "speed"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Speed
        </button>
        <button
          onClick={() => setEffectsSubTab("crop")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
            effectsSubTab === "crop"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Crop
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {effectsSubTab === "filters" && effectsContent}
        {effectsSubTab === "stickers" && stickerContent}
        {effectsSubTab === "speed" && speedContent}
        {effectsSubTab === "crop" && cropContent}
      </div>
    </div>
  )

  return (
    <>
      {/* Fixed Tab Bar - Scrollable */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-border/50 px-1 py-2 overflow-x-auto flex gap-1 z-40 safe-bottom scrollbar-hide"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as TabType)}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all flex-shrink-0 min-h-[60px] min-w-[60px] ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-xs font-medium text-center">{tab.label}</span>
            </button>
          )
        })}
      </motion.div>

      {/* Bottom Sheet with Tab Content */}
      <BottomSheet
        isOpen={activeTab !== null}
        onClose={() => setActiveTab(null)}
        title={activeTabData?.label}
      >
        {activeTab === "media" && renderMediaContent()}
        {activeTab === "effects" && renderEffectsContent()}
        {activeTab === "brandkit" && brandKitContent}
        {activeTab === "settings" && settingsContent}
        {activeTab !== "media" && activeTab !== "effects" && activeTab !== "brandkit" && activeTab !== "settings" && activeTabData?.content}
      </BottomSheet>
    </>
  )
}

export default MobileTabBar
