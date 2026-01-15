# 📋 featr — Spécifications Fonctionnelles MVP

> **Version** : 2.0.0  
> **Date** : Janvier 2025  
> **Statut** : Validé ✅  
> **Type** : Spécifications fonctionnelles pures (sans implémentation technique)

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture fonctionnelle](#2-architecture-fonctionnelle)
3. [Modèles de données](#3-modèles-de-données)
4. [Fonctionnalités détaillées](#4-fonctionnalités-détaillées)
5. [Time Tracking](#5-time-tracking)
6. [Tab Groups Management](#6-tab-groups-management)
7. [Command Palette](#7-command-palette)
8. [Interface utilisateur](#8-interface-utilisateur)
9. [Règles métier](#9-règles-métier)
10. [Stack technique](#10-stack-technique)
11. [Roadmap post-MVP](#11-roadmap-post-mvp)

---

## 1. Vue d'ensemble

### 1.1 Concept

Extension Chrome avec Side Panel permettant de **gérer des features par contexte**, avec tabs organisés en groupes Chrome natifs, time tracking semi-automatique et switch ultra-rapide entre features via Command Palette overlay.

### 1.2 Value Proposition

> _"Arrête de jongler entre 30 tabs. Switch de feature en 3 secondes, track ton temps automatiquement, reste focus."_

### 1.3 Problème résolu

| Avant                                        | Après                                         |
| -------------------------------------------- | --------------------------------------------- |
| 30+ tabs ouverts en bordel                   | Tab Groups par feature, auto-gérés            |
| 2 minutes pour setup le contexte             | Switch en 3 secondes via `Cmd+K`              |
| Time tracking manuel oublié 50% du temps     | Tracking automatique avec idle detection      |
| Perte de focus à chaque switch               | Contexte toujours propre et organisé          |
| Impossible de comparer estimation vs réalité | Stats précises pour améliorer les estimations |

### 1.4 User Persona

**Hugo, Frontend Developer**

- Bosse sur 2-3 projets simultanément
- Utilise Trello + Notion + Figma + GitHub
- Switches 5-10 fois par jour entre features
- Veut tracker son temps sans y penser
- Déteste le chaos de tabs

### 1.5 Workflow cible complet

```
┌─────────────────────────────────────────────────────┐
│ MATIN (9h00)                                        │
├─────────────────────────────────────────────────────┤
│ 1. Ouvre Trello                                     │
│ 2. Prend carte "CARD-023: Header Component"        │
│ 3. Cmd+K → "Import Trello"                         │
│ 4. Colle URL carte                                  │
│    → Extension parse description                    │
│    → Détecte lien Notion (specs)                   │
│    → Détecte lien Figma (design)                   │
│    → Feature créée automatiquement                  │
│ 5. Cmd+K → "Switch to header"                      │
│    → 6 tabs s'ouvrent en Tab Group bleu            │
│      • Trello card                                  │
│      • Notion specs                                 │
│      • Figma frame                                  │
│      • GitHub branch feature/header                 │
│      • Localhost:4200                               │
│      • Angular docs                                 │
│    → Timer démarre automatiquement                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ TRAVAIL (9h15 - 11h00)                              │
├─────────────────────────────────────────────────────┤
│ • Code pendant 1h45                                 │
│ • Timer affiche : 1h 45m / 5h est.                  │
│ • Pause café à 11h                                  │
│   → User s'éloigne de l'ordi                        │
│   → Après 5min idle : Timer pause auto              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ RETOUR (11h15)                                      │
├─────────────────────────────────────────────────────┤
│ • User bouge la souris                              │
│ • Notification Chrome apparaît :                    │
│   "Resume tracking? Continue on CARD-023"           │
│   [Resume] [Stay paused]                            │
│ • Click Resume                                      │
│   → Timer repart                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BUG URGENT (14h00)                                  │
├─────────────────────────────────────────────────────┤
│ • Cmd+K → "Switch to bug-login"                     │
│   → Timer CARD-023 pause automatiquement            │
│   → Tab Group Header collapse                       │
│   → Tab Group Bug Login expand                      │
│   → URLs des tabs se mettent à jour                 │
│   → Timer bug-login démarre                         │
│ • Fix le bug pendant 30min                          │
│ • Cmd+K → "Switch to header"                        │
│   → Retour au contexte précédent                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FIN DE JOURNÉE (17h30)                              │
├─────────────────────────────────────────────────────┤
│ • Cmd+K → "Complete"                                │
│   → Timer stop                                      │
│   → Modal de résumé :                               │
│     ┌─────────────────────────────────┐                 │
│     │ ✅ CARD-023 Complete!       │                 │
│     │                             │                 │
│     │ Estimated: 5h               │                 │
│     │ Actual:    4h 30m           │                 │
│     │ Diff:      -30m ✅          │                 │
│     │                             │                 │
│     │ Sessions: 3                 │                 │
│     │ • 9h15-11h00 (1h45)         │                 │
│     │ • 11h15-14h00 (2h45)        │                 │
│     │ • 15h00-17h30 (30m)         │                 │
│     └─────────────────────────────────┘                 │
│   → Feature marquée "Done"                          │
│   → Suggestion : "Next: CARD-024?"                  │
└─────────────────────────────────────────────────────┘
```

---

## 2. Architecture fonctionnelle

### 2.1 Composants de l'extension

```
┌─────────────────────────────────────────────────────────────┐
│                    EXTENSION CHROME                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐    ┌─────────────────────────────────┐   │
│  │  Service Worker  │    │      Side Panel             │   │
│  │  (background.js) │◄──►│   (Angular 20 App)          │   │
│  │                  │    │                             │   │
│  │  Responsabilités:│    │  Responsabilités:           │   │
│  │  • Tab Groups    │    │  • Project selector         │   │
│  │  • Idle tracking │    │  • Feature CRUD             │   │
│  │  • Messages      │    │  • Time tracking UI         │   │
│  │  • Notifications │    │  • Active feature view      │   │
│  └──────────────────┘    │  • Backlog management       │   │
│           ▲              │  • Stats dashboard          │   │
│           │              └─────────────────────────────────┘   │
│           │                          ▲                     │
│           │                          │                     │
│  ┌────────▼──────────────────────────┼──────────────┐      │
│  │         Command Palette Overlay   │              │      │
│  │      (Content Script injection)   │              │      │
│  │                                   │              │      │
│  │  Responsabilités:                 │              │      │
│  │  • Cmd+K trigger                  │              │      │
│  │  • Fuzzy search features          │              │      │
│  │  • Quick actions                  │              │      │
│  │  • Communication Side Panel       │              │      │
│  └───────────────────────────────────┼──────────────┘      │
│                                      │                     │
│  ┌──────────────────────────────────────▼──────────────────────┐   │
│  │            Chrome Storage API (local)               │   │
│  │                                                     │   │
│  │  • projects: Record<id, Project>                   │   │
│  │  • features: Record<id, Feature>                   │   │
│  │  • activeProjectId: string                         │   │
│  │  • activeFeatureId: string                         │   │
│  │  • preferences: UserPreferences                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Flux de données

```
USER ACTION (UI ou Cmd+K)
    │
    ▼
COMMAND INTERCEPTION
    │
    ├─ Need Tab Groups? → SERVICE WORKER
    ├─ Need Idle API? → SERVICE WORKER
    └─ Pure logic? → SERVICES (Angular)
    │
    ▼
UPDATE CHROME STORAGE
    │
    ▼
REACTIVE UPDATE UI (Signals)
```

---

## 3. Modèles de données

### 3.1 Project

**Description** : Représente un projet de développement avec ses outils configurés.

**Structure** :

```
Project
├─ id: string (UUID)
├─ name: string ("MultiPost Extension")
├─ tools
│  ├─ taskManager`
│  │  ├─ type: "trello" | "jira" | "linear" | "custom"
│  │  ├─ baseUrl: string ("https://trello.com/b/abc123")
│  │  └─ enabled: boolean
│  ├─ docs
│  │  ├─ type: "notion" | "confluence" | "custom"
│  │  ├─ baseUrl: string
│  │  └─ enabled: boolean
│  └─ design
│     ├─ type: "figma" | "sketch" | "custom"
│     ├─ baseUrl: string
│     └─ enabled: boolean
├─ repos: Repository[]
│  └─ Repository
│     ├─ id: string
│     ├─ name: string ("frontend", "backend")
│     ├─ url: string ("https://github.com/user/repo")
│     └─ defaultBranch: string ("main")
├─ localhost
│  ├─ port: number (4200)
│  └─ autoOpen: boolean
├─ isActive: boolean
├─ createdAt: timestamp
└─ updatedAt: timestamp
```

**Règles** :

- **Un seul projet actif à la fois**
- Au moins un outil doit être configuré (taskManager OU docs OU design)
- Les URLs doivent être valides
- Support multi-repos (plusieurs repositories Git par projet)
- Le port localhost doit être entre 1000 et 65535

### 3.2 Feature

**Description** : Représente une feature/tâche avec son contexte complet.

**Structure** :

```
Feature
├─ id: string (UUID)
├─ projectId: string (foreign key)
├─ name: string ("CARD-023: Create Header Component")
├─ description: string (optionnel)
├─ links
│  ├─ taskManager: string (URL carte Trello/Jira)
│  ├─ docs: string (URL page Notion/Confluence)
│  ├─ design: string (URL frame Figma)
│  └─ githubBranch: string (nom ou URL branche)
├─ customTabs: CustomTab[]
│  └─ CustomTab
│     ├─ id: string
│     ├─ title: string
│     ├─ url: string
│     └─ pinned: boolean
├─ estimation: number (heures)
├─ actualTime: number (minutes total)
├─ sessions: TimeSession[]
├─ status: "todo" | "in-progress" | "done"
├─ priority: "P0" | "P1" | "P2" | "P3"
├─ tabGroupId: number (Chrome Tab Group ID)
├─ createdAt: timestamp
├─ updatedAt: timestamp
└─ completedAt: timestamp (si done)
```

**Règles** :

- Le nom est obligatoire
- L'estimation doit être > 0
- Au moins un lien doit être renseigné (taskManager, docs, design, ou githubBranch)
- Les custom tabs peuvent être ajoutés librement
- Une feature ne peut appartenir qu'à un seul projet
- Le statut "in-progress" implique qu'elle est la feature active
- Le tabGroupId est assigné à l'activation

### 3.3 TimeSession

**Description** : Représente une session de travail continue sur une feature.

**Structure** :

```
TimeSession
├─ id: string (UUID)
├─ featureId: string (foreign key)
├─ startedAt: timestamp
├─ endedAt: timestamp (undefined si en cours)
├─ duration: number (minutes)
├─ paused: boolean
├─ pauseReason: "manual" | "idle" | "lock" (optionnel)
└─ resumePrompted: boolean (si popup affichée)
```

**Règles** :

- Une session sans `endedAt` est considérée "active"
- La `duration` est calculée depuis `startedAt` si active
- Une session "paused" a toujours un `endedAt`
- Le `pauseReason` indique pourquoi la pause a eu lieu

### 3.4 UserPreferences

**Description** : Préférences utilisateur globales.

**Structure** :

```
UserPreferences
├─ theme: "dark" | "light"
├─ language: "fr" | "en"
├─ idleThresholdMinutes: number (5 par défaut)
├─ enableIdleDetection: boolean (true)
├─ enableLockDetection: boolean (true)
├─ showResumePrompt: boolean (true)
├─ sidebarWidth: number (pixels)
└─ commandPaletteKey: string ("Cmd+K")
```

**Règles** :

- `idleThresholdMinutes` entre 1 et 60
- `sidebarWidth` entre 300 et 800px
- Les préférences sont sauvegardées à chaque modification

### 3.5 StorageSchema (global)

**Description** : Structure complète du Chrome Storage.

**Structure** :

```
StorageSchema
├─ projects: Record<id, Project>
├─ features: Record<id, Feature>
├─ activeProjectId: string | null
├─ activeFeatureId: string | null
├─ preferences: UserPreferences
└─ version: number (pour migrations)
```

---

## 4. Fonctionnalités détaillées

### 4.1 Project Management

#### 4.1.1 Create Project

**Objectif** : Permettre de configurer un nouveau projet avec ses outils.

**Formulaire requis** :

```
Nouveau projet
──────────────────────────────────────

Nom du projet: [                    ]

┌─ Task Manager ─────────────────┐
│ Type: [Trello ▼]               │
│ Board URL: [                  ]│
│ ☑ Activer                      │
└────────────────────────────────┘

┌─ Documentation ────────────────┐
│ Type: [Notion ▼]               │
│ Workspace URL: [              ]│
│ ☑ Activer                      │
└────────────────────────────────┘

┌─ Design ───────────────────────┐
│ Type: [Figma ▼]                │
│ File URL: [                   ]│
│ ☑ Activer                      │
└────────────────────────────────┘

┌─ Repositories ─────────────────┐
│ [+ Add Repository]             │
│ • Frontend                     │
│   https://github.com/user/fe   │
│   [Remove]                     │
│ • Backend                      │
│   https://github.com/user/be   │
│   [Remove]                     │
└────────────────────────────────┘

┌─ Localhost ────────────────────┐
│ Port: [4200]                   │
│ ☑ Auto-open on activation      │
└────────────────────────────────┘

[Annuler]  [Créer projet]
```

**Validation** :

- Nom non vide
- Au moins un outil activé
- URLs valides (format HTTP/HTTPS)
- Port entre 1000-65535

**Comportement** :

- Après création, le projet devient automatiquement actif
- L'ancien projet actif est désactivé
- Toast notification : "✅ Projet créé et activé"

#### 4.1.2 Switch Project

**Objectif** : Changer de projet actif.

**Méthodes** :

1. Via dropdown dans Side Panel
2. Via Command Palette : `Cmd+K` → "Switch to project [name]"

**Comportement** :

- Si une feature est active, demander confirmation :

  ```
  ⚠️ Feature "CARD-023" en cours

  Timer: 2h 34m
  Sauvegarder et changer de projet ?

  [Annuler] [Sauvegarder & Switch]
  ```

- Pause le timer actuel
- Sauvegarde la session
- Ferme tous les Tab Groups du projet actuel
- Active le nouveau projet
- Reset `activeFeatureId` à null

#### 4.1.3 Edit Project

**Objectif** : Modifier la configuration d'un projet existant.

**Accès** :

- Via Settings → Projects → [Edit]

**Comportement** :

- Formulaire identique à Create
- Pré-rempli avec les valeurs actuelles
- Si projet actif, propose de rafraîchir les tabs ouverts

#### 4.1.4 Delete Project

**Objectif** : Supprimer un projet et toutes ses features.

**Confirmation requise** :

```
⚠️ Supprimer "MultiPost Extension" ?

Ce projet contient 20 features.
Toutes les données seront perdues.

Cette action est irréversible.

[Annuler] [Supprimer définitivement]
```

**Comportement** :

- Supprime le projet
- Supprime toutes les features associées
- Si projet actif, désactive-le et ferme tous les tabs
- Ne peut pas supprimer s'il n'y a qu'un seul projet (bloquer)

---

### 4.2 Feature Management

#### 4.2.1 Create Feature (Manual)

**Objectif** : Créer une feature manuellement via formulaire.

**Formulaire** :

```
Nouvelle feature
──────────────────────────────────

Nom: [CARD-023: Create Header Component]

Estimation: [5] heures

Priority: [○ P0  ○ P1  ● P2  ○ P3]

┌─ Liens externes (optionnel) ──┐
│ Trello:  [URL]  [📋 Coller]   │
│ Notion:  [URL]  [📋 Coller]   │
│ Figma:   [URL]  [📋 Coller]   │
│ GitHub:  [branch-name]         │
└────────────────────────────────┘

┌─ Custom Tabs ──────────────────┐
│ [+ Add Custom Tab]             │
│ • Angular Docs                 │
│   https://angular.dev/...      │
│   [Edit] [Remove]              │
│ • PrimeNG Button               │
│   https://primeng.org/...      │
│   [Edit] [Remove]              │
└────────────────────────────────┘

☑ Ouvrir localhost:4200

[Annuler]  [Créer]  [Créer & Activer]
```

**Validation** :

- Nom obligatoire
- Estimation > 0
- Au moins un lien OU localhost cochée
- URLs valides

**Comportement** :

- "Créer" : Crée la feature et reste dans le backlog
- "Créer & Activer" : Crée et active immédiatement (ouvre tabs + start timer)

#### 4.2.2 Import from Trello

**Objectif** : Créer une feature automatiquement depuis une carte Trello.

**Flow complet** :

**Étape 1 : Trigger**

```
User: Cmd+K
Command Palette: "Import Trello"
→ Affiche modal
```

**Étape 2 : Input URL**

```
┌─────────────────────────────────┐
│ Import depuis Trello            │
├─────────────────────────────────┤
│                                 │
│ URL de la carte Trello:         │
│ [https://trello.com/c/abc123]   │
│                                 │
│ [Annuler]  [Importer]           │
└─────────────────────────────────┘
```

**Étape 3 : Parsing**

L'extension doit extraire :

**Depuis l'URL** :

- Card ID : `abc123`

**Depuis le titre** :

- Nom : "CARD-023 (5h): Create Header Component"
- Estimation : `5` (regex `\((\d+)h\)`)

**Depuis la description** :

```markdown
## Specs

https://notion.so/xyz123

## Design

https://figma.com/file/abc?node-id=456

## Branch

feature/header-component
```

- Chercher patterns d'URLs connues : `notion.so`, `figma.com`
- Chercher nom de branche : ligne commençant par "feature/", "fix/", "chore/"

**Étape 4 : Preview & Confirmation**

```
┌─────────────────────────────────────┐
│ Aperçu de l'import                  │
├─────────────────────────────────────┤
│                                     │
│ Nom: CARD-023: Create Header        │
│ Estimation: 5h                      │
│                                     │
│ Liens détectés:                     │
│ ✓ Trello card                       │
│ ✓ Notion: https://notion.so/xyz123  │
│ ✓ Figma: https://figma.com/...      │
│ ✓ Branch: feature/header-component  │
│                                     │
│ Priority: [○ P0  ● P1  ○ P2  ○ P3]  │
│                                     │
│ [Annuler]  [Modifier]  [Créer]      │
└─────────────────────────────────────┘
```

**Étape 5 : Création**

- Feature créée avec tous les liens
- Toast : "✅ Feature importée depuis Trello"
- Proposition : "Activer maintenant ?" [Oui] [Non]

**Cas d'erreur** :

- URL invalide → "❌ URL Trello invalide"
- Parsing échoué → Feature créée avec juste le nom + Trello URL
- Pas d'estimation dans titre → Demander manuellement

#### 4.2.3 Activate Feature

**Objectif** : Activer une feature = ouvrir ses tabs + start timer.

**Méthodes** :

1. Click sur feature dans backlog
2. `Cmd+K` → "Switch to [feature name]"
3. Bouton [Activer] dans feature card

**Comportement détaillé** :

**Si aucune feature active** :

1. Créer/Récupérer Tab Group Chrome
   - Nom : "CARD-023: Header" (tronqué à 40 chars)
   - Couleur : rotation automatique (bleu, rouge, vert, jaune...)
2. Ouvrir les tabs dans le groupe :
   - Trello card (si URL)
   - Notion page (si URL)
   - Figma frame (si URL)
   - GitHub branch (si URL)
   - Localhost:port (si enabled)
   - Custom tabs
3. Réutilisation intelligente :
   - Si un tab avec même domaine existe déjà → Update URL
   - Sinon → Créer nouveau tab
4. Expand le Tab Group
5. Start timer automatiquement
6. Update status feature → "in-progress"
7. Update UI Side Panel → Afficher "Active Feature"

**Si feature déjà active** :

- Ne rien faire
- Toast : "ℹ️ Cette feature est déjà active"

**Si autre feature active** :

1. Pause timer actuel
2. Sauvegarde session
3. Collapse Tab Group actuel
4. Proceed avec activation (étapes ci-dessus)

**Performance** :

- Transition complète en < 1 seconde
- Smooth, pas de flash de tabs

#### 4.2.4 Edit Feature

**Objectif** : Modifier une feature existante.

**Accès** :

- Bouton [Edit] dans feature card (backlog)
- `Cmd+K` → "Edit [feature name]"

**Formulaire** :

- Identique à Create Feature
- Pré-rempli avec valeurs actuelles

**Comportement** :

- Si feature active → Demander "Rafraîchir les tabs ?" après sauvegarde
- Update storage
- Toast : "✅ Feature mise à jour"

#### 4.2.5 Delete Feature

**Objectif** : Supprimer une feature.

**Confirmation** :

```
⚠️ Supprimer "CARD-023: Header" ?

Sessions: 3 (4h 30m total)
Cette action est irréversible.

[Annuler] [Supprimer]
```

**Comportement** :

- Si feature active → Pause timer, ferme Tab Group, désactive
- Supprime feature
- Supprime toutes ses sessions
- Toast : "✅ Feature supprimée"

#### 4.2.6 Complete Feature

**Objectif** : Marquer une feature comme terminée.

**Méthodes** :

1. Bouton [Complete] dans Active Feature View
2. `Cmd+K` → "Complete"

**Comportement** :

**Étape 1 : Stop timer**

- Pause le timer
- Calcule durée finale

**Étape 2 : Modal résumé**

```
┌─────────────────────────────────┐
│ ✅ CARD-023 Complete!           │
├─────────────────────────────────┤
│                                 │
│ Estimated: 5h                   │
│ Actual:    4h 30m               │
│ Diff:      -30m ✅ (on track)   │
│                                 │
│ Sessions: 3                     │
│ • 9h15-11h00 (1h45)             │
│ • 11h15-14h00 (2h45)            │
│ • 15h00-17h30 (30m)             │
│                                 │
│ [View Details]  [OK]            │
└─────────────────────────────────┘
```

**Étape 3 : Update feature**

- status = "done"
- completedAt = now
- Collapse Tab Group (ne pas fermer)

**Étape 4 : Suggestion next**

```
Prochaine feature ?

CARD-024: Footer Component
2h • P1 • Todo

[Activer]  [Choisir autre]  [Plus tard]
```

**Affichage diff** :

- Diff < 0 (moins de temps) : Vert ✅
- Diff > 0 mais < 20% : Orange ⚠️
- Diff > 20% : Rouge ❌

---

### 4.3 Backlog Management

#### 4.3.1 Affichage liste

**Vue par défaut** :

```
📋 FEATURES BACKLOG (20)

Filters: [All ▼] [P0] [P1] [P2] [P3]
Sort: [Priority ▼]

┌─────────────────────────────────────┐
│ ▸ CARD-024: Footer Component        │
│   2h • P1 • Todo                    │
│   4 tabs ready                      │
│   [Activate] [Edit] [Delete]        │
├─────────────────────────────────────┤
│ ▸ CARD-025: Animations              │
│   2h • P2 • Todo                    │
│   3 tabs ready                      │
│   [Activate] [Edit] [Delete]        │
├─────────────────────────────────────┤
│ ▸ CARD-026: Keyboard Shortcuts      │
│   2h • P3 • Todo                    │
│   5 tabs ready                      │
│   [Activate] [Edit] [Delete]        │
└─────────────────────────────────────┘

[+ New Feature] [Import Trello]
```

**Filtres disponibles** :

- Par priority : P0, P1, P2, P3, All
- Par status : Todo, In Progress, Done, All

**Tri disponible** :

- Priority (P0 > P1 > P2 > P3)
- Estimation (croissant/décroissant)
- Name (alphabétique)
- Created date (récent/ancien)

#### 4.3.2 Actions rapides

**Click sur feature** : Active directement

**Click sur [Activate]** : Active la feature

**Click sur [Edit]** : Ouvre modal d'édition

**Click sur [Delete]** : Demande confirmation et supprime

**Expand feature** (click sur ▸) :

```
▾ CARD-024: Footer Component
  Estimation: 2h
  Created: 13 Jan 2025

  Links:
  • Trello: https://trello.com/c/...
  • Notion: https://notion.so/...
  • Figma: https://figma.com/...

  Custom tabs: 2

  [Activate] [Edit] [Delete]
```

---

## 5. Time Tracking

### 5.1 Logique générale

**Principe** :

- Chaque feature a une **estimation** (heures) et un **temps réel** (minutes)
- Le temps réel est la somme des **sessions**
- Une session = période de travail continue
- Les sessions peuvent être interrompues (pause) et reprises

**États possibles** :

- **Inactive** : Pas de timer actif
- **Active** : Timer tourne
- **Paused** : Timer en pause (idle, lock, ou manuel)

### 5.2 Start (automatique)

**Trigger** : Activation d'une feature

**Comportement** :

1. Créer nouvelle TimeSession
2. startedAt = now
3. duration = 0
4. paused = false
5. Démarrer ticker (toutes les 1 minute)
6. Setup idle detection

**UI** :

- Afficher timer en cours dans Active Feature View
- Format : "2h 34m / 5h est."
- Barre de progression : 51%
- Icône animée (pulse) pour indiquer activité

### 5.3 Pause

**Triggers** :

1. **Manuel** : User click [Pause]
2. **Idle** : Inactivité détectée (5min par défaut)
3. **Lock** : Ordinateur verrouillé
4. **Switch** : Changement de feature

**Comportement** :

1. endedAt = now
2. Calculer duration finale = (endedAt - startedAt) / 60000 minutes
3. paused = true
4. pauseReason = trigger type
5. Sauvegarder session dans feature
6. Stop ticker
7. Update actualTime de la feature (somme sessions)

**UI** :

- Timer affiché en "pause" : "⏸️ 2h 34m"
- Bouton [Resume] visible
- Barre de progression grisée

### 5.4 Resume

**Triggers** :

1. **Manuel** : User click [Resume]
2. **After idle** : User revient, accept notification

**Comportement** :

1. Créer **nouvelle** TimeSession (pas réutiliser l'ancienne)
2. startedAt = now
3. duration = 0
4. paused = false
5. Redémarrer ticker
6. Re-setup idle detection

**UI** :

- Timer repart : "2h 35m / 5h est."
- Icône redevient animée
- Barre de progression colorée

### 5.5 Stop (Complete)

**Trigger** : User complete la feature

**Comportement** :

1. Pause final (si actif)
2. Calculer temps total = somme de toutes les sessions
3. Update feature.actualTime
4. Stop ticker
5. Cleanup idle detection
6. Reset activeFeatureId

**UI** :

- Modal récapitulatif (voir 4.2.6)
- Timer disparaît de l'Active Feature View

### 5.6 Idle Detection

**Configuration** :

- Seuil par défaut : 5 minutes
- Configurable dans Settings (1-60 minutes)
- Peut être désactivé

**Implémentation** :

- Utilise Chrome Idle API
- Détecte 2 états :
  - `idle` : Pas de mouvement souris/clavier
  - `locked` : PC verrouillé

**Comportement idle** :

```
User travaille → Timer tourne
    │
    ▼ (5 minutes sans activité)
Idle détecté → Timer pause auto
    │
    ▼ (User revient)
Active détecté → Notification Resume
```

**Notification Resume** :

```
┌─────────────────────────────┐
│ Resume tracking?            │
├─────────────────────────────┤
│ Continue working on:        │
│ CARD-023: Header Component  │
│                             │
│ Paused since: 11h00         │
│ Duration: 1h 45m            │
│                             │
│ [Resume]  [Stay paused]     │
└─────────────────────────────┘
```

**Cas d'usage** :

- User va au café : Idle pause auto après 5min
- User lock son PC : Lock pause immédiat
- User revient : Notification pour reprendre

### 5.7 Affichage temps

**Format** :

- `< 1h` : "34m"
- `>= 1h` : "2h 34m"
- Toujours afficher estimation : "2h 34m / 5h est."

**Calculs** :

- **Progress** : `(actualTime / 60) / estimation * 100`
- **Diff** : `(actualTime / 60) - estimation`
- **On track** : diff < 20% de l'estimation

**Couleurs** :

- Vert : Diff <= 0 (sous estimation)
- Orange : 0 < diff <= 20%
- Rouge : diff > 20%

---

## 6. Tab Groups Management

### 6.1 Chrome Tab Groups

**Concept natif Chrome** :

- Tabs peuvent être groupés visuellement
- Chaque groupe a : nom, couleur, état (expanded/collapsed)
- Géré via Chrome Tab Groups API

**Utilisation featr** :

- 1 Tab Group = 1 Feature
- Le groupe contient tous les tabs contextuels
- Switch de feature = switch de groupe

### 6.2 Création groupe

**Quand** : À l'activation d'une feature

**Process** :

1. Vérifier si feature.tabGroupId existe
2. Si non → Créer nouveau groupe Chrome
3. Configurer :
   - title : Nom feature (tronqué 40 chars)
   - color : Rotation auto (bleu, rouge, vert, jaune, rose, violet, cyan, orange)
   - collapsed : false (expanded)
4. Sauvegarder groupId dans feature

**Rotation couleurs** :

- Hash du feature.id % 8 couleurs
- Assure distribution visuelle

### 6.3 Population tabs

**Ordre des tabs** (gauche → droite) :

1. Task Manager (Trello/Jira) [si URL]
2. Docs (Notion/Confluence) [si URL]
3. Design (Figma) [si URL]
4. GitHub branch [si URL]
5. Localhost [si enabled]
6. Custom tabs [dans l'ordre de création]

**Smart update** :

- Si tab avec même domaine existe → Update URL
- Sinon → Créer nouveau tab
- Tabs en trop → Fermés
- Premier tab → Actif (focus)

**Exemple** :

```
Before switch:
  Group "CARD-022"
  ├─ trello.com/c/old-card
  ├─ notion.so/old-page
  ├─ figma.com/old-design
  └─ localhost:4200

After switch to CARD-023:
  Group "CARD-023" (même tabs, URLs updatées)
  ├─ trello.com/c/new-card
  ├─ notion.so/new-page
  ├─ figma.com/new-design
  └─ localhost:4200
```

### 6.4 Collapse/Expand

**Collapse** : Masque visuellement les tabs du groupe (restent ouverts)

**Expand** : Affiche les tabs

**Comportement featr** :

- Feature active → Groupe expanded
- Feature pausée/switchée → Groupe collapsed
- Permet de garder plusieurs contextes ouverts sans chaos visuel

**Exemple timeline** :

```
9h00: Activate CARD-023
  → Group CARD-023 expanded (6 tabs visibles)

14h00: Switch to CARD-024
  → Group CARD-023 collapsed (invisible)
  → Group CARD-024 expanded (4 tabs visibles)

15h00: Switch back to CARD-023
  → Group CARD-024 collapsed
  → Group CARD-023 expanded (tabs toujours là)
```

### 6.5 Persistence

**Entre sessions** :

- Chrome Tab Groups persistent naturellement
- featr récupère les groupIds au démarrage
- Si groupe n'existe plus (user l'a fermé) → Re-créer à l'activation

**Scénario** :

```
User ferme Chrome
→ Tous les tabs fermés
→ groupId deviennent invalides

User rouvre Chrome + Extension
→ Storage contient features avec anciens groupIds
→ À l'activation, détection groupe invalide
→ Re-création automatique
```

---

## 7. Command Palette

### 7.1 Concept

**Overlay flottant** type Spotlight/VS Code Command Palette :

- Trigger : `Cmd+K` (ou `Ctrl+K` Windows)
- S'affiche par-dessus la page web actuelle
- Fuzzy search sur les commandes et features
- Navigation clavier

**Design** :

```
┌────────────────────────────────────┐
│ > switch header_                   │ ← Input avec fuzzy search
├────────────────────────────────────┤
│                                    │
│ 🔥 Switch to...                    │
│ ▸ CARD-023: Header Component      │ ← Résultat 1 (highlighted)
│   2h 34m / 5h est. • In Progress   │
│                                    │
│ ▸ CARD-024: Footer Component      │
│   0h / 2h est. • Todo              │
│                                    │
│ ⚡ Quick Actions                   │
│ ▸ Complete current feature         │
│ ▸ Pause tracking                   │
│                                    │
└────────────────────────────────────┘
```

### 7.2 Trigger

**Raccourci** : `Cmd+K` (configurable)

**Où** : Sur n'importe quelle page web (sauf chrome://)

**Implémentation** :

- Content Script injecté globalement
- Écoute le keydown
- Affiche overlay

**Exceptions** :

- Si input/textarea focus → Ne pas trigger
- Si chrome:// page → Fallback Side Panel

### 7.3 Commandes disponibles (MVP)

#### Catégorie : Switch to...

**Format** : "Switch to [feature name]"

**Recherche** :

- Fuzzy match sur `feature.name`
- Affiche : nom, temps actuel, estimation, status
- Triée par : Fréquence d'utilisation + match score

**Action** : Active la feature (voir 4.2.3)

#### Catégorie : Quick Actions

**Commandes** :

- "Complete current feature"
  - Visible si feature active
  - Action : Complete (voir 4.2.6)
- "Pause tracking"
  - Visible si timer actif
  - Action : Pause manuel
- "Resume tracking"
  - Visible si timer paused
  - Action : Resume
- "New feature"
  - Action : Ouvre modal Create Feature
- "Import Trello"
  - Action : Ouvre modal Import Trello
- "Switch project"
  - Action : Ouvre dropdown projets

#### Catégorie : Navigation (Post-MVP)

- "Open GitHub"
- "Open localhost"
- "Search docs..."

### 7.4 Navigation clavier

**Keys** :

- `↑` `↓` : Naviguer dans les résultats
- `Enter` : Exécuter commande sélectionnée
- `Esc` : Fermer palette
- `Cmd+K` à nouveau : Fermer palette

**Shortcuts directs** (optionnel post-MVP) :

- `Cmd+Shift+P` : Pause/Resume
- `Cmd+Shift+C` : Complete
- `Cmd+Shift+N` : New feature

### 7.5 Fuzzy Search

**Algorithme** :

- Match partiel sur nom feature
- Insensible à la casse
- Bonus si match au début du mot
- Affiche 5-10 résultats max

**Exemples** :

```
Query: "head"
  ✅ CARD-023: Header Component
  ✅ CARD-067: Breadcrumb Header
  ❌ CARD-024: Footer Component

Query: "c23"
  ✅ CARD-023: Header Component

Query: "heco"
  ✅ Header Component (H-e-Co)
```

### 7.6 Feedback visuel

**Loading** :

- Si action prend > 100ms : Spinner

**Success** :

- Overlay se ferme
- Toast notification contextuelle

**Error** :

- Message dans palette : "❌ Erreur: ..."
- Reste ouvert pour retry

---

## 8. Interface utilisateur

### 8.1 Layout Side Panel

```
┌──────────────────────────────────────┐
│ 🎯 featr                 [⚙️] [❓] │ ← Header (logo, settings, help)
├──────────────────────────────────────┤
│                                      │
│ PROJECT: [MultiPost Extension ▼]    │ ← Project Selector
│                                      │
├══════════════════════════════════════┤
│                                      │
│ 🔥 ACTIVE FEATURE                    │ ← Active Feature View
│ ┌──────────────────────────────────┐     │
│ │ CARD-023: Header Component   │     │
│ │ ⏱️  2h 34m / 5h est.          │     │
│ │ Progress: ▓▓▓▓▓░░░░░ 51%    │     │
│ │                              │     │
│ │ 📂 Tab Group (6 tabs)        │     │
│ │  🔵 Trello card              │     │
│ │  🔵 Notion spec              │     │
│ │  🟢 Figma frame              │     │
│ │  🔵 GitHub branch            │     │
│ │  🔵 Localhost:4200           │     │
│ │  ⚪ Angular docs             │     │
│ │                              │     │
│ │ [⏸️ Pause] [✅ Complete]     │     │
│ └──────────────────────────────────┘     │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ 📋 BACKLOG (15)                      │ ← Feature List
│                                      │
│ Filters: [All ▼] Sort: [Priority ▼] │
│                                      │
│ ▸ CARD-024: Footer • 2h • P1 • Todo │
│ ▸ CARD-025: Animations • 2h • P2    │
│ ▸ CARD-026: Shortcuts • 2h • P3     │
│ ...                                  │
│                                      │
│ [+ New] [Import Trello]              │
│                                      │
├──────────────────────────────────────┤
│                                      │
│ 📊 STATS                             │ ← Stats Dashboard
│ Today: 4h 30m                        │
│ This week: 18h / 40h est. (45%)      │
│ Features done: 8/20 (40%)            │
│ ⚠️  2 overruns (+3h)                 │
│                                      │
└──────────────────────────────────────┘
```

### 8.2 Composants détaillés

#### 8.2.1 Header

**Contenu** :

- Logo + Nom "featr" (gauche)
- Icône Settings [⚙️] (droite)
- Icône Help [❓] (droite)

**Actions** :

- Click logo → Ne rien faire (ou open github repo post-MVP)
- Click Settings → Ouvre modal Settings
- Click Help → Ouvre documentation/tutorial

#### 8.2.2 Project Selector

**Contenu** :

- Label "PROJECT:"
- Dropdown avec liste projets
- Icône [+] pour créer nouveau projet

**Comportement** :

- Dropdown affiche : `name` de chaque projet
- Projet actif sélectionné par défaut
- Changement → Trigger Switch Project (voir 4.1.2)

#### 8.2.3 Active Feature View

**Visible si** : `activeFeatureId !== null`

**Sinon** : Afficher empty state

```
┌──────────────────────────────────┐
│ 🔭 No active feature         │
│                              │
│ Select a feature from        │
│ backlog to get started       │
│                              │
│ [Start working]              │
└──────────────────────────────────┘
```

**Contenu** :

- **Titre** : `feature.name` (2 lignes max, ellipsis)
- **Timer** :
  - Format : "⏱️ 2h 34m / 5h est."
  - Couleur :
    - Vert si < estimation
    - Orange si proche (90-100%)
    - Rouge si > estimation
  - Icône pulse si actif, statique si paused
- **Progress bar** :
  - % = (actualTime / estimation) \* 100
  - Couleurs identiques au timer
- **Tab Group info** :
  - Titre : "📂 Tab Group (X tabs)"
  - Liste des tabs avec icônes :
    - 🔵 = Bleu (code/docs)
    - 🟢 = Vert (design)
    - 🟡 = Jaune (task manager)
    - ⚪ = Blanc (custom)
- **Actions** :
  - Bouton [⏸️ Pause] (si actif) OU [▶️ Resume] (si paused)
  - Bouton [✅ Complete]

#### 8.2.4 Backlog

**Header** :

- Titre "📋 BACKLOG (X)"
- Filters : Dropdown Priority
- Sort : Dropdown ordre tri

**Liste** :

- Chaque feature card :
  ```
  ▸ CARD-024: Footer Component
    2h • P1 • Todo
    [Activate] [Edit] [Delete]
  ```
- Click sur card → Activate
- Click sur ▸ → Expand details
- Scroll si > 10 items

**Footer** :

- Bouton [+ New Feature]
- Bouton [Import Trello]

#### 8.2.5 Stats Dashboard

**Métriques** :

- **Today** : Temps total travaillé aujourd'hui
  - Format : "4h 30m"
- **This week** : Temps semaine / Estimation semaine
  - Format : "18h / 40h est. (45%)"
  - Progress bar
- **Features done** : Count done / total
  - Format : "8/20 (40%)"
- **Overruns** : Nombre features avec dépassement + total heures
  - Format : "⚠️ 2 overruns (+3h)"
  - Visible uniquement si > 0

### 8.3 Thèmes

#### Mode sombre (défaut)

**Couleurs principales** :

- Background : `#1a1a2e`
- Surface : `#16213e`
- Cards : `#0f3460`
- Text primary : `#e8e8e8`
- Text secondary : `#a0a0a0`
- Accent : `#4f46e5`
- Success : `#10b981`
- Warning : `#f59e0b`
- Danger : `#ef4444`

#### Mode clair

**Couleurs principales** :

- Background : `#f8fafc`
- Surface : `#ffffff`
- Cards : `#f1f5f9`
- Text primary : `#1e293b`
- Text secondary : `#64748b`
- Accent : `#4f46e5`
- Success : `#10b981`
- Warning : `#f59e0b`
- Danger : `#ef4444`

### 8.4 Responsiveness

**Side Panel width** :

- Default : 400px
- Min : 300px
- Max : 800px
- Resizable par drag (barre à gauche)

**Adaptation contenu** :

- < 350px : Stack boutons verticalement
- < 400px : Réduire padding
- > 600px : Plus d'espace, texte moins tronqué

### 8.5 Animations

**Transitions** :

- Switch theme : 200ms fade
- Open/Close modals : 300ms scale + fade
- Collapse/Expand : 250ms height
- Progress bar : 400ms width

**Micro-interactions** :

- Bouton hover : Scale 1.05 + shadow
- Bouton click : Ripple effect
- Timer pulse : 2s infinite (si actif)
- Success action : Confetti burst

**Performance** :

- Hardware accelerated (transform, opacity)
- 60fps target
- Throttle scroll events

---

## 9. Règles métier

### 9.1 Contraintes globales

| Règle                      | Description                                         |
| -------------------------- | --------------------------------------------------- |
| **1 projet actif**         | Un seul projet peut être actif à la fois            |
| **1 feature active**       | Une seule feature peut être "in-progress" à la fois |
| **1 timer actif**          | Un seul timer peut tourner simultanément            |
| **Tab Group unique**       | 1 feature = 1 Tab Group Chrome maximum              |
| **Sessions séquentielles** | Les sessions ne peuvent pas se chevaucher           |

### 9.2 Règles de validation

#### Création Project

- ✅ Nom non vide
- ✅ Au moins 1 outil enabled
- ✅ URLs valides (http/https)
- ✅ Port localhost 1000-65535

#### Création Feature

- ✅ Nom non vide
- ✅ Estimation > 0
- ✅ Au moins 1 lien OU localhost enabled
- ✅ URLs valides
- ✅ ProjectId valide

#### Import Trello

- ✅ URL format `trello.com/c/[cardId]`
- ⚠️ Si parsing échoue → Feature créée avec minimum data

### 9.3 Règles de transition

#### Switch Feature

**Conditions** :

- Feature cible doit être "todo" ou "done" (pas déjà "in-progress")

**Effets** :

- Feature actuelle → paused
- Feature cible → in-progress
- Timer actuel → pause
- Timer cible → start

#### Complete Feature

**Conditions** :

- Feature doit être "in-progress"
- Timer doit être actif ou paused

**Effets** :

- Feature → done
- Timer → stop
- Tab Group → collapsed (pas fermé)
- activeFeatureId → null

#### Delete Feature

**Conditions** :

- Aucune (peut supprimer n'importe quelle feature)

**Effets** :

- Si feature active → Désactiver d'abord
- Feature supprimée
- Sessions supprimées
- Tab Group fermé (si existe)

### 9.4 Règles de calcul

#### Time

**Temps total feature** :

```
actualTime = sum(sessions.map(s => s.duration))
```

**Estimation vs Réel** :

```
diff = (actualTime / 60) - estimation
percent = (diff / estimation) * 100

Status:
  diff <= 0        → On track ✅
  0 < diff <= 20%  → Close ⚠️
  diff > 20%       → Overrun ❌
```

#### Stats

**Today time** :

```
sessions where:
  startedAt >= today 00:00:00
Sum of durations
```

**Week time** :

```
sessions where:
  startedAt >= monday 00:00:00
Sum of durations
```

**Week estimation** :

```
features where:
  status = "in-progress" OR
  (status = "done" AND completedAt this week)
Sum of estimations
```

### 9.5 Règles de synchronisation

#### Chrome Storage

**Sauvegarde** :

- Après chaque mutation de données
- Throttle si < 100ms entre mutations

**Lecture** :

- Au démarrage extension
- Signals reactifs écoutent storage

**Conflits** :

- Last write wins
- Pas de merge (cas rare : multi-devices)

#### Tab Groups

**Récupération** :

- Au démarrage : Vérifier si groupIds existent
- Si invalide : Mark feature.tabGroupId = null
- Re-créer à l'activation

**Fermeture manuelle** :

- User ferme un tab du groupe → OK, re-créé au switch
- User ferme tout le groupe → OK, re-créé à l'activation

---

## 10. Stack technique

### 10.1 Technologies

| Couche         | Technologie        | Version  | Justification                               |
| -------------- | ------------------ | -------- | ------------------------------------------- |
| **Framework**  | Angular            | 20 LTS   | Framework moderne, Signals natifs           |
| **UI Library** | PrimeNG            | Latest   | Composants riches (modals, dropdowns, etc.) |
| **State**      | Signals + Services | Built-in | Suffisant pour complexité MVP               |
| **Styling**    | SCSS + PrimeFlex   | Latest   | Flexibilité + utilities                     |
| **Extension**  | Chrome Manifest    | V3       | Standard actuel                             |
| **Build**      | Angular CLI        | Latest   | Optimisé pour Angular                       |
| **Language**   | TypeScript         | Latest   | Type safety                                 |

### 10.2 Chrome Extension APIs

| API                    | Usage               | Permission required |
| ---------------------- | ------------------- | ------------------- |
| `chrome.storage.local` | Persistence données | `storage`           |
| `chrome.tabs`          | Gestion tabs        | `tabs`              |
| `chrome.tabGroups`     | Gestion groupes     | `tabGroups`         |
| `chrome.idle`          | Détection idle      | `idle`              |
| `chrome.notifications` | Resume prompt       | `notifications`     |
| `chrome.sidePanel`     | UI principale       | `sidePanel`         |
| `chrome.runtime`       | Messages bg ↔ panel | Built-in            |

### 10.3 Structure high-level

```
multipost-extension/
├─ src/
│  ├─ app/ (Angular)
│  │  ├─ core/
│  │  │  ├─ services/ (ProjectService, FeatureService, TimeTracker, etc.)
│  │  │  ├─ models/ (interfaces TypeScript)
│  │  │  └─ constants/ (configs)
│  │  ├─ features/
│  │  │  ├─ header/
│  │  │  ├─ project-selector/
│  │  │  ├─ active-feature/
│  │  │  ├─ feature-list/
│  │  │  └─ stats/
│  │  └─ shared/
│  │     └─ components/
│  ├─ background/
│  │  └─ service-worker.ts
│  ├─ content-scripts/
│  │  └─ command-palette.ts
│  └─ assets/
│     ├─ icons/
│     └─ styles/
├─ public/
│  └─ manifest.json
└─ angular.json
```

### 10.4 Manifest V3

```json
{
  "manifest_version": 3,
  "name": "featr",
  "version": "1.0.0",
  "description": "Feature context manager for developers",

  "permissions": ["storage", "tabs", "tabGroups", "idle", "notifications", "sidePanel"],

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
      "run_at": "document_start"
    }
  ],

  "action": {
    "default_title": "featr"
  },

  "commands": {
    "open-command-palette": {
      "suggested_key": {
        "default": "Ctrl+K",
        "mac": "Command+K"
      },
      "description": "Open command palette"
    }
  }
}
```

---

## 11. Roadmap post-MVP

### 11.1 Phase 2 : Automatisation

| Feature                 | Description                                    | Priorité |
| ----------------------- | ---------------------------------------------- | -------- |
| **Auto-create branch**  | API GitHub : créer branche depuis extension    | Haute    |
| **Auto-create PR**      | API GitHub : créer PR à la completion          | Haute    |
| **Trello sync status**  | Mettre à jour statut carte quand feature done  | Moyenne  |
| **Smart URL detection** | Détecter URLs dans clipboard → Suggérer import | Moyenne  |

### 11.2 Phase 3 : Analytics

| Feature                 | Description                  | Priorité |
| ----------------------- | ---------------------------- | -------- |
| **Velocity tracking**   | Nombre features/semaine      | Moyenne  |
| **Estimation accuracy** | Apprendre des écarts passés  | Haute    |
| **Time heatmap**        | Visualiser heures de travail | Basse    |
| **Burndown chart**      | Suivi sprint                 | Moyenne  |

### 11.3 Phase 4 : Collaboration

| Feature             | Description                 | Priorité |
| ------------------- | --------------------------- | -------- |
| **Cloud sync**      | Sync entre devices          | Haute    |
| **Team features**   | Voir features des collègues | Moyenne  |
| **Shared projects** | Projets d'équipe            | Moyenne  |

### 11.4 Phase 5 : Intégrations

| Feature            | Description                      | Priorité |
| ------------------ | -------------------------------- | -------- |
| **Jira**           | Support Jira (en plus Trello)    | Haute    |
| **Linear**         | Support Linear                   | Moyenne  |
| **Slack**          | Notifications Slack              | Basse    |
| **GitHub Actions** | Trigger actions depuis extension | Basse    |

### 11.5 Nice to have

- Dark/Light theme auto (selon OS)
- Keyboard shortcuts customization
- Export time reports (CSV, PDF)
- Pomodoro integration
- Break reminders
- Focus mode (block distractions)
- AI suggestions (next feature to work on)
- Voice commands (Start/Pause/Complete)

---

## 12. Critères de succès MVP

### 12.1 Fonctionnel

- [ ] User peut créer un projet avec outils configurés
- [ ] User peut créer une feature manuellement
- [ ] User peut importer une feature depuis Trello
- [ ] User peut activer une feature → Tabs s'ouvrent en Tab Group
- [ ] User peut switcher entre features → Tab Groups se mettent à jour
- [ ] Timer démarre automatiquement à l'activation
- [ ] Timer pause après 5min idle
- [ ] Notification Resume apparaît au retour
- [ ] User peut compléter une feature → Récap temps affiché
- [ ] Stats affichent temps today/week
- [ ] Command Palette s'ouvre avec Cmd+K
- [ ] Fuzzy search fonctionne dans Command Palette

### 12.2 Technique

- [ ] Extension se charge sans erreur
- [ ] Side Panel s'affiche correctement
- [ ] Chrome Storage persiste entre sessions
- [ ] Tab Groups persistent entre reloads
- [ ] Idle detection fonctionne (Chrome Idle API)
- [ ] Notifications fonctionnent
- [ ] Command Palette overlay s'affiche sur pages web
- [ ] Performance : Switch feature < 1s
- [ ] Pas de memory leaks
- [ ] Build production < 2MB

### 12.3 UX

- [ ] Thème sombre par défaut appliqué
- [ ] Animations fluides (60fps)
- [ ] Pas de flash lors des transitions
- [ ] Formulaires validés en temps réel
- [ ] Messages d'erreur clairs
- [ ] Feedbacks visuels immédiats (toasts)
- [ ] Navigation clavier complète (Command Palette)

### 12.4 Mesure du succès

**Objectif utilisateur** :

- Gagner 5-10 minutes par switch de feature
- Ne plus oublier de tracker le temps
- Avoir une vision claire du temps passé vs estimé

**Métriques** :

- Temps moyen switch feature < 3s
- Taux d'adoption time tracking > 90%
- Satisfaction user (feedback qualitatif)

---

**Document validé** ✅

_Prêt pour génération du document technique d'implémentation_
