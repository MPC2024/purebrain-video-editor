'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { HelpCircle, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Shortcut {
  category: string
  action: string
  keys: string[]
  description: string
}

const SHORTCUTS: Shortcut[] = [
  // Playback
  {
    category: 'Playback',
    action: 'Play / Pause',
    keys: ['Space'],
    description: 'Start or pause video playback',
  },
  {
    category: 'Playback',
    action: 'Frame Step Forward',
    keys: ['Right Arrow'],
    description: 'Move one frame forward',
  },
  {
    category: 'Playback',
    action: 'Frame Step Backward',
    keys: ['Left Arrow'],
    description: 'Move one frame backward',
  },
  {
    category: 'Playback',
    action: 'Jump 10 Frames',
    keys: ['Shift', 'Right'],
    description: 'Jump 10 frames forward',
  },

  // Editing
  {
    category: 'Editing',
    action: 'Undo',
    keys: ['Ctrl/Cmd', 'Z'],
    description: 'Undo last action',
  },
  {
    category: 'Editing',
    action: 'Redo',
    keys: ['Ctrl/Cmd', 'Shift', 'Z'],
    description: 'Redo last undone action',
  },
  {
    category: 'Editing',
    action: 'Split Clip',
    keys: ['S'],
    description: 'Split clip at playhead position',
  },
  {
    category: 'Editing',
    action: 'Delete Selected',
    keys: ['Delete', 'Backspace'],
    description: 'Delete selected clip or element',
  },
  {
    category: 'Editing',
    action: 'Duplicate',
    keys: ['Ctrl/Cmd', 'D'],
    description: 'Duplicate selected element',
  },
  {
    category: 'Editing',
    action: 'Copy',
    keys: ['Ctrl/Cmd', 'C'],
    description: 'Copy selected element',
  },
  {
    category: 'Editing',
    action: 'Paste',
    keys: ['Ctrl/Cmd', 'V'],
    description: 'Paste from clipboard',
  },

  // Selection
  {
    category: 'Selection',
    action: 'Select All',
    keys: ['Ctrl/Cmd', 'A'],
    description: 'Select all clips on track',
  },
  {
    category: 'Selection',
    action: 'Deselect All',
    keys: ['Escape'],
    description: 'Deselect all items',
  },
  {
    category: 'Selection',
    action: 'Multi-Select',
    keys: ['Shift', 'Click'],
    description: 'Add to selection',
  },

  // Zoom & View
  {
    category: 'Zoom & View',
    action: 'Zoom In',
    keys: ['+', 'Scroll'],
    description: 'Zoom timeline in',
  },
  {
    category: 'Zoom & View',
    action: 'Zoom Out',
    keys: ['-', 'Scroll'],
    description: 'Zoom timeline out',
  },
  {
    category: 'Zoom & View',
    action: 'Fit to Window',
    keys: ['0'],
    description: 'Fit timeline to window',
  },
  {
    category: 'Zoom & View',
    action: 'Fullscreen',
    keys: ['F'],
    description: 'Toggle fullscreen mode',
  },

  // Export & Save
  {
    category: 'Export & Save',
    action: 'Save Project',
    keys: ['Ctrl/Cmd', 'S'],
    description: 'Save current project',
  },
  {
    category: 'Export & Save',
    action: 'Export Video',
    keys: ['Ctrl/Cmd', 'E'],
    description: 'Open export dialog',
  },
  {
    category: 'Export & Save',
    action: 'Quick Export',
    keys: ['Ctrl/Cmd', 'Shift', 'E'],
    description: 'Export with last settings',
  },

  // Advanced
  {
    category: 'Advanced',
    action: 'Show Shortcuts',
    keys: ['?'],
    description: 'Open this help menu',
  },
  {
    category: 'Advanced',
    action: 'Settings',
    keys: ['Ctrl/Cmd', ','],
    description: 'Open settings',
  },
]

const CATEGORIES = [...new Set(SHORTCUTS.map((s) => s.category))]

interface ShortcutsPanelProps {
  onClose?: () => void
}

export default function ShortcutsPanel({ onClose }: ShortcutsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return SHORTCUTS

    const query = searchQuery.toLowerCase()
    return SHORTCUTS.filter(
      (s) =>
        s.action.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.keys.some((k) => k.toLowerCase().includes(query))
    )
  }, [searchQuery])

  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, Shortcut[]> = {}
    filtered.forEach((s) => {
      if (!groups[s.category]) groups[s.category] = []
      groups[s.category].push(s)
    })
    return groups
  }, [filtered])

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Keyboard shortcuts"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Master your editing workflow with these keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shortcuts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        {/* Shortcuts by Category */}
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No shortcuts found for "{searchQuery}"
          </div>
        ) : (
          <div className="space-y-8">
            {CATEGORIES.map((category) => {
              const categoryShortcuts = groupedShortcuts[category]
              if (!categoryShortcuts) return null

              return (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {shortcut.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shortcut.description}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {shortcut.keys.map((key, keyIdx) => (
                            <div key={keyIdx}>
                              <Kbd>{key}</Kbd>
                              {keyIdx < shortcut.keys.length - 1 && (
                                <span className="mx-1 text-xs text-muted-foreground">
                                  +
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer tip */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            Tip: Press <Kbd>?</Kbd> anytime to open this shortcuts menu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
