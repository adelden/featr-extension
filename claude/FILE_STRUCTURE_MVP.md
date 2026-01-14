# 📁 featr — Structure de Fichiers MVP

> **Version** : 2.1.0  
> **Date** : Janvier 2025  
> **Stack** : Angular 20 + NgRx Signal Store + Chrome Extension Manifest V3

---

## 1. Vue d'ensemble

Cette structure suit les **best practices Angular 2025** :

- Standalone components (pas de NgModules)
- Feature-based organization
- NgRx Signal Store pour le state management
- Separation Smart/Dumb components
- Barrel exports (index.ts)

---

## 2. Structure complète

```
featr-extension/
│
├── 📁 src/
│   │
│   ├── 📁 app/
│   │   │
│   │   ├── 📁 core/                              # Singleton services & foundational code
│   │   │   │
│   │   │   ├── 📁 models/                        # Interfaces & Types
│   │   │   │   ├── project.model.ts              # Project, Repository, Tools interfaces
│   │   │   │   ├── feature.model.ts              # Feature, CustomTab interfaces
│   │   │   │   ├── session.model.ts              # TimeSession interface
│   │   │   │   ├── preferences.model.ts          # UserPreferences interface
│   │   │   │   ├── chrome-messages.model.ts      # Message types for Service Worker
│   │   │   │   └── index.ts                      # Barrel export
│   │   │   │
│   │   │   ├── 📁 constants/                     # Configuration constants
│   │   │   │   ├── platform-urls.const.ts        # URLs for Trello, Notion, Figma, GitHub
│   │   │   │   ├── storage-keys.const.ts         # Chrome Storage keys
│   │   │   │   ├── tab-group-colors.const.ts     # Available colors for tab groups
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 services/                      # Chrome API wrappers
│   │   │   │   ├── tabs.service.ts               # chrome.tabs wrapper
│   │   │   │   ├── tab-groups.service.ts         # chrome.tabGroups wrapper
│   │   │   │   ├── storage.service.ts            # chrome.storage.local wrapper
│   │   │   │   ├── clipboard.service.ts          # navigator.clipboard wrapper
│   │   │   │   ├── background-messaging.service.ts # Communication with Service Worker
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 utils/                         # Pure utility functions
│   │   │   │   ├── trello-parser.util.ts         # Parse Trello card URL & description
│   │   │   │   ├── time-formatter.util.ts        # Format durations (2h 34m)
│   │   │   │   ├── url-validator.util.ts         # Validate URLs
│   │   │   │   ├── uuid.util.ts                  # Generate UUIDs
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts                          # Core barrel export
│   │   │
│   │   ├── 📁 store/                             # NgRx Signal Store
│   │   │   │
│   │   │   ├── 📁 projects/
│   │   │   │   ├── projects.store.ts             # signalStore with withEntities<Project>
│   │   │   │   ├── projects.store.spec.ts        # Unit tests
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 features/
│   │   │   │   ├── features.store.ts             # signalStore with withEntities<Feature>
│   │   │   │   ├── features.store.spec.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 sessions/
│   │   │   │   ├── sessions.store.ts             # signalStore with withEntities<TimeSession>
│   │   │   │   ├── sessions.store.spec.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 ui/
│   │   │   │   ├── ui.store.ts                   # UI state (theme, language, sidebar width)
│   │   │   │   ├── ui.store.spec.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 timer/
│   │   │   │   ├── timer.store.ts                # Timer state (isRunning, isPaused, currentSessionId)
│   │   │   │   ├── timer.store.spec.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 custom-features/               # Reusable store features
│   │   │   │   ├── with-chrome-storage-sync.feature.ts
│   │   │   │   ├── with-loading-state.feature.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts                          # Store barrel export
│   │   │
│   │   ├── 📁 features/                          # Feature modules (UI features)
│   │   │   │
│   │   │   ├── 📁 header/
│   │   │   │   ├── header.component.ts           # Smart component
│   │   │   │   ├── header.component.html
│   │   │   │   ├── header.component.scss
│   │   │   │   ├── header.component.spec.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 project-selector/
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── project-dropdown.component.ts      # Dumb
│   │   │   │   │   └── project-form-dialog.component.ts   # Dumb
│   │   │   │   ├── project-selector.component.ts          # Smart (container)
│   │   │   │   ├── project-selector.component.html
│   │   │   │   ├── project-selector.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 active-feature/
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── timer-display.component.ts         # Dumb - Shows timer
│   │   │   │   │   ├── progress-bar.component.ts          # Dumb - Progress visualization
│   │   │   │   │   ├── tab-group-list.component.ts        # Dumb - Shows tabs in group
│   │   │   │   │   ├── feature-actions.component.ts       # Dumb - Pause/Complete buttons
│   │   │   │   │   └── empty-state.component.ts           # Dumb - No active feature
│   │   │   │   ├── active-feature.component.ts            # Smart (container)
│   │   │   │   ├── active-feature.component.html
│   │   │   │   ├── active-feature.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 feature-list/
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── feature-card.component.ts          # Dumb - Single feature card
│   │   │   │   │   ├── feature-filters.component.ts       # Dumb - Priority/Status filters
│   │   │   │   │   ├── feature-form-dialog.component.ts   # Dumb - Create/Edit form
│   │   │   │   │   └── import-trello-dialog.component.ts  # Dumb - Trello import modal
│   │   │   │   ├── feature-list.component.ts              # Smart (container)
│   │   │   │   ├── feature-list.component.html
│   │   │   │   ├── feature-list.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 stats-dashboard/
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── stat-card.component.ts             # Dumb - Single stat display
│   │   │   │   │   ├── weekly-progress.component.ts       # Dumb - Week progress bar
│   │   │   │   │   └── overruns-alert.component.ts        # Dumb - Overruns warning
│   │   │   │   ├── stats-dashboard.component.ts           # Smart (container)
│   │   │   │   ├── stats-dashboard.component.html
│   │   │   │   ├── stats-dashboard.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 settings/
│   │   │   │   ├── 📁 components/
│   │   │   │   │   ├── theme-toggle.component.ts          # Dumb
│   │   │   │   │   ├── language-selector.component.ts     # Dumb
│   │   │   │   │   └── idle-settings.component.ts         # Dumb
│   │   │   │   ├── settings-dialog.component.ts           # Smart (container)
│   │   │   │   ├── settings-dialog.component.html
│   │   │   │   ├── settings-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 completion-summary/
│   │   │   │   ├── completion-summary-dialog.component.ts # Modal after completing feature
│   │   │   │   ├── completion-summary-dialog.component.html
│   │   │   │   ├── completion-summary-dialog.component.scss
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts                          # Features barrel export
│   │   │
│   │   ├── 📁 shared/                            # Shared UI components & pipes
│   │   │   │
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 confirm-dialog/
│   │   │   │   │   ├── confirm-dialog.component.ts
│   │   │   │   │   ├── confirm-dialog.component.html
│   │   │   │   │   └── confirm-dialog.component.scss
│   │   │   │   ├── 📁 toast/
│   │   │   │   │   └── toast.component.ts        # Custom toast notifications
│   │   │   │   ├── 📁 loading-spinner/
│   │   │   │   │   └── loading-spinner.component.ts
│   │   │   │   ├── 📁 priority-badge/
│   │   │   │   │   └── priority-badge.component.ts # P0/P1/P2/P3 badge
│   │   │   │   ├── 📁 status-badge/
│   │   │   │   │   └── status-badge.component.ts  # Todo/In Progress/Done badge
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 pipes/
│   │   │   │   ├── duration.pipe.ts              # Format minutes to "2h 34m"
│   │   │   │   ├── relative-time.pipe.ts         # "2 hours ago"
│   │   │   │   ├── truncate.pipe.ts              # Truncate text with ellipsis
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 directives/
│   │   │   │   ├── auto-focus.directive.ts       # Auto-focus on element
│   │   │   │   ├── click-outside.directive.ts    # Detect clicks outside element
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts                          # Shared barrel export
│   │   │
│   │   ├── 📁 layout/                            # App shell components
│   │   │   ├── shell.component.ts                # Main layout container
│   │   │   ├── shell.component.html
│   │   │   ├── shell.component.scss
│   │   │   └── index.ts
│   │   │
│   │   ├── app.component.ts                      # Root component
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts                         # ApplicationConfig (providers)
│   │   └── app.routes.ts                         # Routes (minimal for side panel)
│   │
│   ├── 📁 background/                            # Service Worker (Chrome background)
│   │   ├── service-worker.ts                     # Main background script
│   │   ├── idle-handler.ts                       # chrome.idle event handlers
│   │   ├── notification-handler.ts               # chrome.notifications handlers
│   │   ├── command-handler.ts                    # chrome.commands handlers
│   │   └── message-handler.ts                    # Message routing
│   │
│   ├── 📁 content-scripts/                       # Injected into web pages
│   │   ├── 📁 command-palette/
│   │   │   ├── command-palette.ts                # Main entry point
│   │   │   ├── command-palette.styles.css        # Injected styles
│   │   │   ├── fuzzy-search.ts                   # Fuzzy search algorithm
│   │   │   └── commands.ts                       # Available commands definition
│   │   └── content-script.ts                     # Main content script entry
│   │
│   ├── 📁 assets/
│   │   ├── 📁 icons/
│   │   │   ├── icon-16.png
│   │   │   ├── icon-32.png
│   │   │   ├── icon-48.png
│   │   │   ├── icon-128.png
│   │   │   └── icon.svg                          # Source SVG
│   │   │
│   │   ├── 📁 i18n/
│   │   │   ├── fr.json                           # French translations
│   │   │   └── en.json                           # English translations
│   │   │
│   │   └── 📁 images/
│   │       └── empty-state.svg                   # Empty state illustrations
│   │
│   ├── 📁 styles/
│   │   ├── _variables.scss                       # CSS custom properties
│   │   ├── _themes.scss                          # Dark/Light theme definitions
│   │   ├── _typography.scss                      # Font definitions
│   │   ├── _animations.scss                      # Keyframes & transitions
│   │   ├── _mixins.scss                          # SCSS mixins
│   │   ├── _primeng-overrides.scss               # PrimeNG customizations
│   │   └── styles.scss                           # Main styles entry point
│   │
│   ├── 📁 environments/
│   │   ├── environment.ts                        # Development config
│   │   └── environment.prod.ts                   # Production config
│   │
│   ├── index.html                                # Side Panel HTML entry
│   ├── main.ts                                   # Angular bootstrap
│   └── polyfills.ts                              # Polyfills (if needed)
│
├── 📁 public/
│   └── manifest.json                             # Chrome Extension manifest V3
│
├── 📁 scripts/
│   ├── build-extension.js                        # Post-build script for extension
│   └── generate-icons.js                         # Generate icon sizes from SVG
│
├── 📁 docs/
│   ├── ARCHITECTURE.md                           # Architecture documentation
│   ├── CONTRIBUTING.md                           # Contribution guidelines
│   └── CHANGELOG.md                              # Version changelog
│
├── angular.json                                  # Angular CLI configuration
├── package.json                                  # NPM dependencies
├── tsconfig.json                                 # TypeScript base config
├── tsconfig.app.json                             # App-specific TS config
├── tsconfig.spec.json                            # Test-specific TS config
├── .eslintrc.json                                # ESLint configuration
├── .prettierrc                                   # Prettier configuration
├── .gitignore
└── README.md
```

