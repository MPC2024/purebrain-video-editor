"use client"

import { useState } from "react"
import {
  FileImage,
  Type,
  Wand2,
  Music,
  Download,
} from "lucide-react"
import BottomSheet from "./BottomSheet"
import { motion } from "framer-motion"

interface MobileTabBarProps {
  onMediaClick?: () => void
  onTextClick?: () => void
  onEffectsClick?: () => void
  onAudioClick?: () => void
  onExportClick?: () => void
  mediaContent?: React.ReactNode
  textContent?: React.ReactNode
  effectsContent?: React.ReactNode
  audioContent?: React.ReactNode
  exportContent?: React.ReactNode
}

type TabType = "media" | "text" | "effects" | "audio" | "export" | null

const MobileTabBar = ({
  onMediaClick,
  onTextClick,
  onEffectsClick,
  onAudioClick,
  onExportClick,
  mediaContent,
  textContent,
  effectsContent,
  audioContent,
  exportContent,
}: MobileTabBarProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(null)

  const tabs = [
    { id: "media", label: "Media", icon: FileImage, content: mediaContent, onClick: onMediaClick },
    { id: "text", label: "Text", icon: Type, content: textContent, onClick: onTextClick },
    { id: "effects", label: "Effects", icon: Wand2, content: effectsContent, onClick: onEffectsClick },
    { id: "audio", label: "Audio", icon: Music, content: audioContent, onClick: onAudioClick },
    { id: "export", label: "Export", icon: Download, content: exportContent, onClick: onExportClick },
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

  return (
    <>
      {/* Fixed Tab Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-border/50 px-2 py-2 flex justify-around gap-1 z-40 safe-bottom"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as TabType)}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all flex-1 min-h-[60px] ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon size={24} strokeWidth={1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
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
        {activeTabData?.content}
      </BottomSheet>
    </>
  )
}

export default MobileTabBar
