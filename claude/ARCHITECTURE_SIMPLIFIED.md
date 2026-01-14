# 🏗️ DevFlow — Architecture Simplifiée

> **Version** : 2.1.0  
> **Date** : Janvier 2025  
> **Changement majeur** : Simplification de l'architecture + NgRx Signal Store

---

## 1. Pourquoi cette simplification ?

### 1.1 Constat initial (V2.0)

L'architecture V2.0 proposait de passer toutes les opérations Chrome (tabs, tabGroups, storage) par le Service Worker. C'était une **sur-complexification inutile**.

### 1.2 Réalité technique

Les APIs Chrome sont **directement accessibles depuis le Side Panel** (qui est une page extension) :

| API Chrome | Accessible depuis Side Panel ? | Nécessite Service Worker ? |
|------------|-------------------------------|---------------------------|
| `chrome.tabs` | ✅ Oui | ❌ Non |
| `chrome.tabGroups` | ✅ Oui | ❌ Non |
| `chrome.storage` | ✅ Oui | ❌ Non |
| `chrome.idle` | ✅ Oui (lecture) | ✅ Oui (events en background) |
| `chrome.notifications` | ✅ Oui | ✅ Recommandé (persistance) |

### 1.3 Nouvelle approche

**Principe : Angular gère tout ce qu'il peut gérer directement.**

Le Service Worker ne conserve que les responsabilités qui **nécessitent** un contexte background :
- Écoute des événements idle (même quand le Side Panel est fermé)
- Notifications système persistantes
- Réponse aux raccourcis clavier globaux

---

## 2. Architecture simplifiée

### 2.1 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTENSION CHROME                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              SIDE PANEL (Angular 20)                        │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │           NgRx Signal Store (Global)                │   │   │
│  │  │                                                     │   │   │
│  │  │  • ProjectsStore     → withEntities<Project>        │   │   │
│  │  │  • FeaturesStore     → withEntities<Feature>        │   │   │
│  │  │  • SessionsStore     → withEntities<TimeSession>    │   │   │
│  │  │  • UIStore           → withState (preferences, UI)  │   │   │
│  │  │                                                     │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                         │                                   │   │
│  │                         ▼                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │              Services (Chrome APIs)                 │   │   │
│  │  │                                                     │   │   │
│  │  │  • TabsService       → chrome.tabs.*                │   │   │
│  │  │  • TabGroupsService  → chrome.tabGroups.*           │   │   │
│  │  │  • StorageService    → chrome.storage.local.*       │   │   │
│  │  │  • ClipboardService  → navigator.clipboard.*        │   │   │
│  │  │  • TrelloParser      → fetch + parsing              │   │   │
│  │  │                                                     │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                         │                                   │   │
│  │                         ▼                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │              UI Components (Standalone)             │   │   │
│  │  │                                                     │   │   │
│  │  │  • HeaderComponent                                  │   │   │
│  │  │  • ProjectSelectorComponent                         │   │   │
│  │  │  • ActiveFeatureComponent                           │   │   │
│  │  │  • FeatureListComponent                             │   │   │
│  │  │  • StatsComponent                                   │   │   │
│  │  │                                                     │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              │ chrome.runtime.sendMessage           │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              SERVICE WORKER (Minimal)                       │   │
│  │                                                             │   │
│  │  Responsabilités UNIQUEMENT :                               │   │
│  │  • chrome.idle.onStateChanged → Pause/Resume timer          │   │
│  │  • chrome.notifications.create → Resume prompt              │   │
│  │  • chrome.commands.onCommand → Raccourcis globaux           │   │
│  │  • Relay messages → Side Panel                              │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              CONTENT SCRIPT (Command Palette)               │   │
│  │                                                             │   │
│  │  • Écoute Cmd+K sur toutes les pages                        │   │
│  │  • Injecte overlay Command Palette                          │   │
│  │  • Communique avec Side Panel via chrome.runtime            │   │   
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Flux de données

```
USER ACTION
    │
    ├─ UI Click/Input
    │   │
    │   ▼
    │   Component → Store Method → patchState → UI Update
    │                    │
    │                    ▼
    │              Chrome API (si besoin)
    │              • tabs.create()
    │              • tabGroups.update()
    │              • storage.local.set()
    │
    ├─ Idle Event (background)
    │   │
    │   ▼
    │   Service Worker → chrome.runtime.sendMessage
    │                         │
    │                         ▼
    │                    Side Panel → Store.pauseTimer()
    │
    └─ Cmd+K (any page)
        │
        ▼
        Content Script → Overlay → chrome.runtime.sendMessage
                                        │
                                        ▼
                                   Side Panel → Execute Action
```

