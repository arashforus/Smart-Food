# GitHub Automatic Deployment Setup Checklist

## Quick Setup (5 minutes)

- [ ] Push this code to your GitHub repository (main or master branch)
- [ ] Go to GitHub repository Settings → Secrets and variables → Actions
- [ ] Add these 5 secrets:
  - [ ] `VPS_HOST` = Your VPS IP address
  - [ ] `VPS_USER` = SSH username (usually `ubuntu` or `root`)
  - [ ] `VPS_SSH_KEY` = Your private SSH key content
  - [ ] `VPS_PORT` = SSH port (usually `22`)
  - [ ] `APP_PATH` = App path on VPS (e.g., `/home/ubuntu/app`)

## VPS Setup (10 minutes)

- [ ] SSH into your VPS
- [ ] Install Node.js 20: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
- [ ] Install PM2: `npm install -g pm2`
- [ ] Create app directory: `mkdir -p /home/ubuntu/app && cd /home/ubuntu/app`
- [ ] Clone repository: `git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .`
- [ ] Build app: `npm install && npm run build`
- [ ] Start with PM2: `pm2 start "node ./dist/index.cjs" --name "la-bella-cucina"`

## Domain Setup (5 minutes)

- [ ] Install Nginx: `sudo apt-get install nginx`
- [ ] Configure Nginx to proxy to port 5000
- [ ] Point your domain DNS to your VPS IP
- [ ] (Optional) Set up SSL with Let's Encrypt

## Test It!

- [ ] Make a small change to your code
- [ ] Push to GitHub: `git push origin main`
- [ ] Go to GitHub → Actions tab
- [ ] Watch the deployment happen automatically
- [ ] Your website updates automatically! 🎉

---

**For detailed instructions, see DEPLOYMENT_GUIDE.md**
