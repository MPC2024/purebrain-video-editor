'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjectStorage } from '../projects/use-project-storage'
import { ASPECT_RATIOS } from '../projects/project-types'
import { Settings, Trash2, Package, Palette, HelpCircle, Info } from 'lucide-react'
import { toast } from 'sonner'

interface SettingsPanelProps {
  projectName?: string
  onSettingChange?: (key: string, value: any) => void
}

const EXPORT_QUALITIES = [
  { value: '720p', label: '720p (HD)', fileSize: '~100MB' },
  { value: '1080p', label: '1080p (Full HD)', fileSize: '~250MB' },
  { value: '4k', label: '4K (Ultra HD)', fileSize: '~1GB' },
]

const FPS_OPTIONS = [
  { value: '24', label: '24 FPS (Film)' },
  { value: '30', label: '30 FPS (Standard)' },
  { value: '60', label: '60 FPS (Smooth)' },
]

export default function SettingsPanel({
  projectName = 'Untitled Video',
  onSettingChange,
}: SettingsPanelProps) {
  const { getStorageStats, clearAllProjects } = useProjectStorage()
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    projectName,
    aspectRatio: '9:16',
    autoSave: true,
    exportQuality: '1080p',
    fps: '30',
    theme: 'dark',
  })

  const stats = getStorageStats()

  const handleSettingChange = useCallback(
    (key: string, value: any) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
      onSettingChange?.(key, value)
    },
    [onSettingChange]
  )

  const handleClearCache = () => {
    if (confirm('This will clear all browser cache. Continue?')) {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name))
          toast.success('Cache cleared')
        })
      }
    }
  }

  const handleClearAllProjects = () => {
    if (
      confirm(
        'This will permanently delete all projects and cannot be undone. Are you sure?'
      )
    ) {
      clearAllProjects()
      toast.success('All projects deleted')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your editor preferences and project settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="project-name-input">Project Name</Label>
              <Input
                id="project-name-input"
                value={settings.projectName}
                onChange={(e) => handleSettingChange('projectName', e.target.value)}
                placeholder="My awesome video"
              />
              <p className="text-xs text-muted-foreground">
                Name of your current project
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="aspect-ratio-select">Default Aspect Ratio</Label>
              <Select
                value={settings.aspectRatio}
                onValueChange={(value) =>
                  handleSettingChange('aspectRatio', value)
                }
              >
                <SelectTrigger id="aspect-ratio-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ASPECT_RATIOS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.label} ({key})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Default aspect ratio for new projects
              </p>
            </div>

            <div className="flex items-center justify-between space-y-2">
              <div>
                <Label htmlFor="autosave-toggle">Auto-Save</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically save every 30 seconds
                </p>
              </div>
              <Switch
                id="autosave-toggle"
                checked={settings.autoSave}
                onCheckedChange={(checked) =>
                  handleSettingChange('autoSave', checked)
                }
              />
            </div>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="export-quality">Export Quality</Label>
              <Select
                value={settings.exportQuality}
                onValueChange={(value) =>
                  handleSettingChange('exportQuality', value)
                }
              >
                <SelectTrigger id="export-quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_QUALITIES.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label} ({q.fileSize})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Default resolution for exported videos
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="fps-select">Frames Per Second (FPS)</Label>
              <Select
                value={settings.fps}
                onValueChange={(value) => handleSettingChange('fps', value)}
              >
                <SelectTrigger id="fps-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FPS_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Frame rate for timeline playback and export
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">
                Recommended Settings
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• TikTok / Instagram Reels: 1080p @ 30 FPS</li>
                <li>• YouTube Shorts: 1080p @ 30 FPS</li>
                <li>• YouTube Regular: 1080p @ 60 FPS</li>
                <li>• Instagram Story: 720p @ 30 FPS</li>
              </ul>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleSettingChange('theme', value)}
              >
                <SelectTrigger id="theme-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose your preferred color theme
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg space-y-3">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Brand Kit
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Manage your brand colors, fonts, and styles
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Open Brand Kit
              </Button>
            </div>
          </TabsContent>

          {/* Storage Tab */}
          <TabsContent value="storage" className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Storage Used
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.sizeInMB} MB
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Projects
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.projectCount}
                </p>
              </div>
            </div>

            <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Storage Information
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Your projects are stored locally in your browser. They are not
                synced to the cloud and will be lost if you clear your browser
                data.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleClearCache}
              >
                <Package className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleClearAllProjects}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All Projects
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
          <HelpCircle className="h-3 w-3" />
          <span>
            Version 0.1.0 | Settings are saved automatically
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
