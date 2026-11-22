# shell-guard-rewrite

Turns a bare `npm install` (or `npm i`) into `npm ci` so agents install exactly what the lockfile says.
Installs that add a package are left alone. Needs a `package-lock.json`, or `npm ci` fails.
Rewrites work on Claude, and on Codex when its hook is trusted. Other providers never offer the call for rewriting.
Needs `tool.rewrite`.
