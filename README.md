# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Prepare your workspace
You can read the full guide [here](https://v1.tauri.app/v1/guides/getting-started/prerequisites)

Or if you're using Linux Mint, you can follow the steps below:
1. Install NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
Restart your terminal and run the following command to install the latest version of Node.js
```bash
nvm install stable
```
2. Rust toolchain
   To install Rust on linux, run:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Restart your terminal

3. Install system-wide tauri dependencies (for Debian-based)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

4. Prepare node and run the project
   In the project directory, run:
```bash
npm install
npm run tauri dev
````