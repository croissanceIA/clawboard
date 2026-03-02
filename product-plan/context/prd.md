# PRD — OpenClaw Task Scheduler (nom de code : ClawBoard)

> **Version** : 0.1
> **Date** : 2026-02-28
> **Stack** : Next.js 15 + SQLite (via Drizzle ORM) + Tailwind CSS
> **Déploiement** : Mac Mini local, à côté du gateway OpenClaw
> **Scope** : 1 agent unique pour le moment, architecture extensible multi-agents

---

## 1. Problème

Aujourd'hui l'utilisation d'OpenClaw oscille entre le cron natif (limité, pas de visibilité) et les messages manuels sur Telegram (bottleneck humain). Il n'y a pas :
- de vue d'ensemble des tâches récurrentes et de leur statut
- de système de modèles réutilisables
- de journaux d'exécution centralisés
- de lien entre les tâches et les skills

Le cron OpenClaw natif (`openclaw cron add`) passe un message en langage naturel à l'agent. Ça fonctionne, mais :
- Pas de tableau de bord pour visualiser ce qui tourne
- Pas de notion de statut (planifié / en cours / terminé / échoué)
- Pas de journaux d'exécution consultables
- Difficile de gérer des cadences variées (3x/jour, 2x/semaine, mensuel)
- Pas de modèles pour les tâches récurrentes

---

## 2. Solution

Une app web locale (ClawBoard) qui sert de **surcouche UI** sur le système de cron natif d'OpenClaw (`cron/jobs.json`) pour :
1. Définir des **modèles de tâches** liés à des skills
2. **Créer et gérer** les crons OpenClaw via une interface visuelle (lecture/écriture de `cron/jobs.json`)
3. **Suivre** le statut et les journaux de chaque exécution
4. **Enrichir** les données avec les coûts réels via l'API OpenRouter
5. **Dispatcher** manuellement des tâches one-shot via la CLI `openclaw agent`

> **Principe architectural** : ClawBoard ne remplace pas le planificateur d'OpenClaw — il le pilote. Un seul moteur de scheduling (OpenClaw), une seule source de vérité (`cron/jobs.json`).

---

## 3. Utilisateurs

- **Toi** (unique utilisateur) : crées les modèles, configures les plannings, consultes le tableau de bord et les journaux
- **L'agent OpenClaw** : reçoit les tâches dispatchées, les exécute, produit des résultats

---

## 4. Architecture technique

### 4.1 Stack

| Composant | Technologie | Raison |
|---|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS | SSR, rapide à construire, UI réactive |
| Base de données | SQLite via Drizzle ORM | Modèles, journaux enrichis, coûts — données que `cron/jobs.json` ne stocke pas |
| Planificateur | **Cron natif OpenClaw** (`cron/jobs.json`) | Déjà en place, fiable, source de vérité unique |
| Gestion des crons | Lecture/écriture de `~/.openclaw/cron/jobs.json` | ClawBoard pilote les crons via le fichier, OpenClaw les exécute |
| Dispatch one-shot | Exec CLI via `child_process` (`openclaw agent`) | Pour le bouton "Lancer maintenant" uniquement |
| Coûts | API OpenRouter (`/api/v1/generation`) | Coûts réels par exécution |

### 4.2 Diagramme de flux

```
[ClawBoard UI]
      |
      | (CRUD modèles + lecture/écriture cron/jobs.json)
      v
[~/.openclaw/cron/jobs.json]  ← source de vérité unique
      |
      | (OpenClaw planificateur natif déclenche les jobs)
      v
[OpenClaw Gateway]
      |
      v
[Agent exécute le skill]
      |
      v
[Résultat dans BRAIN/ + message Discord]

[ClawBoard Polling]
      |
      | (lit cron/jobs.json.state + logs OpenClaw pour màj statuts)
      | (appelle OpenRouter API pour enrichir les coûts)
      v
[SQLite : execution_logs enrichis + coûts]
```

**Flux du bouton "Lancer maintenant" (one-shot) :**
```
[ClawBoard UI] → openclaw agent --message "..." --deliver --channel discord --to channel:ID
      |
      v
[Gateway exécute] → [stdout/stderr capturés] → [SQLite execution_logs]
```