---

## 3. Détails des fichiers clés

### 3.1 NgRx Signal Store - Features Store

```typescript
// src/app/store/features/features.store.ts

import { computed, inject } from "@angular/core";
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from "@ngrx/signals";
import { withEntities, addEntity, updateEntity, removeEntity, setAllEntities } from "@ngrx/signals/entities";
import { Feature, FeatureStatus, Priority } from "@core/models";
import { StorageService, TabGroupsService, TabsService } from "@core/services";
import { withChromeStorageSync } from "../custom-features";

interface FeaturesState {
  activeFeatureId: string | null;
  filter: {
    status: FeatureStatus | "all";
    priority: Priority | "all";
  };
  sortBy: "priority" | "estimation" | "name" | "createdAt";
  sortOrder: "asc" | "desc";
}

const initialState: FeaturesState = {
  activeFeatureId: null,
  filter: { status: "all", priority: "all" },
  sortBy: "priority",
  sortOrder: "asc",
};

export const FeaturesStore = signalStore(
  { providedIn: "root" },

  // Entities
  withEntities<Feature>(),

  // Additional state
  withState(initialState),

  // Chrome Storage sync
  withChromeStorageSync<Feature>("features"),

  // Computed signals
  withComputed((store) => ({
    // Active feature
    activeFeature: computed(() => {
      const id = store.activeFeatureId();
      return id ? store.entityMap()[id] ?? null : null;
    }),

    // Filtered and sorted list
    filteredFeatures: computed(() => {
      let features = store.entities();
      const { status, priority } = store.filter();

      // Filter
      if (status !== "all") {
        features = features.filter((f) => f.status === status);
      }
      if (priority !== "all") {
        features = features.filter((f) => f.priority === priority);
      }

      // Sort
      const sortBy = store.sortBy();
      const sortOrder = store.sortOrder();
      features = [...features].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case "priority":
            comparison = a.priority.localeCompare(b.priority);
            break;
          case "estimation":
            comparison = a.estimation - b.estimation;
            break;
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "createdAt":
            comparison = a.createdAt - b.createdAt;
            break;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });

      return features;
    }),

    // Status counts
    todoFeatures: computed(() => store.entities().filter((f) => f.status === "todo")),
    inProgressFeature: computed(() => store.entities().find((f) => f.status === "in-progress")),
    doneFeatures: computed(() => store.entities().filter((f) => f.status === "done")),

    // Stats
    totalEstimation: computed(() => store.entities().reduce((sum, f) => sum + f.estimation, 0)),
    totalActualTime: computed(() => store.entities().reduce((sum, f) => sum + f.actualTime, 0)),
  })),

  // Methods
  withMethods((store, tabsService = inject(TabsService), tabGroupsService = inject(TabGroupsService), storageService = inject(StorageService)) => ({
    // CRUD
    addFeature(feature: Feature): void {
      patchState(store, addEntity(feature));
      this.saveToStorage();
    },

    updateFeature(id: string, changes: Partial<Feature>): void {
      patchState(store, updateEntity({ id, changes }));
      this.saveToStorage();
    },

    deleteFeature(id: string): void {
      patchState(store, removeEntity(id));
      this.saveToStorage();
    },

    // Activation
    async activateFeature(featureId: string): Promise<void> {
      const feature = store.entityMap()[featureId];
      if (!feature) return;

      // Deactivate current if any
      const current = store.inProgressFeature();
      if (current) {
        await this.deactivateFeature(current.id);
      }

      // Update status
      patchState(store, { activeFeatureId: featureId });
      patchState(
        store,
        updateEntity({
          id: featureId,
          changes: { status: "in-progress" },
        })
      );

      // Open tabs
      const tabIds = await this.openFeatureTabs(feature);
      const groupId = await tabGroupsService.createGroup(feature.name, tabIds);

      patchState(
        store,
        updateEntity({
          id: featureId,
          changes: { tabGroupId: groupId },
        })
      );

      this.saveToStorage();
    },

    async deactivateFeature(featureId: string): Promise<void> {
      const feature = store.entityMap()[featureId];
      if (!feature) return;

      if (feature.tabGroupId) {
        await tabGroupsService.collapseGroup(feature.tabGroupId);
      }

      patchState(store, { activeFeatureId: null });
    },

    async completeFeature(featureId: string): Promise<void> {
      const feature = store.entityMap()[featureId];
      if (!feature) return;

      patchState(
        store,
        updateEntity({
          id: featureId,
          changes: {
            status: "done",
            completedAt: Date.now(),
          },
        })
      );

      if (feature.tabGroupId) {
        await tabGroupsService.collapseGroup(feature.tabGroupId);
      }

      patchState(store, { activeFeatureId: null });
      this.saveToStorage();
    },

    // Filters
    setFilter(filter: Partial<FeaturesState["filter"]>): void {
      patchState(store, {
        filter: { ...store.filter(), ...filter },
      });
    },

    setSort(sortBy: FeaturesState["sortBy"], sortOrder: FeaturesState["sortOrder"]): void {
      patchState(store, { sortBy, sortOrder });
    },

    // Private helpers
    async openFeatureTabs(feature: Feature): Promise<number[]> {
      const urls: string[] = [];

      if (feature.links.taskManager) urls.push(feature.links.taskManager);
      if (feature.links.docs) urls.push(feature.links.docs);
      if (feature.links.design) urls.push(feature.links.design);
      if (feature.links.githubBranch) {
        // Build GitHub URL from branch name
        // This would need project context
      }
      feature.customTabs.forEach((tab) => urls.push(tab.url));

      const tabIds: number[] = [];
      for (const url of urls) {
        const tab = await tabsService.createTab(url);
        if (tab.id) tabIds.push(tab.id);
      }

      return tabIds;
    },

    async saveToStorage(): Promise<void> {
      await storageService.set("features", store.entities());
      await storageService.set("activeFeatureId", store.activeFeatureId());
    },
  })),

  // Lifecycle hooks
  withHooks({
    async onInit(store) {
      // Load from Chrome Storage
      const storageService = inject(StorageService);
      const features = await storageService.get<Feature[]>("features");
      const activeId = await storageService.get<string>("activeFeatureId");

      if (features) {
        patchState(store, setAllEntities(features));
      }
      if (activeId) {
        patchState(store, { activeFeatureId: activeId });
      }
    },
  })
);
```