---

## 3. NgRx Signal Store — Justification

### 3.1 Pourquoi NgRx Signal Store ?

| Critère | Plain Signals | NgRx Signal Store |
|---------|---------------|-------------------|
| **Gestion entités** | Manuel (array, map) | `withEntities` built-in |
| **État dérivé** | `computed()` manuel | `withComputed` structuré |
| **Actions** | Méthodes libres | `withMethods` organisé |
| **Lifecycle** | Pas de pattern | `withHooks` (onInit, onDestroy) |
| **Extensibilité** | Limitée | Custom features |
| **DevTools** | Non | Via ngrx-toolkit |
| **Boilerplate** | Minimal | Minimal aussi |
| **Scalabilité** | Moyenne | Excellente |

### 3.2 Cas d'usage DevFlow

DevFlow gère plusieurs **collections d'entités** avec des relations :

```
Projects (collection)
    │
    └── Features (collection, foreign key: projectId)
            │
            └── Sessions (collection, foreign key: featureId)
```

**NgRx Signal Store avec `withEntities`** est **parfait** pour ce pattern :

```typescript
// Exemple simplifié
export const FeaturesStore = signalStore(
  { providedIn: 'root' },
  
  // Entités
  withEntities<Feature>(),
  
  // État additionnel
  withState({
    activeFeatureId: null as string | null,
    isLoading: false,
  }),
  
  // Computed
  withComputed((store) => ({
    activeFeature: computed(() => {
      const id = store.activeFeatureId();
      return id ? store.entityMap()[id] : null;
    }),
    todoFeatures: computed(() => 
      store.entities().filter(f => f.status === 'todo')
    ),
    inProgressFeature: computed(() => 
      store.entities().find(f => f.status === 'in-progress')
    ),
  })),
  
  // Méthodes
  withMethods((store, tabsService = inject(TabsService)) => ({
    
    async activateFeature(featureId: string) {
      const feature = store.entityMap()[featureId];
      if (!feature) return;
      
      // Update state
      patchState(store, { activeFeatureId: featureId });
      patchState(store, updateEntity({ 
        id: featureId, 
        changes: { status: 'in-progress' } 
      }));
      
      // Chrome API call
      await tabsService.openFeatureTabs(feature);
    },
    
  })),
  
  // Lifecycle
  withHooks({
    onInit(store) {
      // Load from Chrome Storage
    },
  }),
);
```

### 3.3 Avantages concrets pour DevFlow

**1. Gestion des entités normalisée**
```typescript
// Accès O(1) à une feature par ID
const feature = store.entityMap()[featureId];

// Liste filtrée automatiquement mise à jour
const todoList = store.todoFeatures(); // Signal computed
```

**2. Updates immutables simplifiés**
```typescript
// Ajouter
patchState(store, addEntity(newFeature));

// Modifier
patchState(store, updateEntity({ id, changes: { status: 'done' } }));

// Supprimer
patchState(store, removeEntity(id));
```

**3. Custom features réutilisables**
```typescript
// Feature custom pour Chrome Storage sync
export function withChromeStorageSync<T>(key: string) {
  return signalStoreFeature(
    withMethods((store) => ({
      async loadFromStorage() {
        const data = await chrome.storage.local.get(key);
        // ...
      },
      async saveToStorage() {
        await chrome.storage.local.set({ [key]: store.entities() });
      },
    })),
    withHooks({
      onInit(store) {
        store.loadFromStorage();
      },
    }),
  );
}

// Usage
export const FeaturesStore = signalStore(
  withEntities<Feature>(),
  withChromeStorageSync('features'), // Réutilisable !
);
```

---

## 4. Services Chrome APIs

### 4.1 TabsService

```typescript
@Injectable({ providedIn: 'root' })
export class TabsService {
  
  async createTab(url: string, groupId?: number): Promise<chrome.tabs.Tab> {
    const tab = await chrome.tabs.create({ url, active: false });
    if (groupId) {
      await chrome.tabs.group({ tabIds: tab.id!, groupId });
    }
    return tab;
  }
  
  async updateTabUrl(tabId: number, url: string): Promise<void> {
    await chrome.tabs.update(tabId, { url });
  }
  
  async closeTab(tabId: number): Promise<void> {
    await chrome.tabs.remove(tabId);
  }
  
  async getTabsByGroupId(groupId: number): Promise<chrome.tabs.Tab[]> {
    return chrome.tabs.query({ groupId });
  }
  
}
```

### 4.2 TabGroupsService

