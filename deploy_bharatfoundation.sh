#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Bharat Foundation Deployment Script for Hostinger KVM 2 VPS
# ============================================================================
# Usage: 
#   ssh root@31.97.62.23
#   curl -fsSL https://raw.githubusercontent.com/dubeysanskar/bharatfoundation/main/deploy_bharatfoundation.sh | bash
# 
# Or save and run manually:
#   chmod +x deploy_bharatfoundation.sh
#   ./deploy_bharatfoundation.sh
# ============================================================================

# ----- Configuration -----
DOMAIN="www.bharatfoundationprayagraj.com"
DOMAIN_BASE="bharatfoundationprayagraj.com"
PROJECT_NAME="bharatfoundation"
PROJECTS_BASE="/var/www/projects"                    # Base dir for all projects
PROJECT_DIR="$PROJECTS_BASE/$PROJECT_NAME"           # This project's folder
GIT_REPO="https://github.com/dubeysanskar/bharatfoundation.git"
GIT_BRANCH="main"
NODE_MAJOR=18
BACKEND_PORT=3001
PM2_APP_NAME="bharat-foundation-backend"
CERTBOT_EMAIL="rishigupta9gupta@gmail.com"
# -------------------------

echo "=========================================="
echo "  Bharat Foundation Deployment Script"
echo "  Domain: $DOMAIN"
echo "  Server: $(hostname)"
echo "  Date: $(date)"
echo "=========================================="

# 1) Update system and install basic packages
echo "[1/9] Installing system packages..."
apt update -y
DEBIAN_FRONTEND=noninteractive apt install -y \
    git nginx curl ca-certificates lsb-release gnupg \
    build-essential ufw sqlite3

# 2) Install Node.js LTS (NodeSource)
echo "[2/9] Installing Node.js $NODE_MAJOR..."
if ! command -v node >/dev/null 2>&1 || ! node -v | grep -q "v$NODE_MAJOR"; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
    apt install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3) Install PM2 globally and Certbot
echo "[3/9] Installing PM2 and Certbot..."
npm install -g pm2
apt install -y python3-certbot-nginx

# 4) Setup PM2 to start on boot
echo "[4/9] Configuring PM2 startup..."
pm2 startup systemd -u root --hp /root || true

# 5) Prepare project directories - isolated from other projects
echo "[5/9] Setting up project directory..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

if [ -d "$PROJECT_DIR/repo" ]; then
    echo "Repository exists, pulling latest changes..."
    cd repo
    git fetch origin "$GIT_BRANCH"
    git reset --hard "origin/$GIT_BRANCH"
else
    echo "Cloning repository..."
    git clone --depth=1 --branch "$GIT_BRANCH" "$GIT_REPO" repo
    cd repo
fi

# Create symlink to current release
ln -sfn "$PROJECT_DIR/repo" "$PROJECT_DIR/current"

# 6) Build Frontend (Vite/React)
echo "[6/9] Building frontend..."
cd "$PROJECT_DIR/current"

if [ -f package.json ]; then
    npm ci --silent 2>/dev/null || npm install --silent
    
    if npm run 2>/dev/null | grep -q "build"; then
        echo "Running npm run build..."
        npm run build
    fi
fi

# Determine frontend output directory
if [ -d "$PROJECT_DIR/current/dist" ]; then
    FRONTEND_DIR="$PROJECT_DIR/current/dist"
elif [ -d "$PROJECT_DIR/current/build" ]; then
    FRONTEND_DIR="$PROJECT_DIR/current/build"
elif [ -d "$PROJECT_DIR/current/public" ]; then
    FRONTEND_DIR="$PROJECT_DIR/current/public"
else
    FRONTEND_DIR="$PROJECT_DIR/current"
fi
echo "Frontend directory: $FRONTEND_DIR"

# 7) Setup and start Backend with PM2
echo "[7/9] Setting up backend..."
if [ -d "$PROJECT_DIR/current/backend" ]; then
    cd "$PROJECT_DIR/current/backend"
    
    if [ -f package.json ]; then
        npm ci --silent 2>/dev/null || npm install --silent
    fi
    
    # Stop existing process if running
    pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
    
    # Start backend with PM2
    if [ -f server.js ]; then
        echo "Starting backend on port $BACKEND_PORT..."
        PORT=$BACKEND_PORT pm2 start server.js --name "$PM2_APP_NAME" --env production
    elif [ -f index.js ]; then
        PORT=$BACKEND_PORT pm2 start index.js --name "$PM2_APP_NAME" --env production
    elif [ -f app.js ]; then
        PORT=$BACKEND_PORT pm2 start app.js --name "$PM2_APP_NAME" --env production
    else
        echo "Warning: No backend entry point found (server.js, index.js, or app.js)"
    fi
    
    pm2 save
    echo "Backend started successfully!"
else
    echo "No backend folder found, skipping backend setup."
fi

# 8) Configure Nginx
echo "[8/9] Configuring Nginx..."
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}.conf"

cat > "$NGINX_CONF" <<EOF
# Bharat Foundation - www.bharatfoundationprayagraj.com
# Generated: $(date)

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${DOMAIN_BASE};

    root ${FRONTEND_DIR};
    index index.html;

    # Frontend - SPA routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Backend uploads proxy (for images)
    location /uploads/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT}/uploads/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp)$ {
        try_files \$uri =404;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Max upload size
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
EOF

# Enable site
ln -sfn "$NGINX_CONF" "/etc/nginx/sites-enabled/${DOMAIN}.conf"

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test and reload Nginx
nginx -t
systemctl reload nginx

# 9) Setup SSL with Certbot
echo "[9/9] Setting up SSL certificate..."
echo "Make sure DNS A records point to this server (31.97.62.23):"
echo "  - ${DOMAIN} -> 31.97.62.23"
echo "  - ${DOMAIN_BASE} -> 31.97.62.23"
echo ""

if [ -n "$CERTBOT_EMAIL" ]; then
    certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" \
        -d "$DOMAIN" -d "$DOMAIN_BASE" || {
        echo "Certbot failed. Make sure DNS is configured correctly."
        echo "You can run certbot manually later:"
        echo "  certbot --nginx -d $DOMAIN -d $DOMAIN_BASE"
    }
else
    certbot --nginx -d "$DOMAIN" -d "$DOMAIN_BASE" || {
        echo "Certbot failed. Run manually when DNS is ready."
    }
fi

# Setup firewall
echo "Configuring firewall..."
ufw allow 'Nginx Full' || true
ufw allow OpenSSH || true
ufw --force enable || true

# Final summary
echo ""
echo "=========================================="
echo "  DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Project Location: $PROJECT_DIR"
echo "Frontend Dir:     $FRONTEND_DIR"
echo "Backend Port:     $BACKEND_PORT"
echo ""
echo "Useful Commands:"
echo "  pm2 status                    - Check backend status"
echo "  pm2 logs $PM2_APP_NAME        - View backend logs"
echo "  pm2 restart $PM2_APP_NAME     - Restart backend"
echo "  nginx -t && systemctl reload nginx  - Reload nginx"
echo "  tail -f /var/log/nginx/error.log    - View nginx errors"
echo ""
echo "Website: https://${DOMAIN}"
echo ""
echo "To add more projects, create similar scripts with different:"
echo "  - PROJECT_NAME"
echo "  - DOMAIN"
echo "  - BACKEND_PORT (use 3002, 3003, etc.)"
echo "=========================================="
