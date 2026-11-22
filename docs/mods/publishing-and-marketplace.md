---
title: Publishing and marketplace
description: Pack a mod and add it to the community marketplace.
---
## Pack

```
faber mod pack <id>
```

It scans every file for keys and tokens and refuses until none are left. It writes a `.fabermod` and leaves out hidden files, `node_modules`, logs and key files. `faber mod publish <id>` prepares a repo folder and prints the git steps; it pushes nothing.

## Submit to this repo

1. Add `mods/<id>/` with `mod.json`, the code, a README that says what the mod needs and why, and your own LICENSE.
2. Add one entry to `.faber/marketplace.json`:

```json
{ "id": "<id>", "source": "./mods/<id>", "version": "1.0.0", "description": "One line." }
```

3. Open a pull request.

Or keep the mod in your own repo and open a pull request that adds only the entry, with `"source": "you/your-repo"`.

CI validates the marketplace file and every mod folder on each pull request.

## Review

Reviews check that the code runs, matches its manifest and README, and holds no secrets. A mod that sends data off the machine (`http.fetch`, `process.run`) must say where in its README.

## Your own marketplace

A marketplace is a `.faber/marketplace.json` (or `marketplace.json`) in any repo, with `name`, `owner` and a `mods` list. Users add it with `faber mod marketplace add <owner/repo>`.
