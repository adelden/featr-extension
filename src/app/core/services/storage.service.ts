import { Injectable } from '@angular/core';
import { StorageSchema } from '../models/storage.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storageArea = this.getChromeStorage();

  private getChromeStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return chrome.storage.local;
    }
    return null;
  }

  async get<K extends keyof StorageSchema>(
    key: K
  ): Promise<StorageSchema[K] | null> {
    try {
      if (this.storageArea) {
        const result = await this.storageArea.get(key);
        return (result[key] as StorageSchema[K]) ?? null;
      }

      const item = localStorage.getItem(key as string);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${String(key)} from storage:`, error);
      return null;
    }
  }

  async set<K extends keyof StorageSchema>(
    key: K,
    value: StorageSchema[K]
  ): Promise<void> {
    try {
      if (this.storageArea) {
        await this.storageArea.set({ [key]: value });
        return;
      }

      localStorage.setItem(key as string, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${String(key)} in storage:`, error);
      throw error;
    }
  }

  async getAll(): Promise<Partial<StorageSchema>> {
    try {
      if (this.storageArea) {
        return await this.storageArea.get(null);
      }

      const result: Partial<StorageSchema> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            result[key as keyof StorageSchema] = JSON.parse(value);
          }
        }
      }
      return result;
    } catch (error) {
      console.error('Error getting all from storage:', error);
      return {};
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.storageArea) {
        await this.storageArea.clear();
        return;
      }

      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}
