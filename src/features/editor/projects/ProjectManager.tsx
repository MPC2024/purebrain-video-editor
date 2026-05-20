'use client'

import { useCallback, useState } from 'react'
import { useProjectStorage } from './use-project-storage'
import { VideoProject } from './project-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Copy,
  Trash2,
  MoreVertical,
  Plus,
  Clock,
  Grid,
  FileVideo,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

interface ProjectManagerProps {
  onSelectProject?: (project: VideoProject) => void
  onCreateNew?: () => void
}

export default function ProjectManager({
  onSelectProject,
  onCreateNew,
}: ProjectManagerProps) {
  const {
    projects,
    createProject,
    deleteProject,
    duplicateProject,
    renameProject,
  } = useProjectStorage()

  const [showNewDialog, setShowNewDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState('Untitled Video')
  const [renameTarget, setRenameTarget] = useState<VideoProject | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required')
      return
    }
    const project = createProject(newProjectName)
    toast.success('Project created successfully')
    setShowNewDialog(false)
    setNewProjectName('Untitled Video')
    onSelectProject?.(project)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      deleteProject(id)
      toast.success('Project deleted')
    }
  }

  const handleDuplicateProject = (id: string) => {
    const duplicated = duplicateProject(id)
    if (duplicated) {
      toast.success('Project duplicated')
      onSelectProject?.(duplicated)
    }
  }

  const handleRenameProject = (project: VideoProject) => {
    setRenameTarget(project)
    setRenameValue(project.name)
    setShowRenameDialog(true)
  }

  const confirmRename = () => {
    if (!renameValue.trim()) {
      toast.error('Project name is required')
      return
    }
    if (renameTarget) {
      renameProject(renameTarget.id, renameValue)
      toast.success('Project renamed')
    }
    setShowRenameDialog(false)
    setRenameTarget(null)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Empty'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    if (mins === 0) return `${secs}s`
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setShowNewDialog(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg border-2 border-dashed border-border">
          <FileVideo className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-center text-muted-foreground mb-4">
            No projects yet. Create your first video project.
          </p>
          <Button
            onClick={() => setShowNewDialog(true)}
            variant="outline"
          >
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-lg border border-border bg-card hover:border-primary/50 transition-colors overflow-hidden"
            >
              {/* Thumbnail */}
              <div
                className={`h-32 bg-gradient-to-br ${project.thumbnailGradient} relative`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <FileVideo className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {project.aspectRatio}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(project.updatedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Grid className="h-3 w-3" />
                    {formatDuration(project.duration)}
                  </div>
                </div>

                {/* Auto-save indicator */}
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-muted-foreground">Saved</span>
                </div>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onSelectProject?.(project)}
                    >
                      <span>Open</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRenameProject(project)}
                    >
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicateProject(project.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Give your project a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="My awesome video"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-project">Project Name</Label>
              <Input
                id="rename-project"
                placeholder="Project name"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRenameDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
