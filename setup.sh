#!/usr/bin/env bash

set -euo pipefail

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Frontend setup helper ===${NC}\n"

# ────────────────────────────────────────────────
# Check if npm is available
# ────────────────────────────────────────────────
command -v npm >/dev/null 2>&1
NPM_EXISTS=$?

command -v node >/dev/null 2>&1
NODE_EXISTS=$?

if [ $NPM_EXISTS -ne 0 ] || [ $NODE_EXISTS -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Node.js / npm not found on this system${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "   You appear to be on macOS."
        echo "   Recommended: install via Homebrew or use nvm"
        echo ""
        read -p "Would you like to install Node.js now via Homebrew? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if ! command -v brew >/dev/null 2>&1; then
                echo -e "${RED}Homebrew not found. Please install it first:${NC}"
                echo "    /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
            brew install node
        else
            echo -e "\n${YELLOW}Skipping installation. You can install Node.js manually:${NC}"
            echo "  • Homebrew:     brew install node"
            echo "  • nvm:          https://github.com/nvm-sh/nvm"
            echo "  • Official site: https://nodejs.org/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "   You appear to be on Linux."
        echo ""
        read -p "Would you like to install Node.js (using nodesource repo) ? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Install latest LTS from nodesource (good default in 2025)
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            if [[ -f /etc/debian_version || -f /etc/ubuntu_version ]]; then
                sudo apt-get install -y nodejs
            elif command -v dnf >/dev/null 2>&1; then
                sudo dnf install -y nodejs
            elif command -v yum >/dev/null 2>&1; then
                sudo yum install -y nodejs
            else
                echo -e "${RED}Could not detect supported package manager (apt/dnf/yum)${NC}"
                exit 1
            fi
        else
            echo -e "\n${YELLOW}Skipping. Manual installation options:${NC}"
            echo "  • nvm          → https://github.com/nvm-sh/nvm"
            echo "  • Nodesource   → https://github.com/nodesource/distributions"
            echo "  • Official     → https://nodejs.org/en/download/package-manager"
            exit 1
        fi
    else
        echo -e "${RED}Automatic installation not supported on this OS.${NC}"
        echo "Please install Node.js manually from https://nodejs.org/"
        exit 1
    fi

    # Final check after attempted installation
    command -v npm >/dev/null 2>&1 || {
        echo -e "${RED}Still cannot find npm after installation attempt.${NC}"
        echo "Please open a new terminal and try again, or install Node.js manually."
        exit 1
    }
fi

# ────────────────────────────────────────────────
# Now we know npm exists → continue
# ────────────────────────────────────────────────
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"
echo -e "${GREEN}✓ node found: $(node --version)${NC}\n"

# Move to client folder
if [[ ! -d "client" ]]; then
    echo -e "${RED}Error: 'client' directory not found in current location${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "→ Entering client directory..."
cd client

echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install

echo -e "\n${GREEN}✓ Dependencies installed${NC}"

echo -e "\n${YELLOW}Starting development server...${NC}"
echo "(press Ctrl+C to stop)\n"

npm run dev

# If we ever reach here (unlikely), something went wrong with npm run dev
echo -e "${RED}Development server exited unexpectedly${NC}"