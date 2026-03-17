# Deploiement ClawBoard

## Sur un Mac (local ou Mac mini distant)

### 1. Cloner et configurer

```bash
git clone https://github.com/croissanceIA/clawboard.git
cd clawboard
npm install
npm run setup    # wizard interactif qui genere .env.local
npm run build
```

### 2. Lancer avec PM2

```bash
npm install -g pm2
pm2 start npm --name "clawboard" -- start -- -H 0.0.0.0
pm2 save
pm2 startup    # suivre les instructions affichees
```

### 3. Firewall macOS (si acces reseau)

```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which node)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp $(which node)
```

## Sur un VPS Linux (Ubuntu/Debian)

### 1. Installer Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Cloner et configurer

```bash
git clone https://github.com/croissanceIA/clawboard.git
cd clawboard
npm install
npm run setup
npm run build
```

### 3. Lancer avec systemd

Creer `/etc/systemd/system/clawboard.service` :

```ini
[Unit]
Description=ClawBoard - Dashboard OpenClaw
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
sudo systemctl daemon-reload
sudo systemctl enable clawboard
sudo systemctl start clawboard
```

## Mise a jour automatique

Script `deploy.sh` a placer a la racine du projet :

```bash
#!/bin/bash
cd "$(dirname "$0")"
git pull origin main
npm install --production=false
npm run build
# Adapter selon votre process manager :
# pm2 restart clawboard
# systemctl restart clawboard
echo "Deploy termine a $(date)"
```

```bash
chmod +x deploy.sh
```

### Optionnel : auto-deploy via cron

```bash
crontab -e
```

```
*/5 * * * * cd /chemin/vers/clawboard && git fetch origin main && [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ] && ./deploy.sh >> deploy.log 2>&1
```
