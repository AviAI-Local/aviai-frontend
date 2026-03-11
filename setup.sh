#!/usr/bin/env bash

set -euo pipefail

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_URL="https://github.com/AviAI-Local/aviai-frontend.git"

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
                    echo -e "${RED}Homebrew not found. Please install it first:${NC}"
                    echo "    /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                    exit 1
                fi
                ;;
            linux)
                install_package_linux git
                ;;
            windows)
                echo -e "${YELLOW}Please download and install Git from: https://git-scm.com/download/win${NC}"
                echo "   After installing, restart this terminal and run the script again."
                exit 1
                ;;
            *)
                echo -e "${RED}Automatic Git installation not supported on this OS.${NC}"
                echo "   Install from: https://git-scm.com/downloads"
                exit 1
                ;;
        esac
        command -v git >/dev/null 2>&1 || {
            echo -e "${RED}Git still not found after installation. Open a new terminal and try again.${NC}"
            exit 1
        }
        echo -e "${GREEN}✓ git installed: $(git --version)${NC}\n"
    else
        echo -e "${RED}Git is required. Install it from https://git-scm.com/downloads and re-run this script.${NC}"
        exit 1
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
                    echo -e "${YELLOW}Homebrew not found. Download VS Code from: https://code.visualstudio.com/Download${NC}"
                    exit 1
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
                    echo -e "${YELLOW}Could not install automatically. Download from: https://code.visualstudio.com/Download${NC}"
                    exit 1
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

# If we're already inside the repo, just verify the remote is reachable
if git -C "$(pwd)" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Already inside a git repository${NC}"
    echo -n "   Checking remote connectivity... "
    if git ls-remote --exit-code "$REPO_URL" HEAD >/dev/null 2>&1; then
        echo -e "${GREEN}remote reachable${NC}\n"
    else
        echo -e "${YELLOW}remote not reachable (offline or no access) — continuing anyway${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  Not inside the project repository${NC}"
    echo "   Remote: $REPO_URL"
    read -p "   Clone the repository here? (y/N) " -n 1 -r; echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -n "   Checking remote connectivity... "
        if git ls-remote --exit-code "$REPO_URL" HEAD >/dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            git clone "$REPO_URL" .
            echo -e "${GREEN}✓ Repository cloned${NC}\n"
        else
            echo -e "${RED}Cannot reach $REPO_URL${NC}"
            echo "   Check your internet connection or VPN access, then re-run this script."
            exit 1
        fi
    else
        echo -e "${RED}Repository is required. Exiting.${NC}"
        exit 1
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
                    echo -e "${RED}Homebrew not found. Please install it first:${NC}"
                    echo "    /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                    exit 1
                fi
                ;;
            linux)
                curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                install_package_linux nodejs
                ;;
            windows)
                echo -e "${YELLOW}Please download and install Node.js from: https://nodejs.org/${NC}"
                echo "   After installing, restart this terminal and run the script again."
                exit 1
                ;;
            *)
                echo -e "${RED}Automatic installation not supported on this OS.${NC}"
                echo "   Install from https://nodejs.org/"
                exit 1
                ;;
        esac
        command -v npm >/dev/null 2>&1 || {
            echo -e "${RED}Still cannot find npm after installation. Open a new terminal and try again.${NC}"
            exit 1
        }
    else
        echo -e "\n${YELLOW}Skipping installation. You can install Node.js manually:${NC}"
        echo "  • Homebrew:      brew install node"
        echo "  • nvm:           https://github.com/nvm-sh/nvm"
        echo "  • Official site: https://nodejs.org/"
        exit 1
    fi
fi

echo -e "${GREEN}✓ npm found:  $(npm --version)${NC}"
echo -e "${GREEN}✓ node found: $(node --version)${NC}\n"

# ────────────────────────────────────────────────
# 5. Install dependencies and start dev server
# ────────────────────────────────────────────────
if [[ ! -d "client" ]]; then
    echo -e "${RED}Error: 'client' directory not found in the current location.${NC}"
    echo "Please run this script from the project root directory."
    exit 1
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

echo -e "${RED}Development server exited unexpectedly${NC}"
