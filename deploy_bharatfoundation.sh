#!/usr/bin/env bash
set -euo pipefail

# ----- Config (edit only if you want different values) -----
DOMAIN="www.bharatfoundationprayagraj.com"
ROOT_DIR="/var/www/bharatfoundation"
GIT_REPO="https://github.com/dubeysanskar/bharatfoundation.git"
GIT_BRANCH="main"
NODE_MAJOR=18
BACKEND_PORT=3001
PM2_APP_NAME="bharat-backend"
# -----------------------------------------------------------

echo "Starting deploy for $DOMAIN on $(hostname) ..."

# 1) Basic packages
apt update -y
DEBIAN_FRONTEND=noninteractive apt install -y git nginx curl ca-certificates lsb-release gnupg build-essential

# 2) Install NodeJS LTS (NodeSource)
if ! command -v node >/dev/null 2>&1 || ! node -v | grep -q "v$NODE_MAJOR"; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
  apt install -y nodejs
fi

# 3) Install pm2 and certbot
npm install -g pm2
apt install -y python3-certbot-nginx

# 4) Prepare directories and clone/update repo
mkdir -p "$ROOT_DIR"
cd "$ROOT_DIR"
if [ -d "$ROOT_DIR/repo" ]; then
  echo "Repo exists, fetching latest..."
  cd repo
  git fetch origin "$GIT_BRANCH"
  git reset --hard "origin/$GIT_BRANCH"
else
  git clone --depth=1 --branch "$GIT_BRANCH" "$GIT_REPO" repo
  cd repo
fi

# keep a stable "current" symlink
ln -sfn "$ROOT_DIR/repo" "$ROOT_DIR/current"

# 5) Build frontend
# Prefer npm ci for reproducible installs
echo "Installing project dependencies (root)..."
if [ -f package-lock.json ] || [ -f package.json ]; then
  npm ci --silent || npm install --silent
fi

# If there's a frontend build step (common for Vite/React)
if npm run | grep -q "build"; then
  echo "Running npm run build..."
  npm run build --silent || true
fi

# Determine frontend output dir:
if [ -d "$ROOT_DIR/current/dist" ]; then
  FRONTEND_DIR="$ROOT_DIR/current/dist"
elif [ -d "$ROOT_DIR/current/public" ]; then
  FRONTEND_DIR="$ROOT_DIR/current/public"
elif [ -f "$ROOT_DIR/current/index.html" ]; then
  FRONTEND_DIR="$ROOT_DIR/current"
else
  echo "Warning: could not detect frontend build output. Looking for dist/ public/ or index.html."
  FRONTEND_DIR="$ROOT_DIR/current"
fi
echo "Frontend directory -> $FRONTEND_DIR"

# 6) Start backend with PM2 (assume code in ./backend)
if [ -d "$ROOT_DIR/current/backend" ]; then
  cd "$ROOT_DIR/current/backend"
  if [ -f package-lock.json ] || [ -f package.json ]; then
    npm ci --silent || npm install --silent
  fi

  # Try common start commands in order
  echo "Starting backend on port $BACKEND_PORT"
  pm2 delete "$PM2_APP_NAME" >/dev/null 2>&1 || true

  # Try `npm start`
  if npm run | grep -q "start"; then
    PORT="$BACKEND_PORT" pm2 start npm --name "$PM2_APP_NAME" -- start
  # Try `node index.js` or server.js or app.js
  elif [ -f index.js ]; then
    PORT="$BACKEND_PORT" pm2 start index.js --name "$PM2_APP_NAME"
  elif [ -f server.js ]; then
    PORT="$BACKEND_PORT" pm2 start server.js --name "$PM2_APP_NAME"
  elif [ -f app.js ]; then
    PORT="$BACKEND_PORT" pm2 start app.js --name "$PM2_APP_NAME"
  else
    echo "Could not find a startup script in backend/ — backend won't be started by this script."
  fi

  pm2 save
else
  echo "No backend/ folder found. Skipping backend start."
fi

# 7) Create nginx config
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}.conf"
echo "Writing nginx config to $NGINX_CONF"

cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name ${DOMAIN} ${DOMAIN#www.};

    root ${FRONTEND_DIR};
    index index.html;

    # Serve static frontend
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        try_files \$uri =404;
        access_log off;
        expires 7d;
    }

    # Optional: increase client max body size for uploads
    client_max_body_size 50M;
}
EOF

# enable site
ln -sfn "$NGINX_CONF" /etc/nginx/sites-enabled/${DOMAIN}.conf

# remove default site to avoid default_server conflicts
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm -f /etc/nginx/sites-enabled/default
fi

# test and reload nginx
nginx -t
systemctl reload nginx

# 8) Obtain TLS certificate (interactive). If you want completely non-interactive, set CERTBOT_EMAIL below and rerun with --non-interactive options.
echo "Now attempting to obtain/enable SSL with certbot (interactive)."
echo "If DNS A record for $DOMAIN is not pointed to this server yet, certbot will fail."
CERTBOT_EMAIL=""
if [ -z "$CERTBOT_EMAIL" ]; then
  certbot --nginx -d "$DOMAIN" -d "${DOMAIN#www.}"
else
  certbot --nginx -n --agree-tos --email "$CERTBOT_EMAIL" -d "$DOMAIN" -d "${DOMAIN#www.}"
fi

echo "Deploy finished. Check nginx logs for issues: sudo tail -n 200 /var/log/nginx/error.log"
echo "Use 'pm2 status' to check backend."
