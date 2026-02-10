#!/bin/bash
set -e

# ==============================================================================
# OpenClaw Agent Bootstrap Script
# ==============================================================================
# 1. System Hardening & Updates
# 2. Blacklist Enforcement (Elon Musk Companies)
# 3. Runtime Installation (Node.js, OpenClaw)
# 4. Skill Injection (from GCS)
# 5. Service Startup
# ==============================================================================

echo "Starting OpenClaw Agent Bootstrap..."

# ------------------------------------------------------------------------------
# 1. System Hardening & Core Dependencies
# ------------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y
# Install OpenJDK 17 (Required for Android tools) and unzip/zip
apt-get install -y curl gnupg git unzip zip supervisor openjdk-17-jdk

# ------------------------------------------------------------------------------
# 2. Blacklist Enforcement
# ------------------------------------------------------------------------------
echo "Enforcing Corporate Blacklist..."
cat <<EOF >> /etc/hosts
# --- BLOCKED COMPETITORS (ELON MUSK COMPANIES) ---
127.0.0.1 twitter.com
127.0.0.1 www.twitter.com
127.0.0.1 x.com
127.0.0.1 www.x.com
127.0.0.1 api.twitter.com
127.0.0.1 tesla.com
127.0.0.1 www.tesla.com
127.0.0.1 spacex.com
127.0.0.1 www.spacex.com
127.0.0.1 starlink.com
127.0.0.1 www.starlink.com
127.0.0.1 x.ai
127.0.0.1 grok.x.ai
# -------------------------------------------------
EOF

# ------------------------------------------------------------------------------
# 3. Google SDK Installation (Cloud & Android)
# ------------------------------------------------------------------------------

# 3a. Google Cloud SDK (gcloud CLI)
echo "Installing Google Cloud SDK..."
# Add the gcloud distribution URI as a package source
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
# Import the Google Cloud public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
apt-get update && apt-get install -y google-cloud-cli

# 3b. Android Command Line Tools
echo "Installing Android SDK Command Line Tools..."
ANDROID_HOME=/opt/android-sdk
mkdir -p ${ANDROID_HOME}/cmdline-tools
cd ${ANDROID_HOME}/cmdline-tools
# Download Command Line Tools (latest stable)
curl -o commandlinetools-linux.zip https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip
unzip commandlinetools-linux.zip
mv cmdline-tools latest
rm commandlinetools-linux.zip

# Set Environment Variables for all users
echo "export ANDROID_HOME=${ANDROID_HOME}" >> /etc/profile.d/android.sh
echo "export PATH=\$PATH:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools" >> /etc/profile.d/android.sh
source /etc/profile.d/android.sh

# Accept Licenses and Install Platform Tools
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# ------------------------------------------------------------------------------
# 4. Runtime Installation
# ------------------------------------------------------------------------------
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "Installing OpenClaw..."
# Note: Ensure 'openclaw' is available in the npm registry or configured private registry.
if ! npm install -g openclaw@latest; then
  echo "ERROR: Failed to install OpenClaw. Please verify the package name or registry configuration."
  # In production, we might want to fallback to a local tarball or git clone.
  exit 1
fi

# ------------------------------------------------------------------------------
# 5. Skill Injection
# ------------------------------------------------------------------------------
# In a real deployment, we would pull from GCS:
# gsutil cp gs://${project_id}-skills/${department}/skills.zip /opt/openclaw/skills.zip
# unzip /opt/openclaw/skills.zip -d /opt/openclaw/skills

mkdir -p /opt/openclaw/skills
echo "Placeholder: Skills would be injected here from GCS."

# ------------------------------------------------------------------------------
# 6. Service Startup (Supervisor)
# ------------------------------------------------------------------------------
# We run OpenClaw and a simple health check server.
# The Health Check Server (Port 8080) is needed for the Load Balancer.

# Create a simple health check script
cat <<EOF > /opt/openclaw/health_check.js
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
server.listen(8080, '0.0.0.0', () => {
  console.log('Health check server running on port 8080');
});
EOF

# Create Supervisor Config
cat <<EOF > /etc/supervisor/conf.d/openclaw.conf
[program:health-check]
command=/usr/bin/node /opt/openclaw/health_check.js
autostart=true
autorestart=true
stderr_logfile=/var/log/health-check.err.log
stdout_logfile=/var/log/health-check.out.log

[program:openclaw-agent]
# This command is a placeholder. Real OpenClaw needs config/auth.
# In production, we'd inject the config.json with API keys from Secret Manager.
command=/usr/bin/openclaw agent --headless
autostart=true
autorestart=true
stderr_logfile=/var/log/openclaw.err.log
stdout_logfile=/var/log/openclaw.out.log
environment=NODE_ENV="production"
EOF

# Reload Supervisor to start services
service supervisor restart

echo "Bootstrap Complete."