### 4.3 Structure du projet

```
clawboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Tableau de bord principal
│   │   ├── taches/
│   │   │   ├── page.tsx                # Page unique avec onglets (voir 6.2)
│   │   │   └── [id]/page.tsx           # Détail d'une tâche + activité + journaux
│   │   └── api/
│   │       ├── taches/route.ts          # Lecture statuts depuis cron/jobs.json
│   │       ├── modeles/route.ts        # CRUD modèles (SQLite)
│   │       ├── crons/route.ts          # CRUD crons (lecture/écriture cron/jobs.json)
│   │       ├── dispatch/route.ts       # Envoi manuel one-shot
│   │       └── journaux/route.ts       # Consultation journaux enrichis
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts              # Schéma Drizzle (modèles + logs enrichis)
│   │   │   ├── index.ts               # Connexion SQLite
│   │   │   └── migrations/
│   │   ├── cron-manager.ts             # Lecture/écriture de cron/jobs.json
│   │   ├── dispatcher.ts              # Appel CLI openclaw (one-shot uniquement)
│   │   ├── openrouter.ts              # Client API OpenRouter (coûts)
│   │   └── constantes.ts
│   └── components/
│       ├── CarteTache.tsx
│       ├── TableauKanban.tsx
│       ├── FormulaireModele.tsx
│       ├── EditeurPlanning.tsx
│       ├── VisualiseurJournaux.tsx
│       ├── FilActivite.tsx
│       ├── ModaleEditionTache.tsx
│       ├── BarreRecherche.tsx
│       ├── IndicateurCout.tsx
│       └── BadgeStatut.tsx
├── drizzle.config.ts
├── package.json
├── tailwind.config.ts
└── data/
    └── clawboard.db                       # SQLite DB (gitignored)
```

---

## 5. Modèle de données

### 5.1 Tables

```sql
-- Modèles : modèles de tâches réutilisables (enrichissement ClawBoard)
CREATE TABLE templates (
  id TEXT PRIMARY KEY,               -- uuid
  name TEXT NOT NULL,                 -- ex: "Synthèse quotidienne"
  skill_name TEXT,                    -- ex: "daily-synthesis" (optionnel)
  instructions TEXT NOT NULL,         -- instructions envoyées à l'agent
  pre_instructions TEXT,              -- texte ajouté avant (ex: notif Discord)
  agent_id TEXT DEFAULT 'main',       -- agent cible
  delivery_channel TEXT DEFAULT 'discord',  -- canal de livraison (discord, telegram, etc.)
  delivery_recipient TEXT,            -- ID du channel/destinataire (ex: ID channel Discord)
  model TEXT,                         -- modèle IA utilisé (ex: openrouter/moonshotai/kimi-k2.5)
  cron_job_id TEXT,                   -- lien vers l'ID du job dans cron/jobs.json (null si one-shot)
  created_at DATETIME DEFAULT NOW,
  updated_at DATETIME DEFAULT NOW
);

-- Journaux d'exécution : traces enrichies de chaque exécution
-- (les statuts et schedules vivent dans cron/jobs.json, pas ici)
CREATE TABLE execution_logs (
  id TEXT PRIMARY KEY,
  cron_job_id TEXT,                  -- ID du job dans cron/jobs.json
  template_id TEXT REFERENCES templates(id),
  stdout TEXT,
  stderr TEXT,
  exit_code INTEGER,
  duration_ms INTEGER,
  status TEXT DEFAULT 'ok',          -- ok | failed
  model TEXT,                        -- modèle utilisé (ex: openrouter/moonshotai/kimi-k2.5)
  prompt_tokens INTEGER,             -- tokens d'entrée (via OpenRouter API)
  completion_tokens INTEGER,         -- tokens de sortie (via OpenRouter API)
  cost_usd REAL,                     -- coût réel en USD (via OpenRouter API)
  generation_id TEXT,                -- ID de génération OpenRouter pour audit
  executed_at DATETIME DEFAULT NOW
);
```

