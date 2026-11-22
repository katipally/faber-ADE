# merge-fireworks

Plays fireworks over the window when a watched pull request merges.
`$.look.effect({ kind, colors?, durationMs? })` draws a one-shot `fireworks` or `confetti` animation, up to 4 seconds, in the given `#rrggbb` colors or a festive default.
It resolves `false` instead of playing when the mod asked less than 5 seconds ago, when Reduce Motion is on or when the Mac is in Low Power Mode.
Needs `look`.

To see it without a merged pull request, run `faber theme burst` (or `faber theme burst confetti`), or call the `theme_burst` tool. It plays the same burst through the same path, and the same Reduce Motion and Low Power Mode rules apply.