```typescript
@Injectable({ providedIn: 'root' })
export class TabGroupsService {
  
  private readonly colors: chrome.tabGroups.ColorEnum[] = [
    'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'
  ];
  
  async createGroup(title: string, tabIds: number[]): Promise<number> {
    const groupId = await chrome.tabs.group({ tabIds });
    const colorIndex = this.hashString(title) % this.colors.length;
    
    await chrome.tabGroups.update(groupId, {
      title: title.substring(0, 40),
      color: this.colors[colorIndex],
      collapsed: false,
    });
    
    return groupId;
  }
  
  async collapseGroup(groupId: number): Promise<void> {
    await chrome.tabGroups.update(groupId, { collapsed: true });
  }
  
  async expandGroup(groupId: number): Promise<void> {
    await chrome.tabGroups.update(groupId, { collapsed: false });
  }
  
  async isGroupValid(groupId: number): Promise<boolean> {
    try {
      await chrome.tabGroups.get(groupId);
      return true;
    } catch {
      return false;
    }
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  
}
```

### 4.3 StorageService

```typescript
@Injectable({ providedIn: 'root' })
export class StorageService {
  
  async get<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(key);
    return result[key] ?? null;
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }
  
  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }
  
  // Écoute les changements (utile pour sync multi-fenêtres)
  onChanged(callback: (changes: chrome.storage.StorageChange) => void): void {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        callback(changes);
      }
    });
  }
  
}
```

### 4.4 TrelloParserService

```typescript
@Injectable({ providedIn: 'root' })
export class TrelloParserService {
  
  private readonly URL_PATTERNS = {
    notion: /https?:\/\/(www\.)?notion\.so\/[^\s]+/g,
    figma: /https?:\/\/(www\.)?figma\.com\/[^\s]+/g,
    github: /https?:\/\/(www\.)?github\.com\/[^\s]+/g,
  };
  
  private readonly BRANCH_PATTERN = /^(feature|fix|chore|hotfix)\/[\w-]+$/gm;
  private readonly ESTIMATION_PATTERN = /\((\d+)h\)/;
  
  parseCardUrl(url: string): { cardId: string } | null {
    const match = url.match(/trello\.com\/c\/([a-zA-Z0-9]+)/);
    return match ? { cardId: match[1] } : null;
  }
  
  parseTitle(title: string): { name: string; estimation: number | null } {
    const estimationMatch = title.match(this.ESTIMATION_PATTERN);
    const estimation = estimationMatch ? parseInt(estimationMatch[1]) : null;
    const name = title.replace(this.ESTIMATION_PATTERN, '').trim();
    return { name, estimation };
  }
  
  parseDescription(description: string): {
    notionUrl: string | null;
    figmaUrl: string | null;
    githubUrl: string | null;
    branchName: string | null;
  } {
    return {
      notionUrl: this.extractUrl(description, this.URL_PATTERNS.notion),
      figmaUrl: this.extractUrl(description, this.URL_PATTERNS.figma),
      githubUrl: this.extractUrl(description, this.URL_PATTERNS.github),
      branchName: this.extractBranch(description),
    };
  }
  
  private extractUrl(text: string, pattern: RegExp): string | null {
    const match = text.match(pattern);
    return match ? match[0] : null;
  }
  
  private extractBranch(text: string): string | null {
    const match = text.match(this.BRANCH_PATTERN);
    return match ? match[0] : null;
  }
  
}
```

---

## 5. Service Worker (Minimal)

### 5.1 Responsabilités strictes

Le Service Worker ne gère **que** ce qui nécessite un contexte background :

```typescript
// background/service-worker.ts

// 1. Idle Detection
chrome.idle.setDetectionInterval(300); // 5 minutes

chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === 'idle' || newState === 'locked') {
    // Notifier le Side Panel de pauser
    chrome.runtime.sendMessage({ type: 'IDLE_DETECTED', state: newState });
  } else if (newState === 'active') {
    // Proposer de reprendre
    showResumeNotification();
  }
});

// 2. Notifications
async function showResumeNotification() {
  const storage = await chrome.storage.local.get(['activeFeatureId', 'features']);
  const activeFeature = storage.features?.[storage.activeFeatureId];
  
  if (activeFeature) {
    chrome.notifications.create('resume-prompt', {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: 'Resume tracking?',
      message: `Continue working on: ${activeFeature.name}`,
      buttons: [
        { title: 'Resume' },
        { title: 'Stay paused' },
      ],
      requireInteraction: true,
    });
  }
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (notificationId === 'resume-prompt') {
    if (buttonIndex === 0) {
      // Resume
      chrome.runtime.sendMessage({ type: 'RESUME_TIMER' });
    }
    chrome.notifications.clear(notificationId);
  }
});

// 3. Raccourcis clavier globaux
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-command-palette') {
    // Envoyer au content script de l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'OPEN_COMMAND_PALETTE' });
      }
    });
  }
});

// 4. Side Panel toggle
chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
});
```