### 3.2 Custom Store Feature

```typescript
// src/app/store/custom-features/with-chrome-storage-sync.feature.ts

import { inject } from "@angular/core";
import { signalStoreFeature, withMethods, withHooks, patchState, type } from "@ngrx/signals";
import { setAllEntities, EntityState } from "@ngrx/signals/entities";
import { StorageService } from "@core/services";

export function withChromeStorageSync<Entity extends { id: string }>(storageKey: string) {
  return signalStoreFeature(
    {
      state: type<EntityState<Entity>>(),
    },
    withMethods((store) => {
      const storageService = inject(StorageService);

      return {
        async loadFromStorage(): Promise<void> {
          const data = await storageService.get<Entity[]>(storageKey);
          if (data) {
            patchState(store, setAllEntities(data));
          }
        },

        async saveToStorage(): Promise<void> {
          const entities = store.entities();
          await storageService.set(storageKey, entities);
        },

        async clearStorage(): Promise<void> {
          await storageService.remove(storageKey);
        },
      };
    }),
    withHooks({
      onInit(store) {
        store.loadFromStorage();
      },
    })
  );
}
```

### 3.3 Service Chrome API

```typescript
// src/app/core/services/tab-groups.service.ts

import { Injectable } from "@angular/core";

export type TabGroupColor = chrome.tabGroups.ColorEnum;

@Injectable({ providedIn: "root" })
export class TabGroupsService {
  private readonly COLORS: TabGroupColor[] = ["blue", "red", "yellow", "green", "pink", "purple", "cyan", "orange"];

  async createGroup(title: string, tabIds: number[]): Promise<number> {
    if (tabIds.length === 0) {
      throw new Error("Cannot create group without tabs");
    }

    const groupId = await chrome.tabs.group({ tabIds });
    const color = this.getColorForTitle(title);

    await chrome.tabGroups.update(groupId, {
      title: this.truncateTitle(title),
      color,
      collapsed: false,
    });

    return groupId;
  }

  async updateGroup(
    groupId: number,
    options: {
      title?: string;
      color?: TabGroupColor;
      collapsed?: boolean;
    }
  ): Promise<void> {
    const updateOptions: chrome.tabGroups.UpdateProperties = {};

    if (options.title !== undefined) {
      updateOptions.title = this.truncateTitle(options.title);
    }
    if (options.color !== undefined) {
      updateOptions.color = options.color;
    }
    if (options.collapsed !== undefined) {
      updateOptions.collapsed = options.collapsed;
    }

    await chrome.tabGroups.update(groupId, updateOptions);
  }

  async collapseGroup(groupId: number): Promise<void> {
    try {
      await chrome.tabGroups.update(groupId, { collapsed: true });
    } catch (error) {
      // Group may no longer exist
      console.warn("Failed to collapse group:", error);
    }
  }

  async expandGroup(groupId: number): Promise<void> {
    try {
      await chrome.tabGroups.update(groupId, { collapsed: false });
    } catch (error) {
      console.warn("Failed to expand group:", error);
    }
  }

  async isGroupValid(groupId: number): Promise<boolean> {
    try {
      await chrome.tabGroups.get(groupId);
      return true;
    } catch {
      return false;
    }
  }

  async getGroup(groupId: number): Promise<chrome.tabGroups.TabGroup | null> {
    try {
      return await chrome.tabGroups.get(groupId);
    } catch {
      return null;
    }
  }

  async addTabToGroup(tabId: number, groupId: number): Promise<void> {
    await chrome.tabs.group({ tabIds: tabId, groupId });
  }

  private getColorForTitle(title: string): TabGroupColor {
    const hash = this.hashString(title);
    return this.COLORS[hash % this.COLORS.length];
  }

  private truncateTitle(title: string, maxLength = 40): string {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + "...";
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
```

