# ClawBoard

Dashboard de monitoring pour les crons [OpenClaw](https://openclaw.dev). Visualisez vos taches planifiees, gerez vos templates, suivez les executions et les couts.

**Stack** : Next.js 16 + Tailwind CSS v4 + SQLite (Drizzle) + TypeScript

## Installation rapide

```bash
# 1. Cloner le repo
git clone https://github.com/croissanceIA/clawboard.git
cd clawboard

# 2. Installer les dependances
npm install

# 3. Configurer (wizard interactif)
npm run setup

# 4. Build et lancer
npm run build
npm start
```

Le wizard `npm run setup` detecte automatiquement votre installation OpenClaw et genere le fichier `.env.local`.

## Prerequis

- **Node.js** 20+ (recommande : 22 LTS)
- **OpenClaw** installe avec un dossier cron configure (`~/.openclaw/cron/`)

## Configuration

Toute la configuration se fait via `.env.local` (genere par `npm run setup`) :

| Variable | Requis | Description | Defaut |
|----------|--------|-------------|--------|
| `OPENCLAW_CRON_PATH` | Oui | Chemin vers le dossier cron d'OpenClaw | - |
| `OPENCLAW_CLI_PATH` | Non | Chemin absolu vers le binaire `openclaw` | Auto-detecte |
| `OPENCLAW_DEFAULT_AGENT` | Non | Agent par defaut pour les nouveaux templates | `main` |
| `OPENCLAW_DEFAULT_MODEL` | Non | Modele LLM par defaut | `openrouter/anthropic/claude-sonnet-4` |
| `OPENCLAW_DEFAULT_DELIVERY_CHANNEL` | Non | Canal de livraison par defaut | `discord` |
| `PORT` | Non | Port du serveur | `3000` |

Un fichier `.env.example` est fourni comme reference.

## Developpement

```bash
npm run dev
```

Le serveur de dev demarre avec hot-reload sur `http://localhost:3000`.

## Deploiement

### Avec PM2 (macOS / Linux)

```bash
npm install -g pm2
npm run build
pm2 start npm --name "clawboard" -- start -- -H 0.0.0.0
pm2 save
pm2 startup
```

### Avec systemd (Linux / VPS)

Creer `/etc/systemd/system/clawboard.service` :

```ini
[Unit]
Description=ClawBoard
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/chemin/vers/clawboard
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable clawboard
sudo systemctl start clawboard
```

### Mise a jour

```bash
cd /chemin/vers/clawboard
git pull origin main
npm install
npm run build
# Puis redemarrer le processus (pm2 restart clawboard / systemctl restart clawboard)
```

## Architecture

- Les crons sont geres par **OpenClaw** (systeme externe) via `jobs.json` + `runs/*.jsonl`
- ClawBoard lit/ecrit dans `$OPENCLAW_CRON_PATH` pour afficher et gerer les jobs
- Les **templates** (modeles de taches) sont stockes dans SQLite (`clawboard.db`, cree automatiquement)
- Les **schedules** (recurrences) sont ecrites dans `jobs.json` d'OpenClaw
- Le bouton "Executer" lance `openclaw agent` via spawn (necessite le binaire openclaw)

## Licence

MIT
