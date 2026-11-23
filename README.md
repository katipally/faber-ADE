<div align="center">

<img src="docs/assets/icon.png" alt="Faber" width="128" height="128" />

# Faber

### The agentic development environment for macOS

Run Claude Code, Codex, Gemini CLI and 20 other coding agents side by side.
Each task gets its own git worktree, with review, browser and phone control in the same window.

[![Release](https://img.shields.io/github/v/release/katipally/faber-ADE?filter=mac-v*&label=release&color=2f6fed)](https://github.com/katipally/faber-ADE/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/katipally/faber-ADE/total?color=2f6fed)](https://github.com/katipally/faber-ADE/releases)
[![macOS 26+](https://img.shields.io/badge/macOS-26%2B-0b0b0c?logo=apple&logoColor=white)](https://katipally.github.io/faber-ADE/install-and-update.html)
[![Apple silicon](https://img.shields.io/badge/Apple%20silicon-native-0b0b0c?logo=apple&logoColor=white)](https://katipally.github.io/faber-ADE/install-and-update.html)
[![Swift](https://img.shields.io/badge/Swift-SwiftUI%20%2B%20AppKit-F05138?logo=swift&logoColor=white)](https://katipally.github.io/faber-ADE/)
[![Free](https://img.shields.io/badge/price-free-2f6fed)](LICENSE)
[![Mods: MIT](https://img.shields.io/badge/mods-MIT-2f6fed)](mods/LICENSE)
[![Docs](https://img.shields.io/website?url=https%3A%2F%2Fkatipally.github.io%2Ffaber-ADE%2F&label=docs&up_message=online&color=2f6fed)](https://katipally.github.io/faber-ADE/)

[![Download for Mac](https://img.shields.io/badge/Download-Mac-0b0b0c?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/katipally/faber-ADE/releases/latest/download/Faber.dmg)
&nbsp;
[![Read the docs](https://img.shields.io/badge/Read-the%20docs-2f6fed?style=for-the-badge&logo=readthedocs&logoColor=white)](https://katipally.github.io/faber-ADE/)
&nbsp;
[![iPhone app](https://img.shields.io/badge/iPhone-App%20Store%20soon-0b0b0c?style=for-the-badge&logo=appstore&logoColor=white)](https://apps.apple.com/app/id6832401836)
&nbsp;
[![Browse mods](https://img.shields.io/badge/Browse-mods-2f6fed?style=for-the-badge&logo=github&logoColor=white)](mods/README.md)

</div>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/screens/hero-1-dark.png" />
    <img src="docs/assets/screens/hero-1.png" alt="Faber main window with a worktree, a terminal agent column and a chat column" width="900" />
  </picture>
</p>

---

## Why Faber

Coding agents are great, but a pile of terminal tabs is not a workflow. Faber is a native Mac workbench that gives every task its own worktree and lets you watch, review and steer many agents at once, from your Mac or your phone.

```
workspace
  worktree           one per task
    strip of columns
      column         a tiled grid of panes
        pane         terminal | chat | browser | files | diff | simulator
```

## Features

| | |
|---|---|
| **Terminal agents and native chat**<br>Claude Code, Codex, Gemini CLI, OpenCode, Copilot, Cursor CLI, Amp, Goose, Aider and more, or add your own command. [Learn more](https://katipally.github.io/faber-ADE/features/terminals-and-agents.html) | <img src="docs/assets/screens/terminals-and-agents-1.png" alt="Terminals and agents" width="420" /> |
| **Workspaces and worktrees**<br>One worktree per task, each a strip of columns you tile with terminals, chats, files, diffs and web pages. [Learn more](https://katipally.github.io/faber-ADE/features/workspaces-and-layouts.html) | <img src="docs/assets/screens/workspaces-and-layouts-1.png" alt="Workspaces and layouts" width="420" /> |
| **Git and PR review**<br>Inline notes for agents, a conflict resolver, stacked PRs, commit, push, pull and discard. [Learn more](https://katipally.github.io/faber-ADE/features/git-and-prs.html) | <img src="docs/assets/screens/git-and-prs-1.png" alt="Git and pull requests" width="420" /> |
| **Built-in browser, Apps and iOS Simulator**<br>Preview what an agent builds without leaving the window. [Learn more](https://katipally.github.io/faber-ADE/features/browser.html) | <img src="docs/assets/screens/browser-1.png" alt="Built-in browser" width="420" /> |
| **Floating windows (PiP)**<br>Float any tab into an always-on-top window and dock it back with Option F. [Learn more](https://katipally.github.io/faber-ADE/features/pip.html) | <img src="docs/assets/screens/pip-float.gif" alt="Floating a tab" width="420" /> |
| **Scheduled agents**<br>Run agents on a timer or on an event. [Learn more](https://katipally.github.io/faber-ADE/features/scheduled-agents.html) | <img src="docs/assets/screens/scheduled-agents-1.png" alt="Scheduled agents" width="420" /> |

Also: libghostty terminals that keep running through app updates, files and markdown, history, usage and Home, a CLI and control API, keep awake, and themes. See the [full feature list](https://katipally.github.io/faber-ADE/).

## Install

Requirements: macOS 26 or later on Apple silicon. Bring your own agents; Faber launches the CLIs you already have installed.

1. [Download Faber.dmg](https://github.com/katipally/faber-ADE/releases/latest/download/Faber.dmg).
2. Open it and drag Faber to Applications.
3. Open Faber. Releases are signed with a Developer ID and notarized by Apple, so Gatekeeper opens them without a warning.

The first launch walks you through your agents, status hooks and optional iPhone pairing. Faber updates itself with Sparkle. All releases are on the [Releases page](https://github.com/katipally/faber-ADE/releases). Details: [install and update](https://katipally.github.io/faber-ADE/install-and-update.html).

## iPhone companion

**Faber Companion** is the remote for your Mac's Faber: chat, approvals, diffs, terminal, files, a widget and Shortcuts. Connections are end-to-end encrypted. Needs iOS 27 or later and an iCloud account.

[![Coming soon to the App Store](https://img.shields.io/badge/App%20Store-coming%20soon-0b0b0c?style=for-the-badge&logo=appstore&logoColor=white)](https://apps.apple.com/app/id6832401836)

<p align="center">
  <img src="docs/assets/screens/hero-phone-1.png" alt="Faber Companion on iPhone" width="260" />
</p>

Guides: [overview](https://katipally.github.io/faber-ADE/phone/overview.html), [pairing](https://katipally.github.io/faber-ADE/phone/pairing.html), [features](https://katipally.github.io/faber-ADE/phone/features.html).

## Mods

Mods are small JS add-ons that gate tool calls, rewrite prompts, add context and put UI in chats. Community mods live in [`mods/`](mods/README.md) and are MIT licensed.

```
faber mod marketplace add katipally/faber-ADE
faber mod search weather
faber mod install <id>@faber-ADE
```

Faber shows a consent card with every capability a mod needs. Read [installing](https://katipally.github.io/faber-ADE/mods/installing.html) and [writing a mod](https://katipally.github.io/faber-ADE/mods/writing-a-mod.html), then share yours via [publishing](https://katipally.github.io/faber-ADE/mods/publishing-and-marketplace.html).

## Docs and help

- [Documentation](https://katipally.github.io/faber-ADE/)
- [FAQ](https://katipally.github.io/faber-ADE/faq.html) and [troubleshooting](https://katipally.github.io/faber-ADE/troubleshooting.html)
- Bugs and ideas: [open an issue](https://github.com/katipally/faber-ADE/issues/new/choose)
- Pairing and alerts: [SUPPORT.md](SUPPORT.md)
- [Changelog](CHANGELOG.md)

## Privacy

Your agents run on your Mac with your own accounts. Faber sends only anonymous usage counts, never your chats, code, files or terminals. On the Mac analytics are on by default and one switch turns them off (Settings, Privacy & Sync). On iPhone they are opt-in. Read [PRIVACY.md](PRIVACY.md) and [privacy and telemetry](https://katipally.github.io/faber-ADE/features/privacy-and-telemetry.html).

## Security

Releases are signed and notarized, and updates are signature checked. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License

Faber is free to use, personal or commercial. The app is proprietary and its source is not public; this repo hosts releases, the update feed, issues, mods, the license and the privacy policy. Community mods are MIT licensed. See [LICENSE](LICENSE), [mods/LICENSE](mods/LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).

<div align="center">

Copyright 2026 Yashwanth Reddy Katipally

</div>
