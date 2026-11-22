# Faber privacy policy

Effective: November 19, 2026
Developer: Yashwanth Reddy Katipally
Contact: yashwanthreddykatipally@gmail.com

This policy covers Faber for Mac and Faber Companion, the iPhone app that shows and steers the coding agents running on your own Mac. Sections about the iPhone app say so; the Faber for Mac section near the end covers the Mac app.

## The short version

Faber keeps no personal information. It collects anonymous app analytics only, to improve features and to find bugs and crashes. The data is never sold and never used for ads.

- No account, no advertising and no tracking across other companies' apps or websites.
- Usage analytics: opt-in on iPhone (off until you say yes) and on by default on the Mac, where you can turn them off in Settings, Privacy & Sync. If you say yes (iPhone) or leave them on (Mac), the app sends counts and fixed labels about which features you use to the developer's own server. Never your chats, code, files or terminals.
- We cannot see your chats, code, files or terminals. They never go to our server.
- Update checks on the Mac contact GitHub. Crash reports are sent only when you press Send.
- Chats, terminals and approvals between your iPhone and your Mac are end-to-end encrypted.
- Alerts are a short summary of what the agent needs, delivered by Apple through your own private iCloud.

## What the app handles, and where it goes

- Your work (chat messages, approvals, answers, terminal text, file changes, photos you pick, dictated text): sent only to your own Mac, encrypted so that only your iPhone and your Mac can read it. Some of it is cached on your iPhone so screens open quickly. Deleting the app removes the cache.
- Pairing keys: a key pair that identifies your iPhone, and your Mac's public key, are stored in the iPhone Keychain on this device.
- Your iCloud: to find your Mac and open a direct link, the app and Faber for Mac exchange small records in your own private iCloud (CloudKit) database. They hold device names and public keys, short-lived connection offers, and your iPhone's notification token. Fields that describe your work are encrypted. Alerts are saved there too, as a short summary of what the agent needs (for example "Run npm test?") with secret patterns masked and the length capped, so Apple can show them on your iPhone. They expire after a short time and are deleted when you answer. This database belongs to you and is stored by Apple. We have no access to it.
- Direct connection from anywhere: to find a network path, the iPhone and the Mac each ask public STUN servers run by Google and Cloudflare for their public IP address. Those servers see your IP address and nothing else.
- Notifications and Live Activities (optional): by default your Mac saves each alert in your own private iCloud database and Apple delivers it to your iPhone. If you add your own key to Faber for Mac, your Mac sends alerts through the Apple Push Notification service instead, using a push token your iPhone gives Apple. Either way we do not send, receive or store alerts, and an alert is a short redacted summary of what the agent needs. Your Allow, Deny or Reply answer goes back over the direct encrypted link or as an encrypted record in your iCloud. Live Activity updates carry progress status, such as how many agents are running or waiting. They never include your messages, code, file contents or terminal output. Apple handles delivery under its own privacy policy.
- Camera (optional): to scan a pairing code or take a picture to send to your agent. Photos you choose come from the system photo picker, and only the ones you pick are used.
- Microphone (optional): to dictate a message. Speech becomes text on your iPhone using Apple's on-device speech feature. Audio is not recorded, stored or sent.
- Local Network: to find your Mac on your Wi-Fi.

## Optional usage analytics

Faber Companion can send anonymous usage analytics so the developer knows which screens and features get used. It is off until you turn it on. This section describes the iPhone app. The Mac app differs in the ways listed under Faber for Mac.

- Off by default. The app asks once, after you pair a Mac or try the demo. Anything other than Share counts as no. Change it any time in Settings, Privacy.
- Where it goes: the developer's own self-hosted OpenPanel server at https://telemetry.openlive.dev. It is not sold, not used for ads, and not shared with other companies. It does not track you across other companies' apps or websites, and the app does not use App Tracking Transparency.
- What is sent: fixed event names with short fixed labels. An app opened (first time, and once per day of use), a screen was opened, a pairing attempt ended (route and outcome), the notification permission answer, the Live Activity switch changed, an approval was answered (allow, deny or always, and where from), a chat message was sent (never its text), a connection to your Mac failed (a short error code), a setting changed (which one, never its value), an agent turn finished or failed, an agent or tool was used (its name), a preview was opened, a pane was split, a Settings pane was opened, and one last event when you turn sharing off. Every event also carries the app, its version, system version, device type, language and days since first open. Settings, Privacy, What's sent lists all of it.
- What is never sent: prompts and replies, code and file contents, file paths and file names, project, folder and branch names, messages, error text, your name or email, and your IP address or location. The app puts neither in the data it sends.
- Your ID: an anonymous ID links the events from your devices. It is a one way SHA-256 hash of your iCloud user record ID, so your iPhone and your Mac show up as one profile without a login. If iCloud is unavailable, a random ID is used instead. We do not use your name, email, advertising identifier (IDFA), vendor identifier (IDFV) or any hardware identifier.
- No location: the app sends the placeholder address 127.0.0.1 instead of your IP address, and the developer's proxy removes the forwarded-IP headers before the analytics software sees the request, so no IP address or place is stored with your events. Like any internet request, yours passes through Cloudflare, which relays traffic to the server and sees your IP address under Cloudflare's own privacy policy.
- Turn it off: the events waiting on your iPhone and the ID are deleted at once. If you are online, one last event says sharing was turned off. Settings, Privacy also has Reset ID, which starts a new anonymous ID.
- Retention: events are kept on the server for [RETENTION: owner must configure, recommend 24 months], then deleted. Backups of the server are kept for [RETENTION: owner must configure, recommend 30 days], so a deleted event can remain in a backup until then.
- Deletion: copy your Analytics ID from Settings > Privacy and email it to yashwanthreddykatipally@gmail.com. The developer deletes the events and profile filed under that ID from the analytics database by hand, within 30 days. Data that was sent under an ID you already reset can only be found if you send that old ID too.

