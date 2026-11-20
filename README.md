# Faber

A native Mac workbench for coding agents. Run Claude Code, Codex, Gemini CLI and 19 other agents side by side, each task in its own git worktree, with review, browser and phone control in the same window.

<!-- screenshot: main window with a worktree, terminal agent column and chat column -->
<!-- screenshot: diff review with the conflict resolver open -->
<!-- screenshot: iPhone companion approving an agent request -->

Faber is free to use, personal or commercial. This repo hosts releases, the update feed, issues, community mods, the license and the privacy policy. The app source is not public.

## Download

Get the latest build from [Releases](https://github.com/katipally/faber-ADE/releases/latest). Faber updates itself after the first install.

## What it does

- **Native Mac app.** SwiftUI and AppKit, no Electron.
- **22 terminal agents plus native chat.** Claude Code, Codex, Gemini CLI, OpenCode, Copilot, Cursor CLI, Amp, Goose, Aider and more, or add your own command.
- **Worktrees.** One per task, each a strip of columns you can tile with terminals, chats, files, diffs and web pages.
- **Git and PR review.** Diff review with inline notes for agents, a conflict resolver, stacked PRs, commit, push, pull and discard.
- **libghostty terminals** that keep running through app updates.
- **Built-in browser and Apps catalog** for previewing what an agent builds.
- **Mods.** Small JS add-ons that gate tool calls, rewrite prompts and add UI to chats. See [mods](mods/README.md).
- **iPhone companion.** Watch agents, answer approvals and send prompts from your phone, end-to-end encrypted.
- **Scheduled agents** that run on a timer or on an event.

## Requirements

- macOS 26 or later. Some browser features (iframe automation, Global Privacy Control) need macOS 27.
- The agents you want to use installed on your Mac (Faber launches them, it does not bundle them).
- iPhone companion: iOS 27 or later and an iCloud account.

## Help

- Bugs and ideas: [open an issue](https://github.com/katipally/faber-ADE/issues/new/choose).
- Pairing and alerts help: [SUPPORT.md](SUPPORT.md).
- Share a mod: [mods/README.md](mods/README.md).
- [Privacy policy](PRIVACY.md), [license](LICENSE), [changelog](CHANGELOG.md), [third-party notices](THIRD_PARTY_NOTICES.md).

Copyright 2026 Yashwanth Reddy Katipally.
