# project-facts

Gives the agent a `todo_count` tool: it counts `TODO` and `FIXME` comments in the open project and lists the first 20.
The agent sees it as `mod_project-facts_todo_count` on Faber's MCP server, so it works on Claude, Codex, Gemini, OpenCode and the other agents Faber gives that server. Pi has no MCP path.

It registers the tool when it loads (`$.tool.register` in `register`), so a reload brings it back with no chat needed, and answers the `tool.run` event with `{ json }`.
It reads through `$.fs.list` and `$.fs.read`, so it stays inside the worktrees and under the read limits, and stops at 300 files or 8 seconds.
Needs `tool.register` and `fs.read`. Faber's "Run mod tools" permission (Settings > Faber Control) decides whether the agent may call it freely, with a question first, or not at all.
