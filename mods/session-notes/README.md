# session-notes

A pane in the inspector, beside Faber's own tabs, that keeps short notes for each chat. Run `/notes` to open it.

It shows how a pane works:

- `$.ui.open` opens the pane. The pane is drawn on demand: Faber sends `ui.render` with `component: 'Pane'` and the mod answers with a tree.
- The notes are an atom. The `ui.render` hook reads it with `read`, and each `update` from a handler draws the pane again by itself, with no `$.ui.invalidate`.
- Each change is also written to `$.store`, so the notes survive a restart.
- The `Input` is multiline (`rows={4}`) and its `key` changes with the note count, which empties the field after a note is added.

Needs `ui.pane` and `command.register`.