### 5.2 Communication Side Panel ↔ Service Worker

```typescript
// Dans Angular (Side Panel)
@Injectable({ providedIn: 'root' })
export class BackgroundMessagingService {
  
  private messageSubject = new Subject<BackgroundMessage>();
  messages$ = this.messageSubject.asObservable();
  
  constructor() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.messageSubject.next(message);
      sendResponse({ received: true });
      return true;
    });
  }
  
  async sendToBackground(message: any): Promise<any> {
    return chrome.runtime.sendMessage(message);
  }
  
}
```

---

## 6. Communication entre composants

### 6.1 Pattern recommandé

```
┌──────────────────────────────────────────────────────────┐
│                    STORES (Global)                       │
│                                                          │
│  ProjectsStore ◄──┬──► FeaturesStore ◄──► SessionsStore  │
│                   │                                      │
│                   └──────────► UIStore                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
                            │
                            │ inject()
                            ▼
┌──────────────────────────────────────────────────────────┐
│                    SMART COMPONENTS                      │
│                                                          │
│  • Injectent les stores                                  │
│  • Appellent les méthodes des stores                     │
│  • Passent les signaux aux dumb components               │
│                                                          │
│  Exemple: FeatureListContainerComponent                  │
│           → inject(FeaturesStore)                        │
│           → store.todoFeatures()                         │
│           → <app-feature-card [feature]="...">           │
│                                                          │
└──────────────────────────────────────────────────────────┘
                            │
                            │ @Input()
                            ▼
┌──────────────────────────────────────────────────────────┐
│                    DUMB COMPONENTS                       │
│                                                          │
│  • Reçoivent des données via @Input()                    │
│  • Émettent des events via @Output()                     │
│  • Pas d'injection de stores                             │
│  • Purement présentationnels                             │
│                                                          │
│  Exemple: FeatureCardComponent                           │
│           @Input() feature: Feature                      │
│           @Output() activate = new EventEmitter()        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.2 Exemple concret

```typescript
// Smart Component (Container)
@Component({
  selector: 'app-feature-list-container',
  standalone: true,
  imports: [FeatureCardComponent],
  template: `
    @for (feature of store.todoFeatures(); track feature.id) {
      <app-feature-card 
        [feature]="feature"
        (activate)="onActivate($event)"
        (delete)="onDelete($event)"
      />
    } @empty {
      <p>No features in backlog</p>
    }
  `,
})
export class FeatureListContainerComponent {
  protected readonly store = inject(FeaturesStore);
  
  onActivate(featureId: string) {
    this.store.activateFeature(featureId);
  }
  
  onDelete(featureId: string) {
    this.store.deleteFeature(featureId);
  }
}

// Dumb Component (Presentational)
@Component({
  selector: 'app-feature-card',
  standalone: true,
  template: `
    <div class="card">
      <h3>{{ feature().name }}</h3>
      <span>{{ feature().estimation }}h</span>
      <button (click)="activate.emit(feature().id)">Activate</button>
      <button (click)="delete.emit(feature().id)">Delete</button>
    </div>
  `,
})
export class FeatureCardComponent {
  feature = input.required<Feature>();
  activate = output<string>();
  delete = output<string>();
}
```

---

## 7. Résumé des changements V2.0 → V2.1

| Aspect | V2.0 | V2.1 |
|--------|------|------|
| **Tab Groups** | Via Service Worker | Direct Angular → chrome.tabGroups |
| **Tabs** | Via Service Worker | Direct Angular → chrome.tabs |
| **Storage** | Via Service Worker | Direct Angular → chrome.storage |
| **Parsing Trello** | Non précisé | Direct Angular (fetch + regex) |
| **State Management** | Signals + Services | **NgRx Signal Store** |
| **Idle Detection** | Service Worker | Service Worker (inchangé) |
| **Notifications** | Service Worker | Service Worker (inchangé) |
| **Command Palette** | Content Script | Content Script (inchangé) |

### Bénéfices

1. **Moins de code** : Pas de layer de messages inutile
2. **Plus simple** : Appels directs aux APIs Chrome
3. **Plus performant** : Pas de latence de communication
4. **Mieux structuré** : NgRx Signal Store pour l'état
5. **Plus maintenable** : Separation of concerns claire

---

**Document validé** ✅

*Architecture simplifiée, prête pour implémentation*