## Demo mode

The built-in demo uses sample data inside the app. It does not contact your Mac or your iCloud. It sends nothing to any server except the usage analytics above, if you chose to share.

## What we do not do

We do not sell your data, we do not build advertising profiles, we do not use advertising identifiers, and we do not track you across other companies' apps or websites.

## Your choices and deletion

- Unpair a Mac in Settings, then remove the iPhone in Faber on your Mac.
- Turn off notifications or the Live Activity in iOS Settings or in the app.
- Turn usage analytics off in Settings, Privacy, and ask for deletion of what was sent (see above).
- To delete the records in your iCloud, remove the iPhone in Faber on your Mac, or manage iCloud data in iOS Settings. Deleting the app removes keys and cache from the iPhone.

## Children

The app is not directed to children. Usage analytics are off by default and carry no name, email or contact details.

## Faber for Mac

Faber for Mac is a separate app with its own settings. It runs agents and tools on your Mac, and your code, prompts and files stay there.

- Usage analytics: the same kind, sent to the same server and on the same terms as in "Optional usage analytics" above, with these differences. They are on by default, and the first-run setup and Home tell you so. Turn them off in Settings, Privacy & Sync, where What's sent and Reset (the Analytics ID) are too. Turning them off deletes the queued events and the anonymous ID and, if you are online, sends one last anonymous "sharing turned off" event. Nothing is sent after that. You can also set `FABER_TELEMETRY=off` or `DO_NOT_TRACK=1` in the environment Faber starts in, which keeps analytics off from launch; an unrecognized value counts as off.
- Update checks: Faber uses Sparkle to look for updates once a day, except in Low Power Mode. This reads the update feed at https://raw.githubusercontent.com/katipally/faber-ADE/main/appcast.xml and, when you accept an update, downloads it from the Releases page of https://github.com/katipally/faber-ADE. GitHub sees your IP address and the request, as with any web request, under GitHub's own privacy statement. Faber sends no system profile with the check. Turn off Check automatically in Settings, Advanced to stop the daily check; Check Now still contacts GitHub when you press it. Update checks are separate from analytics and are not controlled by the analytics switch.
- Crash reports: after a crash, the next launch shows you the redacted report. Nothing is sent unless you press Send. Your home folder, account name and email addresses are removed first and the text is cut to a size limit. Send posts the report over HTTPS, with a random install ID that is not linked to your account, to a function on Supabase run by the developer, which emails it to the developer through Resend. The function does not store the report; it exists only as that email. To limit abuse, the function keeps a per-day count of reports per install ID for 7 days, never the report text. If sending fails, Faber opens a Mail draft to the developer instead. The last ten reports you sent are kept on your Mac in telemetry/crashes.jsonl. You can stop the offer with Don't ask about crashes in the report sheet; Settings, Advanced, Reset confirmations turns it back on.
- Your agents: the agents you run (for example Claude Code, Codex or Gemini CLI) talk to their own providers under their own terms and privacy policies. Faber does not see or proxy that traffic.
- Built-in browser: pages you open load directly from their sites. Faber does not route them through the developer's server.
- iPhone companion: Faber for Mac pairs with Faber Companion through your own iCloud and, if you add your own Apple push key in Settings, Companion, sends alerts to your iPhone through the Apple Push Notification service. The iPhone sections above describe this in full.
- Local files: settings, workspace state, schedules and logs are stored in `~/.faber` on your Mac. Nothing in that folder is uploaded.

## International users

Faber is used worldwide. The analytics server is run by the developer in the United States, so the usage analytics you choose to share are processed and stored there, whatever country you are in, and pass through Cloudflare on the way. A crash report you press Send on is handled by Supabase and Resend, who run their own data centers. If you are in the European Economic Area, the United Kingdom or a similar region, you may ask for access to, a copy of, or deletion of the analytics data filed under your Analytics ID, and you may withdraw consent by turning analytics off in Settings, Privacy. Email yashwanthreddykatipally@gmail.com with your Analytics ID. You may also complain to your local data protection authority.

## Changes

If this policy changes, the date above changes and the release notes say what changed.

## Contact

Questions about privacy: yashwanthreddykatipally@gmail.com
