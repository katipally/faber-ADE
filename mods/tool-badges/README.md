# tool-badges

Shows how a mod changes the chat's own rows.

- A `ToolUse` hook matched on `tool: 'Bash'` draws a badge (`SH`, `RUN` or `FAIL`) in front of every shell call. It returns a tree with `<Default />`, which is Faber's own row, so the call looks and works as before.
- A `ToolResult` hook folds output over 40 lines into one line. It returns a tree without `<Default />`, which replaces the output; the row says `mod · tool-badges` and offers "Show original", so nothing the agent printed is hidden.

Needs `ui.transcript`.