### 3.4 Dumb Component Example

```typescript
// src/app/features/active-feature/components/timer-display.component.ts

import { Component, input, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DurationPipe } from "@shared/pipes";

@Component({
  selector: "app-timer-display",
  standalone: true,
  imports: [CommonModule, DurationPipe],
  template: `
    <div class="timer-display" [class.paused]="isPaused()">
      <span class="timer-icon"> @if (isPaused()) { ⏸️ } @else { ⏱️ } </span>
      <span class="timer-value">
        {{ currentMinutes() | duration }}
      </span>
      <span class="timer-separator">/</span>
      <span class="timer-estimation"> {{ estimationHours() }}h est. </span>
    </div>

    @if (showProgress()) {
    <div class="progress-container">
      <div class="progress-bar" [style.width.%]="progressPercent()" [class.warning]="isOvertime()" [class.danger]="isOverBudget()"></div>
    </div>
    <span class="progress-text">{{ progressPercent() | number : "1.0-0" }}%</span>
    }
  `,
  styleUrl: "./timer-display.component.scss",
})
export class TimerDisplayComponent {
  // Inputs
  currentMinutes = input.required<number>();
  estimationHours = input.required<number>();
  isPaused = input<boolean>(false);
  showProgress = input<boolean>(true);

  // Computed
  progressPercent = computed(() => {
    const estimation = this.estimationHours() * 60; // Convert to minutes
    if (estimation === 0) return 0;
    return Math.min((this.currentMinutes() / estimation) * 100, 100);
  });

  isOvertime = computed(() => this.progressPercent() >= 80);
  isOverBudget = computed(() => this.progressPercent() >= 100);
}
```

