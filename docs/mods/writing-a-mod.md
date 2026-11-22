---
title: Writing a mod
description: Mod layout, mod.json, testing and validating.
---
## Create

```
faber mod new <id>
faber mod validate <id>
faber mod test <id>
```

Your agent can do this too: Faber gives agents a `faber-mods` skill.

## Layout

```
mods/<id>/
  mod.json          manifest
  register.ts       entry, exports register(on, options); .tsx works too
  README.md         what it does, what it needs and why
  LICENSE           your license for the mod
  register.test.ts  optional tests
```

Only `.ts`, `.tsx`, `.js` and `.json` files are loaded, 2 MB in all. The folder name must equal the manifest `id`.

## mod.json

```json
{
  "id": "blast-radius",
  "version": "1.0.0",
  "description": "Blocks recursive deletes outside the worktree",
  "requires": ["tool.gate", "ui.toast"],
  "agents": ["claude", "codex"],
  "author": "Your Name",
  "license": "MIT",
  "minFaberVersion": "1.0"
}
```

`requires` must list every capability the code uses; Faber refuses a mod that uses one it did not declare. Secrets in `config` use `type: "secret"` and stay in the user's Keychain.

## Test

A `*.test.ts` file beside the code imports from `faber/testing`:

```ts
import { test, expect, stub, fire } from 'faber/testing';
```

`fire` sends an event to the mod, `stub` answers `$` calls, and `expect` has the usual matchers. `faber mod validate` reports capabilities the code needs that `requires` lacks.

## Debug

`faber mod logs <id>` reads one log file per mod, rotated at 1 MB.

The full reference is in the Faber app under Mods and in the `faber-mods` skill.
