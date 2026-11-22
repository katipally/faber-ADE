---
title: FAQ
description: Short answers about cost, privacy, agents, the phone and mods.
---
## Is Faber free?

Yes, to download and use, for personal or commercial work. See the [license](https://github.com/katipally/faber-ADE/blob/main/LICENSE).

## Is the source available?

No. This repo holds releases, the update feed, issues, community mods, the license and the privacy policy.

## Is Faber signed and notarized?

Yes. Every Mac release is signed with a Developer ID and notarized by Apple.

## Does Faber include the agents?

No. It launches the agent CLIs installed on your Mac and uses your own sign-ins and plans. It does not store or change agent credentials.

## What does Faber send to its servers?

Anonymous usage counts, by default on the Mac and only if you opt in on iPhone. Never chats, code, files or terminals. Details: [privacy and telemetry](features/privacy-and-telemetry.html).

## Can I turn analytics off?

On the Mac: Settings, Privacy & Sync, turn off Share anonymous usage. You can also start Faber with `FABER_TELEMETRY=off` or `DO_NOT_TRACK=1`.

## Does it work on an older macOS?

The app requires macOS 26 or later.

## Which agents are supported?

23 are built in, including Claude Code, Codex, Gemini CLI, OpenCode, GitHub Copilot, Cursor CLI, Amp, Goose and Aider. You can add your own command. See [terminals and agents](features/terminals-and-agents.html).

## Does the phone need a server?

No Faber server. The phone and your Mac talk directly, encrypted, and use your own private iCloud to find each other. See [pairing](phone/pairing.html).

## Are mods safe?

Mods run in a sandbox and Faber asks for consent for each capability a mod needs, again whenever its code changes. Read a mod's code before you allow it. See [mods overview](mods/overview.html).

## How do I report a bug?

[Open an issue](https://github.com/katipally/faber-ADE/issues/new/choose). Do not paste secrets or private code.
