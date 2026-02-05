# 🎯 Featr — Spécifications Fonctionnelles Globales

> **Version** : 1.0.0  
> **Date** : Février 2025  
> **Statut** : Validé ✅

---

## Table des matières

1. [Vision produit](#1-vision-produit)
2. [Architecture globale](#2-architecture-globale)
3. [Composants et responsabilités](#3-composants-et-responsabilités)
4. [Modèles de données](#4-modèles-de-données)
5. [Configuration projet (.featr.json)](#5-configuration-projet-featrjson)
6. [Fonctionnalités par composant](#6-fonctionnalités-par-composant)
7. [Workflows utilisateur](#7-workflows-utilisateur)
8. [Intégrations externes](#8-intégrations-externes)
9. [Règles métier](#9-règles-métier)
10. [Roadmap](#10-roadmap)

---

## 1. Vision produit

### 1.1 Problème

Les développeurs perdent un temps considérable à :
- Jongler entre 30+ tabs désorganisés
- Setup manuellement leur contexte à chaque switch de feature
- Oublier de tracker leur temps de travail
- Exécuter des commandes Git répétitives
- Synchroniser manuellement Trello/GitHub

### 1.2 Solution

**Featr** est un écosystème composé de :
- Une **extension Chrome** pour l'interface et la gestion des tabs
- Un **daemon local** pour les opérations système (Git, filesystem)
- Un **CLI** pour les power users en terminal

### 1.3 Value Proposition

> *"Switch de feature en 3 secondes. Tes tabs, ton code, ton timer — tout suit automatiquement."*

### 1.4 Persona cible

**Hugo, Frontend Developer**
- Travaille sur 2-3 projets simultanément
- Utilise Trello + Notion + Figma + GitHub quotidiennement
- Switch 5-10 fois par jour entre features
- Veut tracker son temps sans y penser
- Préfère le terminal pour certaines opérations

---

## 2. Architecture globale

### 2.1 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              UTILISATEUR                                │
└───────────────┬─────────────────────────────────┬───────────────────────┘
                │                                 │
                ▼                                 ▼
┌───────────────────────────────┐   ┌─────────────────────────────────────┐
│      EXTENSION CHROME         │   │              CLI                    │
│                               │   │                                     │
│  • Side Panel (UI principale) │   │  • Commandes terminal               │
│  • Command Palette (Cmd+K)    │   │  • Prompts interactifs              │
│  • Tab Groups management      │   │  • Status rapide                    │
│  • Time tracking UI           │   │                                     │
└───────────────┬───────────────┘   └──────────────┬──────────────────────┘
                │                                  │
                │   Native Messaging               │   Direct
                │                                  │
                ▼                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DAEMON RUST                                   │
│                                                                         │
│  • Scan filesystem (détection projets)                                  │
│  • Commandes Git (branch, commit, push, pull)                           │
│  • GitHub API (PR, branches)                                            │
│  • Trello API (cards, boards)                                           │
│  • Stockage sécurisé (tokens, données)                                  │
└───────────────┬─────────────────────────────────┬───────────────────────┘
                │                                 │
                ▼                                 ▼
┌───────────────────────────────┐   ┌─────────────────────────────────────┐
│        FILESYSTEM             │   │         SERVICES EXTERNES           │
│                               │   │                                     │
│  • ~/.featr/ (config globale) │   │  • GitHub API                       │
│  • .featr.json (par projet)   │   │  • Trello API                       │
│  • Repos Git                  │   │  • (Future: Jira, Linear, etc.)     │
└───────────────────────────────┘   └─────────────────────────────────────┘
```

### 2.2 Flux de données

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOURCES DE VÉRITÉ                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Extension Chrome Storage     Daemon SQLite                     │
│  ─────────────────────────    ─────────────────────────         │
│  • Features actives           • Projets détectés                │
│  • Sessions de temps          • Configuration                   │
│  • Préférences UI             • Cache APIs externes             │
│  • État Tab Groups            • Tokens (Keyring)                │
│                                                                 │
│                    ▲                    ▲                       │
│                    │      SYNC          │                       │
│                    └────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Composants et responsabilités

### 3.1 Extension Chrome

| Domaine | Responsabilité | Détail |
|---------|----------------|--------|
| **UI/UX** | Interface utilisateur | Side Panel, modals, toasts |
| **Tab Groups** | Gestion onglets Chrome | Création, collapse, switch |
| **Time Tracking** | Suivi du temps | Timer, idle detection, sessions |
| **Command Palette** | Raccourcis rapides | Overlay Cmd+K, fuzzy search |
| **Stockage UI** | Préférences | Thème, langue, layout |

**Ce que l'extension NE fait PAS :**
- ❌ Accès filesystem
- ❌ Commandes Git
- ❌ Stockage tokens sensibles
- ❌ Appels API GitHub/Trello directs

### 3.2 Daemon Rust

| Domaine | Responsabilité | Détail |
|---------|----------------|--------|
| **Filesystem** | Scan projets | Détection .featr.json |
| **Git** | Opérations versioning | Branch, commit, push, pull, stash |
| **GitHub** | Intégration | OAuth, create PR, get PR status |
| **Trello** | Intégration | OAuth, get/move/update cards |
| **Sécurité** | Tokens | Stockage Keyring système |
| **Stockage** | Persistence | SQLite local |

**Ce que le daemon NE fait PAS :**
- ❌ Interface utilisateur
- ❌ Gestion Tab Groups Chrome
- ❌ Time tracking (logique)

### 3.3 CLI

| Domaine | Responsabilité | Détail |
|---------|----------------|--------|
| **Terminal** | Interface texte | Commandes, output formaté |
| **Init** | Setup projet | Création .featr.json interactif |
| **Status** | Vue rapide | État projet, feature active |
| **Raccourcis** | Actions rapides | Branch, switch, PR en une commande |
| **Auth** | Configuration | OAuth flows dans le navigateur |

**Ce que le CLI NE fait PAS :**
- ❌ Remplacer l'extension (complémentaire)
- ❌ Gestion Tab Groups
- ❌ Time tracking UI

### 3.4 Matrice des fonctionnalités

| Fonctionnalité | Extension | Daemon | CLI |
|----------------|:---------:|:------:|:---:|
| Afficher UI Side Panel | ✅ | ❌ | ❌ |
| Command Palette (Cmd+K) | ✅ | ❌ | ❌ |
| Gérer Tab Groups Chrome | ✅ | ❌ | ❌ |
| Timer & idle detection | ✅ | ❌ | ❌ |
| Scanner projets filesystem | ❌ | ✅ | ✅ |
| Exécuter commandes Git | ❌ | ✅ | ✅ |
| Créer PR GitHub | ❌ | ✅ | ✅ |
| Gérer cartes Trello | ❌ | ✅ | ✅ |
| Stocker tokens OAuth | ❌ | ✅ | ✅ |
| Init projet (.featr.json) | ❌ | ❌ | ✅ |
| Status rapide terminal | ❌ | ❌ | ✅ |

---

## 4. Modèles de données

### 4.1 Project

Un projet représente un contexte de travail complet (un produit, une app).

```
Project
├── id: string (UUID)
├── name: string ("Featr Extension")
├── path: string ("/Users/adel/Projects/featr")
├── repos: Repository[]
│   └── Repository
│       ├── name: string ("frontend", "backend")
│       ├── path: string (relatif ou absolu)
│       ├── defaultBranch: string ("main")
│       ├── branchPrefix: string ("feature/")
│       └── remote: string ("origin")
├── tools: Tools
│   ├── taskManager: ToolConfig | null
│   ├── docs: ToolConfig | null
│   └── design: ToolConfig | null
├── localhost: LocalhostConfig | null
├── isValid: boolean
├── lastScannedAt: timestamp
├── createdAt: timestamp
└── updatedAt: timestamp
```

**Règles :**
- Un projet = un fichier `.featr.json` à sa racine
- Un projet peut contenir plusieurs repos (monorepo ou multi-repo)
- Au moins un outil doit être configuré

### 4.2 Feature

Une feature représente une tâche/ticket sur laquelle on travaille.

```
Feature
├── id: string (UUID)
├── projectId: string (FK → Project)
├── name: string ("CARD-023: Create Header Component")
├── description: string | null
├── links: FeatureLinks
│   ├── taskManager: string | null (URL carte Trello/Jira)
│   ├── docs: string | null (URL Notion/Confluence)
│   ├── design: string | null (URL Figma)
│   └── github: string | null (nom branche ou URL)
├── customTabs: CustomTab[]
├── estimation: number (heures)
├── actualTime: number (minutes cumulées)
├── sessions: TimeSession[]
├── status: "todo" | "in-progress" | "done"
├── priority: "P0" | "P1" | "P2" | "P3"
├── tabGroupId: number | null (Chrome Tab Group ID)
├── trelloCardId: string | null
├── githubPrNumber: number | null
├── createdAt: timestamp
├── updatedAt: timestamp
└── completedAt: timestamp | null
```

**Règles :**
- Une seule feature "in-progress" à la fois
- Le timer ne tourne que sur la feature active
- Le tabGroupId est assigné à l'activation

### 4.3 TimeSession

Une session représente une période de travail continue.

```
TimeSession
├── id: string (UUID)
├── featureId: string (FK → Feature)
├── startedAt: timestamp
├── endedAt: timestamp | null (null si en cours)
├── duration: number (minutes)
├── paused: boolean
└── pauseReason: "manual" | "idle" | "lock" | "switch" | null
```

**Règles :**
- Une session sans `endedAt` est "active"
- Les sessions ne se chevauchent jamais
- La durée est calculée au moment du pause/stop

### 4.4 Relations

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Project   │ 1───n │   Feature   │ 1───n │ TimeSession │
└─────────────┘       └─────────────┘       └─────────────┘
       │
       │ contient
       ▼
┌─────────────┐
│ Repository  │
└─────────────┘
```

---

## 5. Configuration projet (.featr.json)

### 5.1 Emplacement

Fichier `.featr.json` à la racine de chaque projet.

**Avantages :**
- Versionnable dans Git → partagé avec l'équipe
- Détecté automatiquement par le daemon
- Un collègue clone le repo → projet déjà configuré

### 5.2 Structure complète

```json
{
  "version": "1",
  "project": {
    "name": "Featr Extension",
    "description": "Chrome extension for feature management"
  },
  "repos": [
    {
      "name": "frontend",
      "path": ".",
      "defaultBranch": "main",
      "branchPrefix": "feature/",
      "remote": "origin"
    },
    {
      "name": "backend",
      "path": "../featr-api",
      "defaultBranch": "main",
      "branchPrefix": "feature/",
      "remote": "origin"
    }
  ],
  "tools": {
    "taskManager": {
      "type": "trello",
      "boardUrl": "https://trello.com/b/abc123/featr",
      "listMapping": {
        "todo": "To Do",
        "in-progress": "In Progress",
        "done": "Done"
      }
    },
    "docs": {
      "type": "notion",
      "workspaceUrl": "https://notion.so/workspace/featr"
    },
    "design": {
      "type": "figma",
      "fileUrl": "https://figma.com/file/xxx/featr-design"
    }
  },
  "localhost": {
    "port": 4200,
    "command": "npm run start"
  },
  "features": {
    "branchPattern": "{type}/{cardId}-{slug}",
    "types": ["feature", "fix", "chore", "refactor"]
  }
}
```

### 5.3 Champs détaillés

| Champ | Obligatoire | Description |
|-------|:-----------:|-------------|
| `version` | ✅ | Version du schéma (toujours "1" pour MVP) |
| `project.name` | ✅ | Nom affiché du projet |
| `project.description` | ❌ | Description libre |
| `repos` | ✅ | Liste des repositories (min 1) |
| `repos[].name` | ✅ | Nom court du repo |
| `repos[].path` | ✅ | Chemin relatif ou absolu |
| `repos[].defaultBranch` | ❌ | Branche par défaut (défaut: "main") |
| `repos[].branchPrefix` | ❌ | Préfixe des branches (défaut: "feature/") |
| `tools.taskManager` | ❌* | Config gestionnaire de tâches |
| `tools.docs` | ❌* | Config documentation |
| `tools.design` | ❌* | Config design |
| `localhost` | ❌ | Config serveur local |
| `features.branchPattern` | ❌ | Pattern nommage branches |

*Au moins un outil doit être configuré.

### 5.4 Types d'outils supportés

**Task Manager :**
- `trello` — Trello boards
- `jira` — Jira (post-MVP)
- `linear` — Linear (post-MVP)
- `github` — GitHub Issues (post-MVP)

**Docs :**
- `notion` — Notion pages
- `confluence` — Confluence (post-MVP)

**Design :**
- `figma` — Figma files/frames

---

## 6. Fonctionnalités par composant

### 6.1 Extension Chrome

#### 6.1.1 Side Panel

**Description :** Interface principale affichée à droite de Chrome.

**Sections :**

| Section | Contenu |
|---------|---------|
| **Header** | Logo, project selector, settings |
| **Active Feature** | Feature en cours, timer, tabs, actions |
| **Backlog** | Liste des features todo/done, filtres |
| **Stats** | Temps today/week, features complétées |

**Actions disponibles :**

| Action | Description |
|--------|-------------|
| Switch project | Changer de projet actif |
| Activate feature | Ouvrir tabs + start timer |
| Pause/Resume | Contrôler le timer |
| Complete | Marquer feature terminée |
| Create feature | Nouvelle feature manuelle |
| Import Trello | Importer depuis carte Trello |
| Edit feature | Modifier une feature |
| Delete feature | Supprimer une feature |

#### 6.1.2 Command Palette

**Description :** Overlay accessible via `Cmd+K` depuis n'importe quelle page.

**Fonctionnement :**
1. User appuie sur `Cmd+K`
2. Overlay apparaît au centre de l'écran
3. User tape sa recherche (fuzzy search)
4. Navigation clavier (↑↓) ou clic
5. Enter pour exécuter

**Commandes disponibles :**

| Commande | Action |
|----------|--------|
| `Switch to [feature]` | Activer une feature |
| `Complete` | Terminer la feature active |
| `Pause` | Pauser le timer |
| `Resume` | Reprendre le timer |
| `New feature` | Créer nouvelle feature |
| `Import Trello` | Import depuis Trello |
| `Create branch` | Créer branche (via daemon) |
| `Create PR` | Créer Pull Request (via daemon) |

#### 6.1.3 Tab Groups Management

**Description :** Gestion automatique des onglets Chrome par feature.

**Comportement à l'activation d'une feature :**

1. Créer/récupérer un Tab Group Chrome
2. Nommer le groupe avec le nom de la feature
3. Assigner une couleur (rotation automatique)
4. Ouvrir les tabs configurés :
   - URL Trello (si configuré)
   - URL Notion (si configuré)
   - URL Figma (si configuré)
   - URL GitHub branch (si configuré)
   - localhost:PORT (si configuré)
   - Custom tabs
5. Expand le groupe
6. Focus sur le premier tab

**Comportement au switch de feature :**

1. Collapse le groupe actuel (ne pas fermer)
2. Mettre à jour les URLs des tabs existants (même domaine → update URL)
3. Créer les nouveaux tabs nécessaires
4. Fermer les tabs en trop
5. Expand le nouveau groupe

**Smart URL Update :**
```
Avant (Feature A):          Après (Feature B):
─────────────────           ─────────────────
trello.com/c/aaa    →→→     trello.com/c/bbb  (URL update)
notion.so/page-a    →→→     notion.so/page-b  (URL update)
figma.com/file-a    →→→     figma.com/file-b  (URL update)
localhost:4200      →→→     localhost:4200    (inchangé)
angular.dev         →→→     (fermé - pas dans Feature B)
                    →→→     reactjs.org       (nouveau tab)
```

#### 6.1.4 Time Tracking

**Description :** Suivi automatique du temps passé sur chaque feature.

**États du timer :**

| État | Description | Icône |
|------|-------------|-------|
| **Inactive** | Pas de feature active | ⏹ |
| **Running** | Timer en cours | ▶️ (pulse) |
| **Paused** | Timer en pause | ⏸ |

**Déclencheurs automatiques :**

| Événement | Action |
|-----------|--------|
| Activation feature | Start timer |
| Switch feature | Pause ancien, start nouveau |
| Complete feature | Stop timer |
| Idle 5min | Pause auto |
| Lock écran | Pause auto |
| Retour d'idle | Notification "Resume?" |

**Idle Detection :**

```
User travaille       Timer tourne
      │
      ▼ (5 min sans activité)
Idle détecté         Timer pause auto
      │
      ▼ (User revient)
Activité détectée    Notification Chrome
      │
      ├─► [Resume] → Timer repart
      └─► [Stay paused] → Timer reste paused
```

**Affichage :**

```
⏱ 2h 34m / 5h est.
████████░░░░░░░░ 51%
```

- Vert : temps < estimation
- Orange : temps proche (90-100%)
- Rouge : temps > estimation

### 6.2 Daemon Rust

#### 6.2.1 Scan des projets

**Description :** Détection automatique des projets Featr sur le filesystem.

**Configuration (dans ~/.featr/config.toml) :**

```toml
[scanner]
paths = [
    "~/Projects",
    "~/dev",
    "~/Code",
    "~/repos"
]
max_depth = 5
ignore = ["node_modules", ".git", "target", "dist"]
```

**Algorithme :**

1. Pour chaque path dans `scanner.paths`
2. Parcourir récursivement (max `max_depth` niveaux)
3. Ignorer les dossiers dans `ignore`
4. Si `.featr.json` trouvé → parser et valider
5. Ajouter au registre des projets

**Résultat :**

```
Scan complete:
  Scanned: 150 directories
  Found: 5 projects
  Valid: 4 projects
  Errors: 1 (invalid config)
```

#### 6.2.2 Opérations Git

**Description :** Exécution de commandes Git sur les repos du projet.

**Opérations supportées :**

| Opération | Description | Multi-repo |
|-----------|-------------|:----------:|
| `status` | État (branch, dirty, ahead/behind) | ✅ |
| `fetch` | Récupérer refs distantes | ✅ |
| `pull` | Pull avec rebase | ✅ |
| `push` | Push vers remote | ✅ |
| `branch.create` | Créer une branche | ✅ |
| `branch.switch` | Changer de branche | ✅ |
| `branch.delete` | Supprimer une branche | ✅ |
| `branch.list` | Lister les branches | ✅ |
| `commit` | Créer un commit | ✅ |
| `stash` | Stash les changements | ✅ |
| `stash.pop` | Restaurer le stash | ✅ |

**Exemple : Créer une branche sur tous les repos**

```
Input:
  project: "Featr Extension"
  branchName: "feature/CARD-023-header"
  repos: ["frontend", "backend"]

Output:
  frontend/ ✅ Created feature/CARD-023-header
  backend/  ✅ Created feature/CARD-023-header
```

**Gestion des conflits :**

- Si working directory dirty → proposer stash auto
- Si conflit merge → reporter l'erreur avec fichiers concernés
- Si branche existe déjà → reporter l'erreur

#### 6.2.3 Intégration GitHub

**Description :** Communication avec l'API GitHub pour les opérations avancées.

**Authentification :**
1. User lance "Auth GitHub" (via CLI ou extension)
2. Daemon ouvre URL OAuth dans le navigateur
3. User autorise l'application
4. Callback vers localhost → daemon récupère le token
5. Token stocké dans Keyring système

**Opérations :**

| Opération | Description |
|-----------|-------------|
| Create PR | Créer une Pull Request |
| Get PR | Récupérer infos d'une PR (status, reviews, checks) |
| List repos | Lister les repos de l'utilisateur |

**Création PR automatique :**

```
Input:
  repo: "adel/featr-extension"
  head: "feature/CARD-023-header"
  base: "main"
  title: "feat(header): add responsive navigation"
  body: "## Description\n\nAdds responsive header...\n\n## Trello\nhttps://trello.com/c/xxx"

Output:
  PR #42 created
  URL: https://github.com/adel/featr-extension/pull/42
```

#### 6.2.4 Intégration Trello

**Description :** Communication avec l'API Trello pour import et sync.

**Authentification :**
- Même flow OAuth que GitHub
- Token stocké dans Keyring

**Opérations :**

| Opération | Description |
|-----------|-------------|
| Get card | Récupérer infos d'une carte |
| Get board | Récupérer structure du board |
| Move card | Déplacer vers une autre liste |
| Update card | Modifier (commentaire, label, etc.) |

**Parsing intelligent des cartes :**

Depuis le titre :
```
"CARD-023 (5h): Create Header Component"
     │      │              │
     │      │              └── titre
     │      └── estimation
     └── numéro carte
```

Depuis la description :
```markdown
## Specs
https://notion.so/xyz123    → lien docs détecté

## Design  
https://figma.com/file/abc  → lien design détecté

## Branch
feature/header-component    → nom branche détecté
```

### 6.3 CLI

#### 6.3.1 Vue d'ensemble

**Description :** Interface terminal pour les power users.

**Modes d'utilisation :**
- Commandes directes (`featr status`)
- Prompts interactifs (`featr init`)
- Output formaté avec couleurs

#### 6.3.2 Commandes disponibles

**`featr` (sans argument)**

Affiche le status du projet courant.

```
$ cd ~/Projects/featr && featr

  📁 Featr Extension

  REPOS
  ─────────────────────────────────────────────────
  frontend/  main → feature/CARD-023-header  ↑2 ✗
  backend/   main                            ✓

  ACTIVE FEATURE
  ─────────────────────────────────────────────────
  ⏱  CARD-023: Header Component
     1h 34m / 5h est.  ████████░░░░ 34%
```

**`featr init`**

Crée un fichier `.featr.json` interactif.

```
$ featr init

  🚀 Initialize Featr project

  ? Project name: Featr Extension
  ? Add repository? (Y/n) Y
  ? Repository name: frontend
  ? Repository path: .
  ? Default branch: main
  ? Add another repository? (Y/n) Y
  ? Repository name: backend
  ? Repository path: ../featr-api
  ? Add another repository? (Y/n) n

  ? Configure Trello? (Y/n) Y
  ? Board URL: https://trello.com/b/abc123/featr

  ? Configure Notion? (Y/n) Y
  ? Workspace URL: https://notion.so/workspace/featr

  ? Configure Figma? (Y/n) n

  ? Localhost port: 4200

  ✅ Created .featr.json

  Next steps:
  1. Commit .featr.json to your repository
  2. Run `featr auth github` to connect GitHub
  3. Run `featr auth trello` to connect Trello
```

**`featr status`**

Alias de `featr` sans argument.

**`featr scan`**

Force un re-scan de tous les projets.

```
$ featr scan

  🔍 Scanning projects...

  ~/Projects/featr          ✅ Featr Extension
  ~/Projects/portfolio      ✅ Portfolio
  ~/Projects/old-project    ❌ Invalid config (missing repos)
  ~/dev/experiment          ⏭  No .featr.json

  Found 2 valid projects
```

**`featr branch <name>`**

Crée une branche sur tous les repos du projet.

```
$ featr branch feature/CARD-024-footer

  Creating branch on all repos...

  frontend/  ✅ Created feature/CARD-024-footer
  backend/   ✅ Created feature/CARD-024-footer

  ✅ Branch created and pushed
```

**`featr switch <branch>`**

Change de branche sur tous les repos.

```
$ featr switch main

  Switching to main...

  frontend/  ✅ Switched to main
  backend/   ⚠️  Stashed 2 changes, switched to main

  ✅ All repos on main
```

**`featr pr`**

Crée une Pull Request (interactif si infos manquantes).

```
$ featr pr

  📝 Create Pull Request

  Branch: feature/CARD-023-header → main

  ? PR title: feat(header): add responsive navigation
  ? PR description: (opens editor)

  Creating PR...

  ✅ PR #42 created
     https://github.com/adel/featr-extension/pull/42
```

**`featr pr --title "..." --body "..."`**

Crée une PR sans prompts.

**`featr commit <message>`**

Commit sur tous les repos (si changements).

```
$ featr commit "feat(header): add mobile menu"

  Committing changes...

  frontend/  ✅ Committed abc123f (3 files)
  backend/   ⏭  No changes

  ✅ Committed and pushed
```

**`featr auth github`**

Lance le flow OAuth GitHub.

```
$ featr auth github

  🔐 GitHub Authentication

  Opening browser for authorization...

  Waiting for callback... ✅

  Authenticated as: adel (Adel)
  Scopes: repo, read:user
```

**`featr auth trello`**

Lance le flow OAuth Trello.

**`featr auth status`**

Affiche l'état des authentifications.

```
$ featr auth status

  AUTHENTICATIONS
  ─────────────────────────────────────────────────
  GitHub   ✅ Connected as adel
  Trello   ✅ Connected as adel_music
```

**`featr auth revoke <service>`**

Révoque un token.

```
$ featr auth revoke github

  ⚠️  Revoke GitHub authentication?

  This will:
  • Remove stored token
  • Require re-authentication for GitHub features

  ? Confirm (y/N) y

  ✅ GitHub authentication revoked
```

#### 6.3.3 Options globales

| Option | Description |
|--------|-------------|
| `--project <path>` | Spécifier le projet (défaut: dossier courant) |
| `--verbose` | Output détaillé |
| `--json` | Output en JSON (pour scripting) |
| `--help` | Aide |
| `--version` | Version |

---

## 7. Workflows utilisateur

### 7.1 Workflow quotidien typique

```
┌─────────────────────────────────────────────────────────────────┐
│ MATIN (9h00)                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. Ouvre Chrome                                                 │
│ 2. Ouvre Trello, prend une carte                               │
│ 3. Cmd+K → "Import Trello" → colle URL                         │
│    → Feature créée avec liens auto-détectés                     │
│ 4. Cmd+K → "Switch to CARD-023"                                │
│    → Tab Group s'ouvre avec tous les contextes                  │
│    → Timer démarre automatiquement                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ TRAVAIL (9h15 - 12h00)                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ • Code pendant 2h45                                             │
│ • Timer affiche progression en temps réel                       │
│ • Pause café à 11h → Idle detection → Timer pause auto          │
│ • Retour → Notification "Resume?" → Click Resume                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ INTERRUPTION (14h00)                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ • Bug urgent à fixer                                            │
│ • Cmd+K → "Switch to bug-login"                                │
│    → Timer CARD-023 pause                                       │
│    → Tab Group CARD-023 collapse                                │
│    → Tab Group bug-login expand                                 │
│    → Timer bug-login démarre                                    │
│ • Fix le bug (30min)                                            │
│ • Cmd+K → "Switch to CARD-023"                                 │
│    → Retour au contexte précédent intact                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FIN DE FEATURE (17h00)                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ • Terminal: featr commit "feat(header): complete component"     │
│ • Terminal: featr pr                                            │
│    → PR créée automatiquement                                   │
│ • Cmd+K → "Complete"                                           │
│    → Timer stop                                                 │
│    → Récap: 4h 30m / 5h estimé ✅                              │
│    → Trello card moved to "Done"                                │
│    → Suggestion prochaine feature                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Workflow: Nouveau projet

```
┌─────────────────────────────────────────────────────────────────┐
│ SETUP INITIAL                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. Terminal: cd ~/Projects/new-project                          │
│ 2. Terminal: featr init                                         │
│    → Prompts interactifs                                        │
│    → .featr.json créé                                           │
│ 3. Terminal: featr auth github (si pas déjà fait)              │
│ 4. Terminal: featr auth trello (si pas déjà fait)              │
│ 5. Terminal: git add .featr.json && git commit                  │
│                                                                 │
│ Le projet est maintenant détecté par l'extension.               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Workflow: Collègue rejoint le projet

```
┌─────────────────────────────────────────────────────────────────┐
│ ONBOARDING                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. git clone https://github.com/team/project.git               │
│ 2. Le .featr.json est déjà présent                             │
│ 3. Installer extension Chrome + daemon                          │
│ 4. Terminal: featr auth github                                  │
│ 5. Terminal: featr auth trello                                  │
│                                                                 │
│ Le projet est automatiquement détecté avec toute sa config.     │
│ Le collègue peut immédiatement importer des cartes Trello.      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Workflow: Créer une branche pour une feature

**Via Extension :**
```
1. Cmd+K → "Create branch"
2. Entrer nom: "feature/CARD-024-footer"
3. → Branche créée sur tous les repos
4. → Switch automatique
```

**Via CLI :**
```bash
$ featr branch feature/CARD-024-footer
```

**Résultat identique** dans les deux cas.

### 7.5 Workflow: Créer une PR

**Via Extension :**
```
1. Cmd+K → "Create PR"
2. Modal avec titre/description pré-remplis
3. Confirmer
4. → PR créée sur GitHub
5. → Lien affiché + notification
```

**Via CLI :**
```bash
$ featr pr --title "feat(footer): add footer component"
```

---

## 8. Intégrations externes

### 8.1 GitHub

**Fonctionnalités :**

| Feature | Description | MVP |
|---------|-------------|:---:|
| OAuth | Authentification sécurisée | ✅ |
| Create branch | Créer branche distante | ✅ |
| Create PR | Créer Pull Request | ✅ |
| Get PR status | Reviews, checks, mergeable | ✅ |
| List repos | Lister repos de l'utilisateur | ✅ |
| Link issues | Lier PR à issue | ❌ |
| Auto-merge | Merge auto si checks OK | ❌ |

**Scopes OAuth requis :**
- `repo` — Accès complet aux repos
- `read:user` — Infos utilisateur

### 8.2 Trello

**Fonctionnalités :**

| Feature | Description | MVP |
|---------|-------------|:---:|
| OAuth | Authentification sécurisée | ✅ |
| Get card | Récupérer infos carte | ✅ |
| Parse card | Extraire estimation, liens | ✅ |
| Move card | Déplacer entre listes | ✅ |
| Add comment | Ajouter commentaire (lien PR) | ✅ |
| Get board | Structure du board | ✅ |
| Create card | Créer nouvelle carte | ❌ |
| Webhooks | Notifications temps réel | ❌ |

**Parsing automatique :**

Le daemon extrait automatiquement depuis une carte Trello :
- Numéro de carte (pattern: `CARD-XXX`)
- Estimation (pattern: `(Xh)`)
- Liens Notion/Figma (URLs dans description)
- Nom de branche (pattern: `feature/...`, `fix/...`)

### 8.3 Figma (lecture seule)

**Fonctionnalités :**

| Feature | Description | MVP |
|---------|-------------|:---:|
| Open URL | Ouvrir frame Figma dans tab | ✅ |
| Deep link | Lien vers frame spécifique | ✅ |
| Get metadata | Nom du fichier/frame | ❌ |

### 8.4 Notion (lecture seule)

**Fonctionnalités :**

| Feature | Description | MVP |
|---------|-------------|:---:|
| Open URL | Ouvrir page Notion dans tab | ✅ |
| Deep link | Lien vers section | ✅ |
| Get metadata | Titre de la page | ❌ |

### 8.5 Intégrations futures (post-MVP)

| Service | Type | Priorité |
|---------|------|:--------:|
| Jira | Task Manager | Haute |
| Linear | Task Manager | Moyenne |
| Confluence | Docs | Moyenne |
| GitLab | Git | Moyenne |
| Bitbucket | Git | Basse |
| Slack | Notifications | Basse |

---

## 9. Règles métier

### 9.1 Contraintes globales

| Règle | Description |
|-------|-------------|
| **1 projet actif** | Un seul projet peut être actif à la fois |
| **1 feature active** | Une seule feature "in-progress" à la fois |
| **1 timer actif** | Un seul timer peut tourner simultanément |
| **1 Tab Group par feature** | Chaque feature a son propre groupe |
| **Sessions séquentielles** | Les sessions ne se chevauchent jamais |

### 9.2 Règles de validation

**Projet (.featr.json) :**
- `project.name` obligatoire
- Au moins 1 repo configuré
- Chaque `repos[].path` doit exister et être un repo Git
- Au moins 1 outil configuré (taskManager, docs, ou design)
- `localhost.port` entre 1000 et 65535

**Feature :**
- `name` obligatoire
- `estimation` > 0
- Au moins 1 lien (taskManager, docs, design, ou github)
- `projectId` doit référencer un projet existant

### 9.3 Règles de transition

**Activation de feature :**
```
Conditions:
  - Feature existe
  - Feature.status = "todo" ou "done"

Effets:
  - Si autre feature active → pause son timer, collapse son Tab Group
  - Feature.status → "in-progress"
  - Créer/expand Tab Group
  - Ouvrir tabs configurés
  - Start timer (nouvelle session)
```

**Complétion de feature :**
```
Conditions:
  - Feature.status = "in-progress"

Effets:
  - Stop timer (fin session)
  - Feature.status → "done"
  - Feature.completedAt → now
  - Collapse Tab Group (ne pas fermer)
  - Si Trello configuré → move card to "Done"
```

**Switch de feature :**
```
Effets:
  - Pause timer feature actuelle
  - Collapse Tab Group actuel
  - Smart update des tabs (même domaine → update URL)
  - Expand nouveau Tab Group
  - Start timer nouvelle feature
```

### 9.4 Règles de calcul

**Temps total feature :**
```
actualTime = sum(sessions.map(s => s.duration))
```

**Progression :**
```
progress = (actualTime / 60) / estimation * 100
```

**Écart estimation :**
```
diff = (actualTime / 60) - estimation
status:
  diff <= 0        → On track ✅
  0 < diff <= 20%  → Close ⚠️
  diff > 20%       → Overrun ❌
```

---

## 10. Roadmap

### 10.1 MVP (v1.0)

**Extension Chrome :**
- [ ] Side Panel UI complète
- [ ] Command Palette (Cmd+K)
- [ ] Tab Groups management
- [ ] Time tracking avec idle detection
- [ ] CRUD features
- [ ] Import Trello

**Daemon Rust :**
- [ ] Native Messaging protocol
- [ ] Scan projets (.featr.json)
- [ ] Commandes Git (branch, commit, push, pull, stash)
- [ ] GitHub OAuth + Create PR
- [ ] Trello OAuth + Get/Move card
- [ ] SQLite storage
- [ ] Keyring tokens
- [ ] macOS + Linux

**CLI :**
- [ ] `featr` (status)
- [ ] `featr init`
- [ ] `featr scan`
- [ ] `featr branch`
- [ ] `featr switch`
- [ ] `featr commit`
- [ ] `featr pr`
- [ ] `featr auth`

### 10.2 v1.1

- [ ] Windows support
- [ ] Jira integration
- [ ] GitHub Issues linking
- [ ] Auto-update daemon
- [ ] `featr pull`
- [ ] `featr stash`

### 10.3 v1.2

- [ ] Linear integration
- [ ] GitLab support
- [ ] Webhooks (Trello → extension notifications)
- [ ] Stats export (CSV, PDF)

### 10.4 v2.0

- [ ] API Cloud sync (multi-device)
- [ ] Team features (partage projets)
- [ ] Collaboration temps réel

---

## 11. Critères de succès

### 11.1 Métriques cibles

| Métrique | Objectif |
|----------|----------|
| Temps switch feature | < 3 secondes |
| Temps scan projets | < 5 secondes |
| Taux adoption time tracking | > 90% |
| Réduction context switching | -5 à -10 min/switch |

### 11.2 Validation MVP

**Extension :**
- [ ] User peut créer/importer features
- [ ] User peut activer feature → tabs s'ouvrent
- [ ] User peut switcher → tabs se mettent à jour
- [ ] Timer démarre/pause automatiquement
- [ ] Cmd+K fonctionne sur toutes les pages
- [ ] Stats affichent temps correct

**Daemon :**
- [ ] Communication Native Messaging OK
- [ ] Scan trouve les projets
- [ ] Git operations fonctionnent multi-repo
- [ ] GitHub/Trello OAuth complets
- [ ] PR création fonctionne

**CLI :**
- [ ] Toutes les commandes MVP fonctionnent
- [ ] Init crée .featr.json valide
- [ ] Auth persiste les tokens

---

**Document validé** ✅

*Spécifications fonctionnelles complètes du projet Featr*
