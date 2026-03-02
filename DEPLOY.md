# Déploiement ClawBoard — GitHub + openclaw

## Étape 1 — Initialiser le repo et push sur GitHub (sur ton Mac)

```bash
cd "~/Library/CloudStorage/GoogleDrive-naier.saidane@gmail.com/Mon Drive/1_Dev/clawboard"

# Init git
git init
git add -A
git commit -m "Initial commit"

# Créer le repo GitHub (privé) et push
gh repo create croissanceIA/clawboard --private --source . --push
```

## Étape 2 — Sur openclaw : cloner et configurer l'environnement

```bash
cd ~
git clone https://github.com/croissanceIA/clawboard.git
cd clawboard

# Installer les dépendances
npm install
```

Le `.env.local` n'est pas versionné (gitignore). Il faut le créer **avant le build** (Next.js intègre les variables d'env au moment du build, pas au runtime) :

```bash
cat > ~/clawboard/.env.local << 'EOF'
OPENCLAW_CRON_PATH=/Users/mireillemonin/.openclaw/cron
EOF
```

```bash
# Build production (après avoir créé .env.local)
npm run build
```

## Étape 3 — Configurer pm2 pour le serveur

```bash
# Installer pm2
npm install -g pm2

# Lancer l'app sur le port 3000 (écoute sur toutes les interfaces pour accès Tailscale)
pm2 start npm --name "clawboard" -- start -- -H 0.0.0.0

# Sauvegarder et auto-restart au boot
pm2 save
pm2 startup  # suivre les instructions affichées
```

## Étape 4 — Autoriser Node dans le firewall macOS

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which node)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp $(which node)
```

L'app est accessible via Tailscale sur `http://100.108.65.56:3000`

## Étape 5 — Script de mise à jour

Créer `~/clawboard/deploy.sh` sur openclaw :

```bash
#!/bin/bash
cd ~/clawboard
git pull origin main
npm install --production=false
npm run build
pm2 restart clawboard
echo "Deploy terminé à $(date)"
```

```bash
chmod +x ~/clawboard/deploy.sh
```

## Workflow quotidien

1. Modifier le code sur ton Mac
2. `git add . && git commit -m "..." && git push`
3. Sur openclaw : `~/clawboard/deploy.sh`

## Optionnel — Auto-deploy via cron

Pour qu'openclaw pull et rebuild automatiquement toutes les 5 min (uniquement s'il y a de nouveaux commits) :

```bash
crontab -e
```

Ajouter :

```
*/5 * * * * cd ~/clawboard && git fetch origin main && [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ] && ~/clawboard/deploy.sh >> ~/clawboard/deploy.log 2>&1
```
