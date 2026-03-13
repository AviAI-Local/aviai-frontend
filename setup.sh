#!/usr/bin/env bash

# set -euo pipefail  # disabled for debugging (script will no longer exit on errors)

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_URL="https://github.com/AviAI-Local/aviai-frontend.git"

die() {
    echo -e "${RED}$*${NC}"
    read -p "Press Enter to close..."
    exit 1
}

cd "$(dirname "$0")"

echo -e "${GREEN}=== Frontend setup helper ===${NC}\n"

# ────────────────────────────────────────────────
# Detect OS
# ────────────────────────────────────────────────
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "mac"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}
OS=$(detect_os)

# ────────────────────────────────────────────────
# Helper: install a package via the system manager
# ────────────────────────────────────────────────
install_package_linux() {
    local pkg="$1"
    if command -v apt-get >/dev/null 2>&1; then
        sudo apt-get update -qq && sudo apt-get install -y "$pkg"
    elif command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y "$pkg"
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y "$pkg"
    else
        echo -e "${RED}Could not detect a supported package manager (apt/dnf/yum).${NC}"
        return 1
    fi
}

# ────────────────────────────────────────────────
# 1. Check Git
# ────────────────────────────────────────────────
echo -e "${BLUE}--- Checking Git ---${NC}"
if command -v git >/dev/null 2>&1; then
    echo -e "${GREEN}✓ git found: $(git --version)${NC}\n"
else
    echo -e "${YELLOW}⚠️  Git not found on this system${NC}"
    read -p "   Would you like to install Git now? (y/N) " -n 1 -r; echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        case "$OS" in
            mac)
                if command -v brew >/dev/null 2>&1; then
                    brew install git
                else
                    die "Homebrew not found. Please install it first:\n    /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                fi
                ;;
            linux)
                install_package_linux git
                ;;
            windows)
                die "Please download and install Git from: https://git-scm.com/download/win\n   After installing, restart this terminal and run the script again."
                ;;
            *)
                die "Automatic Git installation not supported on this OS.\n   Install from: https://git-scm.com/downloads"
                ;;
        esac
        command -v git >/dev/null 2>&1 || die "Git still not found after installation. Open a new terminal and try again."
        echo -e "${GREEN}✓ git installed: $(git --version)${NC}\n"
    else
        die "Git is required. Install it from https://git-scm.com/downloads and re-run this script."
    fi
fi

# ────────────────────────────────────────────────
# 2. Check VS Code
# ────────────────────────────────────────────────
echo -e "${BLUE}--- Checking VS Code ---${NC}"
if command -v code >/dev/null 2>&1; then
    echo -e "${GREEN}✓ VS Code found: $(code --version | head -1)${NC}\n"
else
    echo -e "${YELLOW}⚠️  VS Code (code) not found in PATH${NC}"
    read -p "   Would you like to install VS Code now? (y/N) " -n 1 -r; echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        case "$OS" in
            mac)
                if command -v brew >/dev/null 2>&1; then
                    brew install --cask visual-studio-code
                else
                    die "Homebrew not found. Download VS Code from: https://code.visualstudio.com/Download"
                fi
                ;;
            linux)
                # Use the official Microsoft repo for deb-based systems, fallback to snap
                if command -v apt-get >/dev/null 2>&1; then
                    curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
                        | gpg --dearmor | sudo tee /usr/share/keyrings/microsoft.gpg >/dev/null
                    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] \
https://packages.microsoft.com/repos/code stable main" \
                        | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null
                    sudo apt-get update -qq && sudo apt-get install -y code
                elif command -v snap >/dev/null 2>&1; then
                    sudo snap install --classic code
                else
                    die "Could not install automatically. Download from: https://code.visualstudio.com/Download"
                fi
                ;;
            windows)
                echo -e "${YELLOW}Please download and install VS Code from: https://code.visualstudio.com/Download${NC}"
                echo "   After installing, restart this terminal and run the script again."
                # Non-fatal — VS Code isn't required to run the dev server
                ;;
            *)
                echo -e "${YELLOW}Please install VS Code manually: https://code.visualstudio.com/Download${NC}"
                ;;
        esac
        command -v code >/dev/null 2>&1 \
            && echo -e "${GREEN}✓ VS Code installed${NC}\n" \
            || echo -e "${YELLOW}VS Code not in PATH yet — you may need to restart your terminal.${NC}\n"
    else
        echo -e "${YELLOW}Skipping VS Code installation (not required to run the project).${NC}\n"
    fi
