# focus-dim

While any chat runs a turn, the sidebar, inspector and header go see-through with `$.look.surface`. When the last running turn ends, the surfaces go back (a `null` style takes them out of the mod's layer, so the person's look shows again).

`/focus-dim` toggles it: off keeps the panes as they are, on dims them again if a turn is running. Ctrl+Shift+F does the same from the keyboard, anywhere in Faber (`$.keys.register`, refused if Faber or macOS already uses the key). The command and the key are registered while the mod loads, so a reload brings them back.

Needs `look`, `command.register` and `keys.register`.
