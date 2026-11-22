# context-meter

Shows `ctx 26%` in the status bar and a band tile with a `Meter` whenever the provider reports context use, and keeps the latest value in the mod store.
The tile turns warn above 65% and err above 85%.
Providers that report no context limit (Pi, sometimes OpenCode) show nothing instead of a wrong number.
Needs `usage`, `ui.status` and `ui.band`.