fi

# ────────────────────────────────────────────────
# 3. Check repo availability / clone if needed
# ────────────────────────────────────────────────
echo -e "${BLUE}--- Checking repository ---${NC}"

# If aviai-frontend already exists, cd into it; otherwise clone it first
if [[ -d "aviai-frontend" ]]; then
    echo -e "${GREEN}✓ 'aviai-frontend' directory found${NC}"
    echo -n "   Checking remote connectivity... "
    if git ls-remote --exit-code "$REPO_URL" HEAD >/dev/null 2>&1; then
        echo -e "${GREEN}remote reachable${NC}\n"
    else
        echo -e "${YELLOW}remote not reachable (offline or no access) — continuing anyway${NC}\n"
    fi
    cd aviai-frontend
else
    echo -e "${YELLOW}⚠️  'aviai-frontend' not found${NC}"
    echo "   Remote: $REPO_URL"
    read -p "   Clone the repository here? (y/N) " -n 1 -r; echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -n "   Checking remote connectivity... "
        if git ls-remote --exit-code "$REPO_URL" HEAD >/dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            git clone "$REPO_URL" aviai-frontend
            echo -e "${GREEN}✓ Repository cloned into aviai-frontend${NC}\n"
            cd aviai-frontend
        else
            die "Cannot reach $REPO_URL\n   Check your internet connection or VPN access, then re-run this script."
        fi
    else
        die "Repository is required. Exiting."
    fi
fi

# ────────────────────────────────────────────────
# 4. Check Node / npm
# ────────────────────────────────────────────────
echo -e "${BLUE}--- Checking Node.js / npm ---${NC}"

if ! command -v npm >/dev/null 2>&1 || ! command -v node >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Node.js / npm not found on this system${NC}"

    read -p "   Would you like to install Node.js now? (y/N) " -n 1 -r; echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        case "$OS" in
            mac)
                if command -v brew >/dev/null 2>&1; then
                    brew install node
                else
                    die "Homebrew not found. Please install it first:\n    /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                fi
                ;;
            linux)
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                install_package_linux nodejs
                ;;
            windows)
                die "Please download and install Node.js from: https://nodejs.org/\n   After installing, restart this terminal and run the script again."
                ;;
            *)
                die "Automatic installation not supported on this OS.\n   Install from https://nodejs.org/"
                ;;
        esac
        command -v npm >/dev/null 2>&1 || die "Still cannot find npm after installation. Open a new terminal and try again."
    else
        echo -e "\n${YELLOW}Skipping installation. You can install Node.js manually:${NC}"
        echo "  • Homebrew:      brew install node"
        echo "  • nvm:           https://github.com/nvm-sh/nvm"
        echo "  • Official site: https://nodejs.org/"
        die "Node.js is required. Exiting."
    fi
fi

echo -e "${GREEN}✓ npm found:  $(npm --version)${NC}"
echo -e "${GREEN}✓ node found: $(node --version)${NC}\n"

# ────────────────────────────────────────────────
# 5. Install dependencies and start dev server
# ────────────────────────────────────────────────
if [[ ! -d "client" ]]; then
    die "Error: 'client' directory not found in the current location.\nPlease run this script from the project root directory."
fi

echo "→ Entering client directory..."
cd client

echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install

echo -e "\n${GREEN}✓ Dependencies installed${NC}"

echo -e "\n${YELLOW}Starting development server...${NC}"
echo "(press Ctrl+C to stop)"
echo ""

npm run dev
DEV_EXIT=$?

echo -e "${RED}Development server exited unexpectedly (exit code: $DEV_EXIT)${NC}"
echo ""
echo -e "${YELLOW}Last npm error output above. Working directory: $(pwd)${NC}"
echo -e "${YELLOW}package.json scripts:${NC}"
cat package.json 2>/dev/null | grep -A 10 '"scripts"' || echo "Could not read package.json"

read -p "Press Enter to close..."
