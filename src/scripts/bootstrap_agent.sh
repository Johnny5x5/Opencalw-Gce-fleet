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
SKILLS_GCS_URL=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/attributes/skills-gcs-url || echo "")
SKILLS_DIR="/opt/openclaw/skills"

mkdir -p ${SKILLS_DIR}

if [ -n "$SKILLS_GCS_URL" ]; then
  echo "Downloading skills from ${SKILLS_GCS_URL}..."
  gsutil cp "${SKILLS_GCS_URL}" /opt/openclaw/skills.zip

  if [ $? -eq 0 ]; then
    echo "Unzipping skills..."
    unzip -o /opt/openclaw/skills.zip -d ${SKILLS_DIR}
    # Install dependencies for skills (if package.json exists)
    if [ -f "${SKILLS_DIR}/package.json" ]; then
      cd ${SKILLS_DIR}
      npm install --production
    fi
  else
    echo "ERROR: Failed to download skills from GCS."
  fi
else
  echo "No skills GCS URL provided. Using empty skills directory."
fi

# ------------------------------------------------------------------------------
# 5b. Knowledge Injection (Personas/Missions)
# ------------------------------------------------------------------------------
KNOWLEDGE_GCS_URL=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/attributes/knowledge-gcs-url || echo "")
KNOWLEDGE_DIR="/opt/openclaw/knowledge"

mkdir -p ${KNOWLEDGE_DIR}

if [ -n "$KNOWLEDGE_GCS_URL" ]; then
  echo "Downloading knowledge from ${KNOWLEDGE_GCS_URL}..."
  gsutil cp "${KNOWLEDGE_GCS_URL}" /opt/openclaw/knowledge.zip

  if [ $? -eq 0 ]; then
    echo "Unzipping knowledge base..."
    unzip -o /opt/openclaw/knowledge.zip -d ${KNOWLEDGE_DIR}
  else
    echo "ERROR: Failed to download knowledge from GCS."
  fi
else
  echo "No knowledge GCS URL provided."
fi

# ------------------------------------------------------------------------------
# 6. Secret Injection (from Secret Manager)
# ------------------------------------------------------------------------------
echo "Fetching secrets..."
# Helper function to fetch secret
get_secret() {
  local name=$1
  gcloud secrets versions access latest --secret="$name" --quiet 2>/dev/null || echo ""
}

export DISCORD_TOKEN=$(get_secret "discord-token")
export TWILIO_ACCOUNT_SID=$(get_secret "twilio-account-sid")
export TWILIO_AUTH_TOKEN=$(get_secret "twilio-auth-token")
export TWILIO_PHONE_NUMBER=$(get_secret "twilio-phone-number")

# ------------------------------------------------------------------------------
# 7. Persona Mapping (Dynamic Knowledge Loading)
# ------------------------------------------------------------------------------
# Map specific departments to their personas.
# If no specific mapping exists, defaults to generic 'engineering' or 'hq' if matched.

PERSONA_FILE=""
case $DEPARTMENT in
  "eng-core") PERSONA_FILE="eng_sre.json" ;;
  "eng-product") PERSONA_FILE="eng_product.json" ;;
  "eng-data") PERSONA_FILE="eng_data.json" ;;
  "eng-qa") PERSONA_FILE="eng_qa.json" ;;
  "finance") PERSONA_FILE="finance.json" ;;
  "hq") PERSONA_FILE="hq.json" ;;
  "chaplaincy") PERSONA_FILE="chaplain.json" ;;
  team-*)
    COLOR=$(echo "$DEPARTMENT" | cut -d'-' -f2)
    # Check if a specific persona for this color exists (e.g., wargame_red.json)
    if [ -f "${KNOWLEDGE_DIR}/personas/wargame_${COLOR}.json" ]; then
      PERSONA_FILE="wargame_${COLOR}.json"
    else
      # Otherwise, use the generic competitor persona
      PERSONA_FILE="wargame_competitor.json"
    fi
    ;;
  *) PERSONA_FILE="engineering.json" ;; # Default fallback
