type Notes = Record<string, string[]>;

const PANE = 'notes';
const NO_CHAT = 'none';
const MAX_NOTES = 50;
const MAX_LENGTH = 2_000;

const notes = atom<Notes>('notes', {});

let loading: Promise<void> | undefined;

// The notes live in `$.store`; the atom is what the pane draws from, so every change goes through both.
function load($: Dollar) {
  loading ??= $.store.get('notes').then((saved) => {
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) update($, notes, () => saved as Notes);
  });
  return loading;
}

async function change($: Dollar, chat: string, edit: (list: string[]) => string[]) {
  await load($);
  const all = update($, notes, (all) => ({ ...all, [chat]: edit(all[chat] ?? []) }));
  await $.store.set({ key: 'notes', value: all });
}

export function register(on: On, _options: unknown, $: Dollar) {
  $.command.register({ name: 'notes', detail: 'Show the notes pane' }).catch((error) => $.log.warn(`command refused: ${error}`));

  on('session.start', async ($, e, next) => {
    await load($);
    return next(e);
  });

  on('command.run', { command: 'notes' }, async ($) => {
    await $.ui.open({ id: PANE, title: 'Notes', focus: true });
    return { text: 'Notes pane opened.' };
  });

  on('ui.input', { key: 'add*' }, async ($, e) => {
    const text = e.value.trim().slice(0, MAX_LENGTH);
    if (text) await change($, e.chatId ?? NO_CHAT, (list) => [text, ...list].slice(0, MAX_NOTES));
  });

  on('ui.press', { key: 'rm:*' }, async ($, e) => {
    const index = Number(e.key.slice(3));
    await change($, e.chatId ?? NO_CHAT, (list) => list.filter((_, i) => i !== index));
  });

  on('ui.render', { component: 'Pane', requestId: PANE }, ($, e) => {
    const list = read($, notes)[e.chatId ?? NO_CHAT] ?? [];
    return (
      <Box gap="md" padding={14}>
        {/* A new key empties the field once a note is added. */}
        <Input key={`add:${list.length}`} placeholder="Add a note, then press Return" rows={4} />
        {list.length === 0 && <Text text="No notes for this chat yet." tone="muted" size="caption" />}
        {list.map((text, i) => (
          <Box axis="row" align="start" gap="sm" padding={10} radius={8} border>
            <Box grow>
              <Text text={text} lines={8} />
            </Box>
            <Button key={`rm:${i}`} label="Remove" variant="destructive" />
          </Box>
        ))}
        <Text text={`${list.length} of ${MAX_NOTES}`} tone="muted" size="caption" />
      </Box>
    );
  });
}
