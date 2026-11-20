# Community mods

A mod changes how a Faber chat behaves: gate or rewrite tool calls, add context to prompts, show status, add panes. Each mod in this folder is written and licensed by its author. Faber does not review or endorse them, so read a mod's code and the permissions it asks for before you enable it. Faber shows a consent card with every capability a mod needs and asks again when its code changes.

## Install a mod from here

```
faber mod marketplace add katipally/faber-ADE
faber mod search weather
faber mod install <id>@faber-ADE
```

Or install one folder directly:

```
faber mod install katipally/faber-ADE#main:mods/<id>
```

## Layout

```
mods/<id>/
  mod.json        manifest
  register.ts     entry, exports register(on, options); .tsx works too
  README.md       what it does, what it needs and why
  LICENSE         your license for the mod
  register.test.ts   optional tests for `faber mod test`
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

| Field | Meaning |
|---|---|
| `id` | Lowercase letters, digits and hyphens, up to 64. Unique. |
| `version` | Semver. Bump it for every change. |
| `description` | One line, required. |
| `requires` | Every capability the code uses. Faber refuses a mod that uses one it did not declare. |
| `entry` | Defaults to `register.ts`, then `register.tsx`. |
| `agents` | Optional allowlist of providers. Omitted means all. |
| `config` | Optional values users set on the Mods page. Use `type: "secret"` for keys; they stay in the user's Keychain. |
| `author`, `license`, `repository`, `homepage` | Optional, shown on the consent card. |
| `minFaberVersion` | Optional. An older Faber refuses to install it. |

## Submit a mod

1. Create it with `faber mod new <id>`, then `faber mod validate <id>` and `faber mod test <id>`.
2. Run `faber mod pack <id>`. It scans for keys and tokens and refuses until none are left.
3. Open a pull request that adds `mods/<id>/` and one entry to `.faber/marketplace.json`:

   ```json
   { "id": "<id>", "source": "./mods/<id>", "version": "1.0.0", "description": "One line." }
   ```

4. Say in the README what the mod needs and why.

You can also keep a mod in your own repo and open a pull request that adds only the marketplace entry, with `"source": "you/your-repo"`.

Reviews check that the code runs, matches its manifest and README, and holds no secrets. Mods that send data off the machine (`http.fetch`, `process.run`) must say where in the README.

## Reference

The full mod format, capabilities and `$` API are in the Faber app under Settings, Mods, and in the `faber-mods` skill that Faber gives your agent.
