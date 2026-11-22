const tickKey = (chatId: string) => `elapsed:${chatId}`;

const clockText = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const show = ($: Dollar, text: string, tone: 'muted' | 'ok') =>
  $.ui.band({ zone: 'right', tree: <Text text={text} tone={tone} size="caption" mono /> });

export function register(on: On) {
  on('turn.start', async ($, e) => {
    $.state.set(`start:${e.chatId}`, Date.now());
    await show($, 'turn 0:00', 'muted');
    await $.clock.every(1000, tickKey(e.chatId));
  });
  on('clock.tick', async ($, e) => {
    const started = $.state.get<number>(`start:${e.chatId}`);
    if (e.key !== tickKey(e.chatId) || started == null) return;
    await show($, `turn ${clockText(Date.now() - started)}`, 'muted');
  });
  on('turn.complete', async ($, e) => {
    const started = $.state.get<number>(`start:${e.chatId}`);
    await $.clock.cancel(tickKey(e.chatId));
    if (started == null) return;
    $.state.set(`start:${e.chatId}`, null);
    await show($, `took ${clockText(e.durationMs ?? Date.now() - started)}`, 'ok');
  });
  on('session.end', async ($, e) => {
    await $.clock.cancel(tickKey(e.chatId));
    await $.ui.clearBand();
  });
}
