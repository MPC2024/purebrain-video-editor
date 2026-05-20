import { useCallback, useEffect, useState } from 'react'
import { VideoProject } from './project-types'

const STORAGE_KEY = 'purebrain-projects'
const AUTOSAVE_INTERVAL = 30000 // 30 seconds

export function useProjectStorage() {
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            setProjects(Array.isArray(parsed) ? parsed : [])
          }
        }
      } catch (error) {
        console.error('[ProjectStorage] Failed to load projects:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadProjects()
  }, [])

  // Save projects to localStorage
  const persistProjects = useCallback((projectsToSave: VideoProject[]) => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToSave))
        setLastSaved(Date.now())
        setHasUnsavedChanges(false)
      }
    } catch (error) {
      console.error('[ProjectStorage] Failed to save projects:', error)
    }
  }, [])

  // Create new project
  const createProject = useCallback(
    (name: string, aspectRatio: string = '9:16'): VideoProject => {
      const gradients = [
        'from-pink-500 to-purple-600',
        'from-blue-500 to-cyan-400',
        'from-green-500 to-emerald-600',
        'from-orange-500 to-red-600',
        'from-indigo-500 to-blue-600',
        'from-violet-500 to-purple-600',
      ]

      const newProject: VideoProject = {
        id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        duration: 0,
        aspectRatio,
        thumbnailGradient: gradients[Math.floor(Math.random() * gradients.length)],
      }

      const updatedProjects = [newProject, ...projects]
      setProjects(updatedProjects)
      setHasUnsavedChanges(true)
      persistProjects(updatedProjects)
      return newProject
    },
    [projects, persistProjects]
  )

  // Save/update project
  const saveProject = useCallback(
    (project: VideoProject) => {
      const updatedProjects = projects.map((p) =>
        p.id === project.id ? { ...project, updatedAt: Date.now() } : p
      )
      setProjects(updatedProjects)
      setHasUnsavedChanges(true)
      persistProjects(updatedProjects)
    },
    [projects, persistProjects]
  )

  // Load project by ID
  const loadProject = useCallback((id: string) => {
    return projects.find((p) => p.id === id) || null
  }, [projects])

  // List all projects (sorted by updatedAt descending)
  const listProjects = useCallback(() => {
    return [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  }, [projects])

  // Delete project
  const deleteProject = useCallback(
    (id: string) => {
      const updatedProjects = projects.filter((p) => p.id !== id)
      setProjects(updatedProjects)
      setHasUnsavedChanges(true)
      persistProjects(updatedProjects)
    },
    [projects, persistProjects]
  )

  // Duplicate project
  const duplicateProject = useCallback(
    (id: string): VideoProject | null => {
      const projectToDuplicate = loadProject(id)
      if (!projectToDuplicate) return null

      const newProject: VideoProject = {
        ...projectToDuplicate,
        id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: `${projectToDuplicate.name} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const updatedProjects = [newProject, ...projects]
      setProjects(updatedProjects)
      setHasUnsavedChanges(true)
      persistProjects(updatedProjects)
      return newProject
    },
    [projects, loadProject, persistProjects]
  )

  // Rename project
  const renameProject = useCallback(
    (id: string, newName: string) => {
      const updated = projects.map((p) =>
        p.id === id ? { ...p, name: newName, updatedAt: Date.now() } : p
      )
      setProjects(updated)
      setHasUnsavedChanges(true)
      persistProjects(updated)
    },
    [projects, persistProjects]
  )

  // Clear all projects
  const clearAllProjects = useCallback(() => {
    setProjects([])
    setHasUnsavedChanges(false)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Get storage stats
  const getStorageStats = useCallback(() => {
    let stored = ''
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      stored = localStorage.getItem(STORAGE_KEY) || ''
    }
    const sizeInBytes = new Blob([stored]).size
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2)
    const projectCount = projects.length
    return { sizeInBytes, sizeInMB, projectCount }
  }, [projects])

  return {
    projects: listProjects(),
    isLoaded,
    lastSaved,
    hasUnsavedChanges,
    createProject,
    saveProject,
    loadProject,
    listProjects,
    deleteProject,
    duplicateProject,
    renameProject,
    clearAllProjects,
    getStorageStats,
    persistProjects,
  }
}
