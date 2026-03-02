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

## Étape 2 — Sur openclaw : cloner et installer

```bash
cd ~
git clone https://github.com/croissanceIA/clawboard.git
cd clawboard

# Installer les dépendances
npm install

# Build production
npm run build
```

## Étape 3 — Configurer pm2 pour le serveur

```bash
# Installer pm2
npm install -g pm2

# Lancer l'app sur le port 3000
pm2 start npm --name "clawboard" -- start

# Sauvegarder et auto-restart au boot
pm2 save
pm2 startup  # suivre les instructions affichées
```

L'app est accessible sur `http://openclaw.local:3000`

## Étape 4 — Script de mise à jour

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
