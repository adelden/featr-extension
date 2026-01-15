import { Projet } from './project.model';

export interface Feature {
  id: string;
  name: string;
  projectId: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  startedAt?: number;
  completedAt?: number;
  timeSpentMinutes: number;
  createdAt: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'fr' | 'en';
  idleThresholdMinutes: number;
  sidebarWidth: number;
}

export interface StorageSchema {
  projects: Record<string, Projet>;
  features: Record<string, Feature>;
  activeProjectId: string | null;
  activeFeatureId: string | null;
  preferences: UserPreferences;
  version: number;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'en',
  idleThresholdMinutes: 5,
  sidebarWidth: 400,
};
