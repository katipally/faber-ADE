---
title: Troubleshooting
description: Fixes for updates, agents, alerts, pairing and the Simulator.
---
## An agent does not start

Faber launches the CLI from your PATH. Open Settings, Agents to see what is installed and the install command for the rest. For a custom agent, check the command and arguments in Settings, Agents, Custom agents.

## An agent's status is not tracked

Agents with a hook installer report status through hooks. Run Install all from the first-run welcome, or the hook install sheet in Settings, Agents. Agents without one are followed by their process, terminal title and screen.

## Updates are off or fail

Settings, Advanced, Updates says why updates are off in a given build. Check Now contacts GitHub; if you are offline or GitHub is blocked, it fails. Download the latest zip from [Releases](https://github.com/katipally/faber-ADE/releases/latest) as a fallback.

## Alerts do not reach the phone

- iPhone: Settings, Notifications, Faber Companion must be on.
- Mac: Faber, Settings, Notifications, choose which events alert your iPhone.
- Alerts are sent by Faber for Mac, so it must be running. The same Apple Account must be signed in on both devices.

## The phone cannot connect

The phone names the reason: Local Network is off for Faber, the iPhone is offline, the network blocks direct links, the Mac is asleep or Faber is closed, the Mac runs an older Faber, or iCloud did not answer. Its buttons open iPhone Settings, retry, or set up Tailscale. See [pairing](phone/pairing.html).

## Settings, Devices shows an iCloud warning

The warning names the cause: the build lacks the iCloud entitlement, the Mac is not signed in to iCloud, iCloud is restricted or full, or a CloudKit error.

## The Simulator column shows a still picture

The display helper could not run, so the column falls back to a screenshot about once a second without touch or keys. Press Retry. It needs Xcode with an iOS runtime.

## A mod does not load

Run `faber mod validate <id>` and `faber mod logs <id>`. A mod waits for your consent after install and after every code change. Safe mode turns all mods off.

## Still stuck

Email yashwanthreddykatipally@gmail.com or [open an issue](https://github.com/katipally/faber-ADE/issues/new/choose) with your Faber version, macOS version and what you expected. Please do not send code or secrets.
