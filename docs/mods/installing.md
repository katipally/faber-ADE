---
title: Installing mods
description: Install from the community marketplace, a repo folder, a git URL or a package.
---
## From this repo

```
faber mod marketplace add katipally/faber-ADE
faber mod search weather
faber mod install <id>@faber-ADE
```

Or install one folder directly:

```
faber mod install katipally/faber-ADE#main:mods/<id>
```

You can also use the Mods page (Ctrl Cmd M), which previews permissions, files and the source's SHA-256 before installing.

## Sources

| Source | Means |
|---|---|
| `owner/repo` | A GitHub repo |
| `owner/repo#ref:subdir` | A branch, tag or commit, and the folder with `mod.json` |
| a git URL | `https`, `ssh` or `file` |
| `<id>@<marketplace>` | An entry of a marketplace you added |
| a folder, `.fabermod` or `.zip` | A local copy |

## After install

The mod lands disabled and with no grant. Review its capabilities on the consent card, then allow it. When it changes, you are asked again.

Install clones with hooks disabled and a 60 second limit, so a source cannot run code during install.

## Update and remove

```
faber mod update <id>
faber mod update --all --check
faber mod uninstall <id>
```

`--check` changes nothing and reports what would change and any new capabilities.
