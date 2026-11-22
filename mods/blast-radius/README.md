# blast-radius

Holds `rm -r` and `rm -rf` (any flag spelling), inside the worktree or not and anywhere in a compound line (`&&`, `;`, a pipe, a subshell, `xargs`, `find -exec`, `sh -c`), plus `find -delete` and `git clean -f`, and shows what it would delete before the person decides.
`rm -rf /` and `rm -rf ~` (also `$HOME` and `/*`) are denied. Every other recursive delete is handed to the agent's own approval card with `{ ask, detail, choices }`: Proceed and Cancel.
The card shows the command, `Would delete N files (X KB)` in red from `$.fs.walk`, the first 20 files and `and K more`, and the paths. A target outside the worktree, a glob or a path it cannot read is not walked: the card says `Outside workspace, cannot inspect` and still asks.
Either way a warning toast shows and a band tile on the right keeps the last held command.
Both `tool.call` and `permission.request` run the same check, and every call asks again. Gate coverage depends on the provider: full on Claude and Codex (Codex shows the ask in the chat's own drawer; no answer in 90 s denies, with the same summary as the reason), and on ACP and OpenCode only for deletes the agent asks about, through `permission.request`.
It also holds the same command when the agent sends it through Faber's own `terminal send`, which a gate sees as a `Bash` call.
Needs `tool.gate`, `fs.read`, `ui.toast` and `ui.band`.

At most 3 targets are walked, and none after 700 ms, so the gate stays inside its deadline; a walk itself stops at 2,000 entries or 500 ms and the summary then says `at least`.
Quotes, backslashes and `${HOME}` are stripped from each argument before it is matched, so these give the verdicts shown:

| Command | Verdict |
|---|---|
| `rm -rf /` , `rm -rf "/"` , `rm -rf '/'` , `rm -rf \/` | deny |
| `rm -rf ~` , `rm -rf "~"` , `rm -rf $HOME` , `rm -rf '$HOME'` , `rm -rf "$HOME"` , `rm -rf "${HOME}"` , `rm -rf "$HOME/"` , `rm -rf /*` | deny |
| `rm -rf build` , `rm -rf "./dist"` , `rm -rf "<cwd>/build"` , `rm -r node_modules` | ask, with the count and size |
| `rm -rf "../other"` , `rm -r '/tmp/x'` , `rm "-rf" /var/cache` , `/bin/rm -fr ~/Documents` | ask, outside workspace, cannot inspect |
| `rm file.txt` | pass |