> **Ce qui vit dans `cron/jobs.json` (source de vérité OpenClaw) :**
> - Schedules (expression cron, timezone, enabled/disabled)
> - État d'exécution (lastRunAtMs, lastStatus, nextRunAtMs, consecutiveErrors)
> - Payload (message, model, delivery)
>
> **Ce qui vit dans SQLite (enrichissement ClawBoard) :**
> - Modèles de tâches (templates avec instructions, skills, pré-instructions)
> - Journaux d'exécution enrichis (stdout/stderr, coûts OpenRouter)
> - Historique consultable et archivable

### 5.2 Statuts des crons

Les statuts sont lus directement depuis `cron/jobs.json` (champ `state`) :

| Champ `cron/jobs.json` | Affichage ClawBoard | Signification |
|---|---|---|
| `enabled: true` + pas encore l'heure | Planifié | Prochaine exécution en attente |
| `enabled: true` + en cours | En cours | L'agent exécute la tâche |
| `lastStatus: "ok"` | Terminé | Dernière exécution réussie |
| `lastStatus: "error"` | Échoué | Dernière exécution en erreur |
| `enabled: false` | Désactivé | Cron en pause |

> ClawBoard ne duplique pas ces statuts en DB — il les lit en temps réel depuis `cron/jobs.json`.

---

## 6. Fonctionnalités détaillées

### 6.1 Tableau de bord (page d'accueil)

- **Indicateur de coût** en haut à droite : coût du jour + coût du mois en cours, récupéré via l'API OpenRouter (`GET /api/v1/generation?id=$GENERATION_ID` pour chaque exécution). Les coûts réels (prompt_tokens, completion_tokens, cost) sont stockés dans `execution_logs` pour historique
- **Barre de recherche globale** : rechercher dans les tâches, modèles, plannings
- Compteurs : tâches du jour (terminées/total), tâches échouées, prochaine tâche planifiée
- Historique des 10 dernières exécutions avec statut
- Alertes si une tâche a échoué

### 6.2 Page Tâches — navigation par onglets

Toute la gestion des tâches vit sous une **page unique avec 5 onglets** (pas des pages séparées) :

| Onglet | Contenu |
|---|---|
| **Tâches** (N) | Kanban par statut : Planifié → En attente → En cours → Terminé / Échoué |
| **Modèles** (N) | Grille de cartes des modèles de tâches |
| **Récurrences** (N) | Liste des plannings avec fréquence et prochaine exécution |
| **Pré-instructions** | Éditeur texte des instructions ajoutées à toutes les tâches |
| **Archivées** | Tâches terminées/échouées archivées, consultables et recherchables |

Le compteur entre parenthèses indique le nombre d'éléments actifs dans chaque onglet.

### 6.3 Onglet Tâches (vue crons)

Vue de tous les crons depuis `cron/jobs.json` avec leur statut en temps réel, dernière exécution, prochaine exécution, et lien vers le modèle ClawBoard associé.

Filtres :
- Par statut (actif, désactivé, en erreur)
- Par modèle associé
- Par fréquence

### 6.4 Onglet Modèles de tâches

- Affichage en **grille de cartes** : nom du modèle, extrait des instructions, agent assigné, **compteur de tâches** générées par ce modèle
- CRUD complet
- Champ `skill_name` optionnel : si renseigné, les instructions disent automatiquement _"Utilise le skill [skill_name], lis attentivement ses instructions et exécute-les."_
- Champ `pre_instructions` : texte ajouté avant les instructions (notifications Telegram, références BRAIN, etc.)
- Aperçu des instructions complètes assemblées

### 6.5 Onglet Récurrences

- Crée/modifie les jobs directement dans `cron/jobs.json` via `cron-manager.ts`
- Associer un modèle ClawBoard à un job cron (le modèle fournit les instructions, le job cron le schedule)
- **Fréquence affichée en langage naturel** : "Tous les jours à 9h", "Tous les lundis et jeudis à 8h", "Le 1er du mois à 10h", "Toutes les 8h"
- Préréglages rapides lors de la création
- **Prochaine exécution** lue depuis `state.nextRunAtMs` de `cron/jobs.json`
- Bouton activer/désactiver (toggle `enabled` dans `cron/jobs.json`)

### 6.6 Onglet Pré-instructions

- Éditeur de texte markdown
- Bouton "Enregistrer"
- Note explicative : _"Ces instructions sont ajoutées avant chaque tâche envoyée à l'agent. Supporte les sauts de ligne et le Markdown."_