esac

echo "Selected Persona: $PERSONA_FILE for Department: $DEPARTMENT"
# We export this so the Agent code knows which persona to load from the unzipped knowledge dir.
# The agent code (OpenClaw) should look for process.env.AGENT_PERSONA_FILE

# ------------------------------------------------------------------------------
# 8. Security Evolution Logic (Stubs)
# ------------------------------------------------------------------------------
# In a real evolution, this would apply local ip-tables based on security_level metadata.
# Currently, Terraform handles the heavy lifting (Encryption, Logging).
# This is a placeholder for agent-level tightening.

SECURITY_LEVEL=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/attributes/security-level || echo "1")

if [ "$SECURITY_LEVEL" -ge 3 ]; then
  echo "Applying Level 3 (Fortress) Local hardening..."
  # Example: Block outbound traffic on eth0 except for specific IPs (redundant if Proxy is used, but good defense in depth)
  # ufw default deny outgoing
  # ufw allow out to 169.254.169.254 # Metadata
  # ufw allow out to <PROXY_IP>
fi

# ------------------------------------------------------------------------------
# 8. Device Lab: Android Emulator Startup
# ------------------------------------------------------------------------------
# We check the instance metadata to see if we are in the 'device-lab' department.
DEPARTMENT=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/attributes/department || echo "unknown")

if [ "$DEPARTMENT" = "device-lab" ]; then
  echo "Detected Device Lab Environment. Initializing Android Emulator..."

  # Create AVD (Android Virtual Device)
  # Requires a system image. We need to install one first.
  # Note: This is resource intensive and takes time.
  echo "y" | sdkmanager "system-images;android-34;google_apis;x86_64"

  echo "no" | avdmanager create avd -n "pixel_6" -k "system-images;android-34;google_apis;x86_64" --device "pixel_6"

  # Start Emulator in Background (Headless)
  # We use Supervisor to manage it so it restarts on crash.
  cat <<EOF > /etc/supervisor/conf.d/emulator.conf
[program:android-emulator]
command=${ANDROID_HOME}/emulator/emulator -avd pixel_6 -no-audio -no-window -gpu swiftshader_indirect -no-snapshot
autostart=true
autorestart=true
stderr_logfile=/var/log/emulator.err.log
stdout_logfile=/var/log/emulator.out.log
environment=ANDROID_HOME="${ANDROID_HOME}",PATH="${PATH}:${ANDROID_HOME}/emulator:${ANDROID_HOME}/platform-tools"
EOF

  echo "Android Emulator configured for Supervisor."
else
  echo "Not a Device Lab instance. Skipping Emulator startup."
fi

# ------------------------------------------------------------------------------
# 7. Service Startup (Supervisor)
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
# We ensure it listens on port 3000 to match the Load Balancer configuration.
command=/usr/bin/openclaw agent --headless --port 3000
autostart=true
autorestart=true
stderr_logfile=/var/log/openclaw.err.log
stdout_logfile=/var/log/openclaw.out.log
environment=NODE_ENV="production",PORT="3000",AGENT_PERSONA_FILE="${PERSONA_FILE}",ANDROID_HOME="/opt/android-sdk",PATH="/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools:/usr/local/bin:/usr/bin:/bin",DISCORD_TOKEN="${DISCORD_TOKEN}",TWILIO_ACCOUNT_SID="${TWILIO_ACCOUNT_SID}",TWILIO_AUTH_TOKEN="${TWILIO_AUTH_TOKEN}",TWILIO_PHONE_NUMBER="${TWILIO_PHONE_NUMBER}"
EOF

# Secure the config file (contains secrets)
chmod 600 /etc/supervisor/conf.d/openclaw.conf

# Reload Supervisor to start services
service supervisor restart

echo "Bootstrap Complete."
