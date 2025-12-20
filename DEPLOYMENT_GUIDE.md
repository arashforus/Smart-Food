# Automatic Deployment Guide

This guide explains how to set up automatic deployment to your VPS whenever you push code to GitHub.

## Prerequisites

1. **GitHub Repository** - Your code must be pushed to GitHub
2. **VPS with Node.js** - Your server must have Node.js 20+ installed
3. **PM2** (Optional but recommended) - For process management

```bash
# On your VPS, install PM2 globally
npm install -g pm2
```

## Step 1: Set Up GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `VPS_HOST` | Your VPS IP address | `192.168.1.100` |
| `VPS_USER` | SSH username | `ubuntu` |
| `VPS_SSH_KEY` | Your private SSH key | (paste your key content) |
| `VPS_PORT` | SSH port (optional, defaults to 22) | `22` |
| `APP_PATH` | Path to app on VPS | `/home/ubuntu/app` |

### How to Generate SSH Key

If you don't have an SSH key pair:

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -f ~/.ssh/vps_key

# Copy the public key to your VPS
ssh-copy-id -i ~/.ssh/vps_key.pub ubuntu@YOUR_VPS_IP
```

Then:
1. Open `~/.ssh/vps_key` (the private key) on your local machine
2. Copy its entire content
3. Paste it as the `VPS_SSH_KEY` secret on GitHub

## Step 2: Prepare Your VPS

```bash
# On your VPS
cd /home/ubuntu

# Create app directory
mkdir -p app
cd app

# Clone your repository (first time only)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2 (first time)
pm2 start "node ./dist/index.cjs" --name "la-bella-cucina"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Step 3: Set Up a Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt-get install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/la-bella-cucina
```

Paste this config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/la-bella-cucina /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 4: How It Works

Now whenever you push code to `main` or `master` branch:

1. **GitHub Actions** automatically triggers
2. **Build** - Installs dependencies and builds the project
3. **Deploy** - Connects to your VPS via SSH
4. **Updates** - Pulls latest code, installs packages, rebuilds, and restarts
5. **Done!** - Your live website is updated

```
git push → GitHub Actions → Build & Deploy → Live Website Updated
```

## Step 5: Monitor Deployments

- Go to your GitHub repo → **Actions** tab
- See all deployment runs and their status
- Click on any run to see detailed logs

## Troubleshooting

### Deployment fails with "Permission denied"

- Check your SSH key is correctly added as `VPS_SSH_KEY` secret
- Verify the key has correct permissions: `chmod 600 ~/.ssh/vps_key`

### App doesn't restart

- SSH into your VPS and check: `pm2 logs la-bella-cucina`
- Ensure PM2 is running: `pm2 status`

### Build fails on GitHub

- Check Node.js version: `npm -v && node -v`
- Run `npm install` and `npm run build` locally first to verify

### Website shows old content

- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Check PM2 process: `pm2 status` on your VPS
- View logs: `pm2 logs la-bella-cucina`

## Manual Deployment (Optional)

If you need to deploy manually without pushing to GitHub:

```bash
# SSH into your VPS
ssh ubuntu@YOUR_VPS_IP

# Navigate to app
cd /home/ubuntu/app

# Pull latest code
git pull origin main

# Install and build
npm install
npm run build

# Restart PM2
pm2 restart la-bella-cucina
```

## SSL/HTTPS Setup (Recommended)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get free SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

**That's it!** Your app is now set up for automatic deployment. Just push your code and watch it go live! 🚀
