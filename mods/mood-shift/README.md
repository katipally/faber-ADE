# mood-shift

Loads the bundled `synthwave-sunset` look with `$.look.preset`, then moves the chat surface with the agent.

- `turn.start`: the chat gets more see-through and a purple tint, status `mood: focused`.
- `tool.call` on a shell command: a pink tint, `mood: hacking`. The next good `tool.result` brings the purple back.
- `tool.result` with `isError`: a red tint, `mood: rough`.
- `turn.complete`: the chat tweak is removed with `$.look.surface('chat', null)`, tint included, so the preset's own chat surface shows again once no chat is still running.
- `pr.merged`: `$.look.effect({ kind: 'fireworks' })`.

Needs `look` and `ui.status`. Changes are throttled by only acting when the mood differs, well inside the 10 a second limit of `$.look.surface`.
