# VibeStudio Master Repository

## Where Code Meets Flow

VibeStudio represents a revolutionary approach to development environments that adapts to you, not the other way around. It's the world's first truly empathetic IDE that understands not just your code, but your mood, energy, and creative flow state.

### The Vision: Emotionally Intelligent Development

**VibeStudio goes beyond traditional IDEs** by implementing mood-adaptive AI that continuously learns and adjusts your environment based on:

- **Keystroke Pattern Analysis**: Monitors your typing rhythm, pause patterns, and coding velocity to understand your current state of mind
- **Visual Mood Detection**: Through optional webcam integration, reads facial expressions and body language to detect stress, focus, fatigue, or excitement
- **Dynamic Theme Evolution**: Colors, fonts, contrast, and UI animations automatically adjust throughout your session based on your detected mood and energy levels
- **Contextual Font Optimization**: Typography that changes based on your task - creative fonts for brainstorming, crisp monospace for debugging, comfortable reading fonts for documentation

### Conversational Project Intelligence

The webcam AI isn't just monitoring - it's a full conversational partner that:
- **Knows Your Entire Project**: Complete context of your codebase, project goals, and development patterns
- **Proactive Assistance**: "I notice you've been staring at that function for 10 minutes - want me to suggest some approaches?"
- **Emotional Intelligence**: "You seem frustrated with this bug. Let's take a step back and approach it differently."
- **Learning Conversations**: Remembers your preferences, coding style, and personal development philosophy

### What Makes VibeStudio Unique

**Biometric-Driven Development Experience**
Real-time mood detection through multiple sensors creates an environment that evolves throughout your day - energizing themes in the morning, calming colors during late night sessions.

**Flow State Optimization**
Detection of "flow state" patterns with environment preservation, distraction minimization during deep focus periods, and gentle transitions during context switching.

**Adaptive Aesthetic Intelligence**
Themes that shift gradually like natural lighting, color psychology integration (blues for focus, greens for creativity, warm tones for debugging), and animation speeds that match your energy level.

### The Goal: Creating the First Emotionally Intelligent IDE

VibeStudio recognizes that developers are human beings with varying energy levels, moods, and creative cycles. We believe code quality improves when the environment supports the developer's current state, AI should be a companion that understands context and emotion, and beautiful environments inspire beautiful code.

---

What you're seeing here is the conglomeration of all the repositories that make up the entire VibeStudio project. This is only the beginning of revolutionizing how developers interact with their code. For details, visit each repository individually:

- [vs-app](https://github.com/lockard-LLC/vs-app): this is the VSCode fork part of VibeStudio and the outer directory of the project. It contains the bulk of the editor functionalities.
- [vs-submodule](https://github.com/lockard-LLC/vs-submodule): this is the Continue fork part of VibeStudio and is a submodule of `vs-app`. It contains the bulk of the AI chat functionalities.
- [vs-landing-page](https://github.com/lockard-LLC/vs-landing-page): this is the landing page of VibeStudio.
- [vs-documentation](https://github.com/lockard-LLC/vs-documentation): this is the [documentation page](https://vibestudio.online/docs) of VibeStudio and is linked to from the landing page.
- [vs-server](https://github.com/lockard-LLC/vs-server): this is the server of VibeStudio which is semi-private to maintain security. The use of VibeStudio server is optional, and serves as a way to provide convenience for users who do not wish to use their own API keys.
- [vs-server-issues-public](https://github.com/lockard-LLC/vs-server-issues-public): this is where all the issues are listed for the VibeStudio server.

## Contributing

We welcome contributions from the community! Whether you're fixing a bug, improving the documentation, or adding a new feature, we appreciate your help in making VibeStudio better. There is a lot of context involved and we understand it can be overwhelming when first trying to join the project. Here is a quick summary of key information and how we currently work together:

- We have a bunch of issues which are free to tackle (see the issues tab on individual repos). Make sure to leave a comment indicating you're working on it (check for existing comments also). You can raise a PR anytime and we usually review them pretty quickly.
- If you notice anything about VibeStudio that you think you could improve, then let us know!
- We have a lot on our plate so it's easy for us to miss something. The best way to get our attention is to ping us directly in our Discord server.

> [!IMPORTANT]
> Whenever making changes to our updated forks (vs-app and vs-roo-code) be mindful of any potential issues your changes could introduce when we have to pull upstream


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

To get started with VibeStudio development, you'll need to clone this repo (vs-master) and install the dependencies for each component:

1. VibeStudio App:
```bash
cd ./vs-app && npm i
```

2. VibeStudio Roo Code:
```bash
cd ./vs-roo-code && npm run install:all
```

3. VibeStudio Submodule:
```bash
./vs-submodule/install-and-build.sh  # For Unix/Mac
./vs-submodule/install-and-build.ps1 # For Windows
```

## Development

To start development:

![image](https://github.com/user-attachments/assets/2f823fef-03c6-4d0e-8966-75ff7fa0f9d8)

1. Launch the development servers:
   - In VibeStudio (or vscode), go to Run and Debug
   - Select and run the "🚀 Start All Dev Servers" task

2. Start the VibeStudio instance:
```bash
./vs-app/scripts/code.sh  # For Unix/Mac
./vs-app/scripts/code.ps1 # For Windows
```

> [!NOTE]
> Hot Module Reload (HMR) is enabled for React frontends (Roo Code frontend, creator overlay, and chat pane).
> For changes outside these components, you'll need to restart the VSCode instance using the code script.

## Technology Stack

- **Core IDE**: TypeScript/Electron.js with VSCode foundation
- **Mood-Adaptive AI**: Machine learning models for keystroke dynamics and visual cue analysis
- **Webcam Intelligence**: Privacy-first local processing for facial expression and body language detection
- **Dynamic Theming**: Real-time environment rendering based on detected emotional states
- **Project Intelligence**: MCP (Model Context Protocol) integration for contextual understanding
- **Frontend**: Next.js/React with Supabase auth (TailwindCSS + Shadcn) for landing page
- **Backend**: Python FastAPI server with Supabase database
- **Biometric Processing**: Local ML models for keystroke pattern analysis and mood detection
- **Logging/Telemetry**: Axiom and PostHog for usage analytics (privacy-focused)

## Contact

For any questions or issues, feel free to open an issue, or you can also reach out to us directly in the [VibeStudio Discord](https://discord.gg/7QMraJUsQt), or email us at [admin@vibestudio.online](mailto:admin@vibestudio.online).

## FAQ

Checkout our [FAQ](https://vibestudio.online/faq) our site.
