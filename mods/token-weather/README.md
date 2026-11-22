# token-weather

A band above the prompt that shows how full the context window is, as weather.

```
 [sun] Clear    26% of context   52k / 200k   ~~~/\~~   ▲ +12.4k last turn
 [rain] Showers 54% of context  108k / 200k   ~~/‾‾‾    ▲ +88.1k last turn
 [bolt] Storm   81% of context  162k / 200k   ~/‾‾‾‾    ▲ +31k last turn
```

Tiers are named constants at the top of `register.tsx`: Clear below 40%, Showers below 70%, Storm from 70%.
The sparkline is the context used after each of the last 12 turns, per chat. The growth is the last turn's change; a drop (a compaction) shows `▼`.

Each chat gets its own tile: the mod writes it from that chat's `usage` and `turn.complete` events, and the tile goes when the chat's session ends.
A provider that reports no window gets `used tokens` and a neutral cloud instead of a tier. Every chat, open ones included, shows a neutral `waiting for the first turn` tile until a usage event reports context use: it is one global tile drawn at load, and a chat's own tile in the same zone replaces it there.
History is in memory (`$.state`), so a reload starts it over.
Needs `usage` and `ui.band`.
