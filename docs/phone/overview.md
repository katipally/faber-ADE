---
title: iPhone companion
description: Watch, approve and steer the agents on your Mac from your iPhone.
---
Faber Companion shows and steers the coding agents running on your own Mac. The agents keep running on the Mac. The phone is a remote.

## What you need

- Faber for Mac, running.
- An iPhone on iOS 27 or later and an iCloud account. For the easiest pairing, the same Apple Account on both.

## How it connects

The phone takes the first path that works:

1. Nearby: same Wi-Fi as the Mac, found over Bonjour. Fastest, live terminal.
2. Direct: from anywhere, opened by Faber on its own. It uses your private iCloud for the first handshake and public STUN servers to find a route, then an encrypted QUIC stream.
3. Tailscale, optional, for the few networks Direct cannot cross.

Chats, terminals and approvals between the phone and Mac are end-to-end encrypted. Faber has no server in the middle.

## No Mac handy?

Tap Try the demo to explore the app with sample data. Nothing reaches a real Mac or iCloud.

Next: [pairing](pairing.html), [features](features.html), [privacy](../features/privacy-and-telemetry.html).