### 3.5 Smart Component Example

```typescript
// src/app/features/active-feature/active-feature.component.ts

import { Component, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeaturesStore } from "@store/features";
import { TimerStore } from "@store/timer";
import { SessionsStore } from "@store/sessions";

import { TimerDisplayComponent } from "./components/timer-display.component";
import { ProgressBarComponent } from "./components/progress-bar.component";
import { TabGroupListComponent } from "./components/tab-group-list.component";
import { FeatureActionsComponent } from "./components/feature-actions.component";
import { EmptyStateComponent } from "./components/empty-state.component";

@Component({
  selector: "app-active-feature",
  standalone: true,
  imports: [CommonModule, TimerDisplayComponent, ProgressBarComponent, TabGroupListComponent, FeatureActionsComponent, EmptyStateComponent],
  templateUrl: "./active-feature.component.html",
  styleUrl: "./active-feature.component.scss",
})
export class ActiveFeatureComponent {
  // Inject stores
  protected readonly featuresStore = inject(FeaturesStore);
  protected readonly timerStore = inject(TimerStore);
  protected readonly sessionsStore = inject(SessionsStore);

  // Derived state
  protected readonly activeFeature = this.featuresStore.activeFeature;
  protected readonly isTimerRunning = this.timerStore.isRunning;
  protected readonly isPaused = this.timerStore.isPaused;

  protected readonly currentSessionDuration = computed(() => {
    const sessionId = this.timerStore.currentSessionId();
    if (!sessionId) return 0;

    const session = this.sessionsStore.entityMap()[sessionId];
    return session?.duration ?? 0;
  });

  protected readonly totalFeatureTime = computed(() => {
    const feature = this.activeFeature();
    return feature?.actualTime ?? 0;
  });

  // Actions
  onPause(): void {
    this.timerStore.pause();
  }

  onResume(): void {
    this.timerStore.resume();
  }

  onComplete(): void {
    const feature = this.activeFeature();
    if (feature) {
      this.featuresStore.completeFeature(feature.id);
    }
  }
}
```

