# VibeStudio Master Repository

VibeStudio aims to be an inventory that curates the leading, cutting-edge AI tools in one place. Our unified interface seamlessly integrates these solutions, allowing users to effortlessly switch between tools without needing to waste effort hunting for alternatives.

What you're seeing here is the conglomeration of all the repositories that make up the entire VibeStudio project. This is only the beginning, and the list shall keep expanding. For details, visit each component individually:

- **vibestudio-app/**: VSCode fork serving as the main editor platform. Contains the bulk of the editor functionalities and integrations.
- **VibeStudio-Roo-Code/**: Continue fork providing AI coding agent functionality. Contains the bulk of the AI chat and coding assistance features.
- **vibestudio-landing-page/**: VibeStudio landing page built with Next.js. The main website and user interface.
- **vibestudio-documentation/**: Documentation site built with Docusaurus. Contains guides, API docs, and help content.
- **vibestudio-submodule/**: Continue.dev fork integrated as git submodule for additional AI capabilities.
- **vibestudio-server-issues-public/**: Public issue tracking for VibeStudio server-related bugs and features.

## Contributing

We welcome contributions from the community! Whether you're fixing a bug, improving the documentation, or adding a new feature, we appreciate your help in making VibeStudio better. There is a lot of context involved and we understand it can be overwhelming when first trying to join the project. Here is a quick summary of key information and how we currently work together:

- We have a bunch of issues which are free to tackle (see the issues tab). Make sure to leave a comment indicating you're working on it (check for existing comments also). You can raise a PR anytime and we usually review them pretty quickly.
- If you notice anything about VibeStudio that you think you could improve, then let us know!
- We have a lot on our plate so it's easy for us to miss something. The best way to get our attention is to ping us directly in our Discord server.

> [!IMPORTANT]
> Whenever making changes to our updated forks (vibestudio-app and VibeStudio-Roo-Code) be mindful of any potential issues your changes could introduce when we have to pull upstream


## 🛠 Prerequisites

Ensure you have the following tools installed:

- 🦀 [Rust/Cargo](https://www.rust-lang.org/tools/install)
- 🐙 [Git](https://git-scm.com)
- 🌐 [Node.JS](https://nodejs.org/en/), **x64**, version `=20.18.0` (other versions have not been tested) - we recommend using Node Version Manager (nvm)
- 📦 [Npm](https://www.npmjs.com/), version `=10.8.2` (other versions have not been tested)
- 📦 [Yarn 1](https://classic.yarnpkg.com/en/), version `>=1.10.1 and <2`
- 🐍 [Python](https://www.python.org/downloads/), version `=3.11.X` (required for node-gyp) - we recommend using pyvenv
- ⚙️ A C/C++ compiler toolchain for your platform:
  - **Windows**: Install the Windows Build Tools (through Visual Studio Installer) with the following components
    - Desktop development with C++ (Workload)
    - C++ MFC for v143 build tools with Spectre Mitigations (Individual Component)
    - MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (Individual Component)
  - **macOS**: Install Xcode and Command Line Tools with `xcode-select --install`
  - **Linux**: Install the necessary development tools as described in the instructions

## Installation

To get started with VibeStudio development, you'll need to clone this repo and install the dependencies for each component:

```bash
git clone https://github.com/lockard-LLC/vibestudio.git
cd vibestudio
git submodule update --init --recursive
```

1. **VibeStudio App** (Main Editor):
```bash
cd ./vibestudio-app && npm install
```

2. **VibeStudio Roo Code** (AI Agent):
```bash
cd ./VibeStudio-Roo-Code && npm run install:all
```

3. **VibeStudio Landing Page** (Website):
```bash
cd ./vibestudio-landing-page && yarn install
```

4. **VibeStudio Submodule** (Additional AI features):
```bash
./vibestudio-submodule/install-and-build.sh  # For Unix/Mac
./vibestudio-submodule/install-and-build.ps1 # For Windows
```

5. **Documentation** (Optional):
```bash  
cd ./vibestudio-documentation && npm install
```

## Development

To start development:

![image](https://github.com/user-attachments/assets/2f823fef-03c6-4d0e-8966-75ff7fa0f9d8)

1. **Launch the development servers**:
   - In VibeStudio (or VSCode), go to Run and Debug
   - Select and run the "🚀 Start All Dev Servers" task

2. **Start the VibeStudio instance**:
```bash
./vibestudio-app/scripts/code.sh  # For Unix/Mac
./vibestudio-app/scripts/code.ps1 # For Windows
```

3. **Start the landing page** (optional):
```bash
cd ./vibestudio-landing-page && yarn dev
```

> [!NOTE]
> Hot Module Reload (HMR) is enabled for React frontends (Roo Code frontend, creator overlay, chat pane, and landing page).
> For changes outside these components, you'll need to restart the VSCode instance using the code script.

## Technology Stack

- **Main Platform**: TypeScript/Electron.js (VSCode fork)
- **Landing Page**: Next.js/React with Supabase auth (TailwindCSS + Shadcn/ui)
- **Backend**: Python FastAPI server with Supabase database
- **Documentation**: Docusaurus v3
- **Logging/Telemetry**: Axiom and PostHog
- **AI Integration**: Multiple provider support (Anthropic, OpenAI, Gemini, etc.)

## Contact

For any questions or issues, feel free to open an issue, or you can also reach out to us directly:

- **Website**: [vibestudio.online](https://vibestudio.online)
- **Discord**: [VibeStudio Community](https://discord.gg/7QMraJUsQt)
- **GitHub**: [lockard-LLC/vibestudio](https://github.com/lockard-LLC/vibestudio)

## FAQ

Checkout our [FAQ](https://vibestudio.online/faq) on the website.
