# turn-timer

Shows `turn 0:12` in the chat band while a turn runs, and `took 0:42` when it ends.
`turn.start` starts a one second timer with `$.clock.every`, each `clock.tick` redraws the band, and `turn.complete` cancels the timer.
The timer is the chat's own, so two chats running at once keep two clocks. Ticks pause while Faber is in the background and the next one shows the right time.
Needs `clock` and `ui.band`. Works on every provider.