---

## 4. Manifest V3

```json
// public/manifest.json
{
  "manifest_version": 3,
  "name": "featr",
  "version": "1.0.0",
  "description": "Feature context manager for developers - Manage tabs, track time, stay focused",

  "permissions": ["storage", "tabs", "tabGroups", "idle", "notifications", "sidePanel"],

  "host_permissions": ["<all_urls>"],

  "side_panel": {
    "default_path": "index.html"
  },

  "background": {
    "service_worker": "background.js",
    "type": "module"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "css": ["content-script.css"],
      "run_at": "document_start"
    }
  ],

  "action": {
    "default_icon": {
      "16": "assets/icons/icon-16.png",
      "32": "assets/icons/icon-32.png",
      "48": "assets/icons/icon-48.png",
      "128": "assets/icons/icon-128.png"
    },
    "default_title": "Open featr"
  },

  "icons": {
    "16": "assets/icons/icon-16.png",
    "32": "assets/icons/icon-32.png",
    "48": "assets/icons/icon-48.png",
    "128": "assets/icons/icon-128.png"
  },

  "commands": {
    "open-command-palette": {
      "suggested_key": {
        "default": "Ctrl+K",
        "mac": "Command+K"
      },
      "description": "Open command palette"
    },
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+D",
        "mac": "Command+Shift+D"
      },
      "description": "Toggle featr side panel"
    }
  }
}
```