### 6.7 Onglet Archivées

- Liste des tâches archivées avec date, modèle source, statut final (terminé/échoué)
- Recherche et filtres par date/modèle
- Accès au détail et aux journaux des tâches archivées

### 6.8 Envoi one-shot ("Lancer maintenant")

Le dispatcher est utilisé uniquement pour les lancements manuels (bouton "Lancer maintenant"). Les exécutions récurrentes passent par le cron natif OpenClaw.

```typescript
// lib/dispatcher.ts
import { execFile } from 'child_process';

const OPENCLAW_CLI = process.env.OPENCLAW_CLI || 'openclaw';
const TIMEOUT_MS = 600_000; // 10 minutes

interface ResultatDispatch {
  succes: boolean;
  stdout: string;
  stderr: string;
  codeSortie: number | null;
  dureeMs: number;
}

export async function envoyerTache(
  agentId: string,
  message: string,
  channel: string = 'discord',
  recipient?: string
): Promise<ResultatDispatch> {
  const debut = Date.now();
  const args = ['agent', '--message', message, '--deliver', '--channel', channel];
  if (recipient) {
    args.push('--to', `channel:${recipient}`);
  }

  return new Promise((resolve) => {
    const proc = execFile(
      OPENCLAW_CLI,
      args,
      { timeout: TIMEOUT_MS },
      (error, stdout, stderr) => {
        resolve({
          succes: !error,
          stdout: stdout || '',
          stderr: stderr || '',
          codeSortie: error ? (error as any).code ?? 1 : 0,
          dureeMs: Date.now() - debut,
        });
      }
    );
  });
}
```

### 6.9 Page détail d'une tâche

Accessible en cliquant sur une tâche depuis le kanban ou les archives.

**Panneau gauche :**
- Avatar et nom de l'agent assigné
- Statut actuel (dropdown modifiable)
- Agent assigné (dropdown)
- Date planifiée
- Date de création
- Date de complétion
- Liens : "Archiver la tâche" / "Supprimer la tâche"

**Panneau droit :**
- **Instructions** de la tâche (encadré)
- **Fil d'activité** : journal chronologique des événements de la tâche
  - "Tâche créée — Créée depuis le modèle 'Synthèse quotidienne' (récurrence)"
  - "Statut changé — Planifié → En attente"
  - "Statut changé — Dispatchée à l'agent"
  - "Statut changé — Terminée"
- **Journaux d'exécution** (dépliable) : sortie standard, erreurs, code de sortie, durée
  - Bouton "Copier" pour copier les journaux
- Bouton "Relancer" pour relancer une tâche échouée

**Édition rapide via modale :**
Un clic sur "Modifier" ouvre une modale avec : titre, description/instructions, statut (dropdown), agent assigné, date planifiée. Si la tâche fait partie d'une récurrence, un message info s'affiche : _"Cette tâche fait partie d'une récurrence. Gérez les plannings depuis l'onglet Récurrences."_

### 6.10 Pré-instructions par défaut

