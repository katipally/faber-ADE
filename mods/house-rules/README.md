# house-rules

Adds the `rules` setting to the system prompt of every new session as a `House rules` section. Empty rules, no hook.
Claude gets it through `--append-system-prompt` and Codex through its developer instructions, both next to Faber's own hint.
Gemini, Copilot, OpenCode and Pi have no system prompt Faber can set, so a new conversation carries the section in front of its first message instead.
A change applies to sessions started after it. Needs `prompt.compose`.