---

## 5. Package.json (dépendances clés)

```json
{
  "name": "featr-extension",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:extension": "ng build --configuration=production && node scripts/build-extension.js",
    "watch": "ng build --watch --configuration=development",
    "test": "ng test",
    "lint": "ng lint",
    "format": "prettier --write \"src/**/*.{ts,html,scss}\""
  },
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "@ngrx/signals": "^18.0.0",
    "primeng": "^17.0.0",
    "primeicons": "^7.0.0",
    "primeflex": "^3.3.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.6.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "^20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "@types/chrome": "^0.0.260",
    "@types/jasmine": "~5.1.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "prettier": "^3.2.0",
    "typescript": "~5.4.0"
  }
}
```

---

## 6. Imports par Barrel (index.ts)

### Pattern utilisé

Chaque dossier exporte ses éléments via un `index.ts` :

```typescript
// src/app/core/index.ts
export * from "./models";
export * from "./services";
export * from "./constants";
export * from "./utils";

// src/app/store/index.ts
export * from "./projects";
export * from "./features";
export * from "./sessions";
export * from "./timer";
export * from "./ui";
export * from "./custom-features";

// src/app/shared/index.ts
export * from "./components";
export * from "./pipes";
export * from "./directives";
```

### Usage dans les composants

```typescript
// Au lieu de :
import { Feature } from "../../../core/models/feature.model";
import { FeaturesStore } from "../../../store/features/features.store";
import { DurationPipe } from "../../../shared/pipes/duration.pipe";

// On utilise (avec paths dans tsconfig) :
import { Feature } from "@core/models";
import { FeaturesStore } from "@store/features";
import { DurationPipe } from "@shared/pipes";
```

### tsconfig.json paths

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@store/*": ["src/app/store/*"],
      "@features/*": ["src/app/features/*"],
      "@shared/*": ["src/app/shared/*"],
      "@layout/*": ["src/app/layout/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
```

---

## 7. Résumé de la structure

| Dossier                 | Responsabilité                | Exemples                      |
| ----------------------- | ----------------------------- | ----------------------------- |
| `core/models`           | Interfaces TypeScript         | Feature, Project, TimeSession |
| `core/services`         | Wrappers Chrome APIs          | TabsService, StorageService   |
| `core/utils`            | Fonctions pures               | trelloParser, timeFormatter   |
| `core/constants`        | Configuration                 | storageKeys, platformUrls     |
| `store/`                | NgRx Signal Stores            | FeaturesStore, ProjectsStore  |
| `store/custom-features` | Features réutilisables        | withChromeStorageSync         |
| `features/`             | Smart components (containers) | ActiveFeatureComponent        |
| `features/*/components` | Dumb components               | TimerDisplayComponent         |
| `shared/components`     | UI components partagés        | ConfirmDialog, Toast          |
| `shared/pipes`          | Pipes Angular                 | DurationPipe, TruncatePipe    |
| `background/`           | Service Worker                | idle-handler, notifications   |
| `content-scripts/`      | Scripts injectés              | Command Palette               |

---

**Document validé** ✅

_Structure prête pour développement MVP_
