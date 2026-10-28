import { SavedProject } from '../types';

const STORAGE_KEY = 'daily_earn_pro_projects_v1';

export function getSavedProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load projects from localStorage:', error);
    return [];
  }
}

export function saveProject(project: Omit<SavedProject, 'id' | 'createdAt'> & { id?: string }): { success: boolean; project?: SavedProject; error?: string } {
  try {
    const existing = getSavedProjects();
    const newProject: SavedProject = {
      ...project,
      id: project.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
    };

    // If project already exists with same id, update it, otherwise prepend
    const index = existing.findIndex((p) => p.id === newProject.id);
    if (index >= 0) {
      existing[index] = newProject;
    } else {
      existing.unshift(newProject);
    }

    // Limit to 40 items to prevent exceeding mobile localStorage quota
    const trimmed = existing.slice(0, 40);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return { success: true, project: newProject };
  } catch (error: any) {
    console.error('Failed to save project:', error);
    if (error?.name === 'QuotaExceededError' || error?.code === 22) {
      return {
        success: false,
        error: 'Storage quota exceeded. Please delete some old saved items from My Work.',
      };
    }
    return { success: false, error: 'Could not save project to local storage.' };
  }
}

export function deleteProject(id: string): boolean {
  try {
    const existing = getSavedProjects();
    const filtered = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return false;
  }
}

export function clearAllProjects(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
}

export function getStorageUsageKB(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    return Math.round((new Blob([raw]).size) / 1024);
  } catch {
    return 0;
  }
}