Contenu par défaut (modifiable via l'onglet Pré-instructions) :

```markdown
## Notification
Avant de commencer, envoie un message court pour dire que tu démarres la tâche [TASK_NAME].
Quand tu as fini, envoie un message avec un résumé de ce que tu as fait.

## BRAIN
Tes résultats doivent être écrits dans ~/openclaw/BRAIN/.
Ne crée pas de nouveau dossier BRAIN, utilise celui qui existe.

## En cas d'erreur
Si tu rencontres un blocage ou une erreur, signale-le immédiatement.
```

---

## 7. Configuration

### 7.1 Variables d'environnement

```env
# .env.local
OPENCLAW_CLI=openclaw            # chemin vers la CLI openclaw
OPENCLAW_AGENT=main              # agent par défaut
OPENCLAW_TIMEOUT=600000          # timeout en ms (10 min)
SKILLS_PATH=~/.openclaw/workspace/skills  # répertoire des skills
BRAIN_PATH=~/openclaw/BRAIN      # répertoire BRAIN
PORT=3333                        # port de l'app (évite conflit avec openclaw 18789)
OPENROUTER_API_KEY=sk-or-v1-...  # clé OpenRouter pour récupérer les coûts réels
```

### 7.2 Accès

- L'app tourne sur `http://127.0.0.1:3333`
- Accessible via Tailscale si besoin (même configuration que le tableau de bord OpenClaw)
- Pas d'authentification pour v1 (local uniquement, même machine)

---

### 7.3 Intégration avec les crons existants

ClawBoard utilise `cron/jobs.json` comme source de vérité — pas de migration nécessaire. Les crons existants apparaissent automatiquement dans l'interface.

Au premier lancement, ClawBoard :
1. **Lit `cron/jobs.json`** et affiche tous les jobs existants
2. **Propose d'associer** chaque job à un modèle ClawBoard (pour enrichir avec des instructions structurées, skills, pré-instructions)
3. **Les jobs non associés** restent visibles et fonctionnels, juste sans enrichissement

Crons existants qui apparaîtront automatiquement :

| Job `cron/jobs.json` | Schedule | Delivery |
|---|---|---|
| `twitter-trends-daily` | `0 7 * * *` | Discord `#daily` |
| `backup-openclaw-drive` | `0 3 * * *` | Discord logs |
| `memory-daily` | `45 2 * * *` | Discord logs |
| `Analyse Accélérateur IA` (disabled) | `0 10 1,15 * *` | Telegram |

> ⚠️ Le crontab système de mise à jour (3h15) est hors périmètre — il est géré par `crontab` macOS, pas par OpenClaw.

### 7.4 Suivi des coûts via OpenRouter API

ClawBoard récupère les coûts réels de chaque exécution via l'API OpenRouter :

```
GET https://openrouter.ai/api/v1/generation?id=$GENERATION_ID
Authorization: Bearer $OPENROUTER_API_KEY
```

Réponse :
```json
{
  "usage": {
    "prompt_tokens": 1200,
    "completion_tokens": 450,
    "total_tokens": 1650,
    "cost": 0.0042
  }
}
```

Le `generation_id` est extrait du stdout de la CLI après chaque dispatch. Les données sont stockées dans `execution_logs` (champs `prompt_tokens`, `completion_tokens`, `cost_usd`, `generation_id`).

L'indicateur de coût du dashboard agrège ces données pour afficher le coût du jour et du mois.

---

## 8. Contraintes et décisions

| Décision | Choix | Justification |
|---|---|---|
| Pas de planificateur propre | Cron natif OpenClaw (`cron/jobs.json`) | Un seul moteur de scheduling, pas de risque de double exécution |
| SQLite pour les données enrichies | Modèles + logs + coûts | `cron/jobs.json` ne stocke pas les journaux détaillés ni les coûts |
| Dispatch one-shot via CLI | `execFile('openclaw agent', ...)` | Uniquement pour "Lancer maintenant", les récurrences passent par le cron natif |
| Lecture/écriture directe de `cron/jobs.json` | Pas d'API OpenClaw pour les crons | Plus fiable que de parser la sortie CLI, format JSON stable |
| Pas d'auth sur l'app | Port local + Tailscale | Même sécurité que le tableau de bord OpenClaw |
| 1 agent pour l'instant | `agent_id` en DB pour le futur | Le schéma supporte déjà le multi-agents |

---

## 9. MVP — Périmètre v0.1

### Inclus

- [ ] Tableau de bord avec compteurs du jour + indicateur de coût via OpenRouter API (jour/mois)
- [ ] Barre de recherche globale
- [ ] Page Tâches avec 5 onglets (Tâches, Modèles, Récurrences, Pré-instructions, Archivées)
- [ ] Onglet Tâches : vue des crons depuis `cron/jobs.json` avec statuts temps réel
- [ ] Onglet Modèles : grille de cartes avec compteur de tâches par modèle
- [ ] Onglet Récurrences : lecture/écriture `cron/jobs.json` avec fréquence en langage naturel + toggle
- [ ] Onglet Pré-instructions : éditeur markdown avec bouton "Enregistrer"
- [ ] Onglet Archivées : journaux d'exécution passés consultables (SQLite)
- [ ] `cron-manager.ts` : lecture/écriture de `~/.openclaw/cron/jobs.json`
- [ ] `openrouter.ts` : client API OpenRouter pour récupérer les coûts par exécution
- [ ] Dispatcher CLI one-shot (bouton "Lancer maintenant")
- [ ] Association modèles ↔ jobs cron existants

### Exclus (v0.2+)

- Multi-agents (plusieurs agents avec rôles)
- Visualiseur/éditeur de skills intégré
- Visualiseur BRAIN intégré
- Notifications push en cas d'échec
- Métriques (temps moyen, taux de réussite)
- Chaînes de tâches (tâche B démarre quand tâche A est terminée)

---

## 10. Plan d'implémentation

### Phase 1 — Fondations (jour 1-2)

1. Init projet Next.js 15 + Tailwind + Drizzle + SQLite
2. Schéma DB + migrations (templates, execution_logs)
3. `cron-manager.ts` : lecture/écriture de `cron/jobs.json` (parser, créer, modifier, toggle)
4. `openrouter.ts` : client API OpenRouter (récupération coûts par generation_id)
5. `dispatcher.ts` : appel CLI `openclaw agent` pour one-shot

### Phase 2 — Interface (jour 3-4)

6. Layout global : barre latérale, barre de recherche, indicateur de coût
7. Page tableau de bord (compteurs depuis `cron/jobs.json`, coûts depuis SQLite, alertes)
8. Page Tâches avec système d'onglets
9. Routes API : `/api/crons` (proxy `cron/jobs.json`), `/api/modeles` (CRUD SQLite), `/api/journaux`, `/api/dispatch`

### Phase 3 — Onglets + Détail (jour 5-6)

10. Onglet Tâches : vue crons temps réel depuis `cron/jobs.json`
11. Onglet Modèles : grille de cartes avec compteur + association aux jobs cron
12. Onglet Récurrences : création/édition de jobs dans `cron/jobs.json` + toggle + fréquence en langage naturel
13. Onglet Pré-instructions : éditeur markdown
14. Onglet Archivées : journaux d'exécution passés (SQLite)
15. Bouton "Lancer maintenant" (dispatcher one-shot)

### Phase 4 — Finitions + mise en service (jour 7)

16. LaunchAgent ou pm2 pour que ClawBoard démarre au boot du Mac Mini
17. Test de bout en bout : créer un modèle → associer à un cron → OpenClaw exécute → journaux enrichis + coûts affichés
18. Associer les 4 crons existants à des modèles ClawBoard

---

## 11. Risques

| Risque | Impact | Mitigation |
|---|---|---|
| Format de `cron/jobs.json` change avec une mise à jour OpenClaw | ClawBoard ne peut plus lire/écrire les crons | Centraliser le parsing dans `cron-manager.ts`, valider le format au démarrage |
| ClawBoard et OpenClaw écrivent dans `cron/jobs.json` en même temps | Conflit d'écriture, données perdues | ClawBoard utilise un lock file avant écriture, OpenClaw a la priorité |
| La CLI `openclaw agent` change de syntaxe | Dispatch one-shot cassé | Centraliser l'appel dans `dispatcher.ts`, ne touche pas les crons récurrents |
| SQLite verrouillé si trop d'écritures concurrentes | Corruption DB | Mode WAL activé, 1 seul agent = faible concurrence |
| ClawBoard tombe | Pas d'impact sur les crons (OpenClaw continue) | pm2 ou LaunchAgent pour redémarrage auto. Les crons tournent indépendamment |

---

## 12. Critères de validation

Le MVP est considéré terminé quand :

1. Les 4 crons existants apparaissent dans ClawBoard avec leurs statuts temps réel
2. Je peux créer un modèle "Synthèse quotidienne" et l'associer à un job dans `cron/jobs.json`
3. Je peux créer un nouveau cron depuis l'interface (écrit dans `cron/jobs.json`, OpenClaw l'exécute)
4. Je peux activer/désactiver un cron depuis l'interface (toggle `enabled` dans `cron/jobs.json`)
5. L'agent exécute le cron et le résultat arrive sur Discord
6. Je vois dans ClawBoard le coût réel de l'exécution (via OpenRouter API)
7. Je peux relancer manuellement un modèle via "Lancer maintenant"
8. Si ClawBoard tombe, les crons continuent à tourner normalement (zéro dépendance)
