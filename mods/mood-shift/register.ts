type Mood = 'busy' | 'shell' | 'error';

const moods: Record<Mood, { surface: SurfacePatch; status: string }> = {
  busy: { surface: { opacity: 0.08, tint: '#2a0a4a' }, status: 'mood: focused' },
  shell: { surface: { opacity: 0.12, tint: '#ff2e93' }, status: 'mood: hacking' },
  error: { surface: { opacity: 0.12, tint: '#ff3b5c' }, status: 'mood: rough' },
};

const running = (ids: string[], chatId: string) => ids.filter((id) => id !== chatId);

export function register(on: On) {
  const shift = async ($: Dollar, chatId: string, mood: Mood) => {
    if ($.state.get<Mood>(`mood:${chatId}`) === mood) return;
    $.state.set(`mood:${chatId}`, mood);
    await $.look.surface('chat', moods[mood].surface).catch((error) => $.log.warn(`look refused: ${error}`));
    await $.ui.status({ id: 'mood', text: moods[mood].status });
  };

  on('session.start', async ($) => {
    try {
      await $.look.preset('synthwave-sunset');
    } catch (error) {
      await $.log.warn(`preset refused: ${error}`);
    }
  });
  on('turn.start', async ($, e) => {
    $.state.set('active', [...running($.state.get<string[]>('active') ?? [], e.chatId), e.chatId]);
    await shift($, e.chatId, 'busy');
  });
  on('tool.call', async ($, e) => {
    if (e.call.kind === 'shell') await shift($, e.chatId, 'shell');
  });
  on('tool.result', async ($, e) => {
    if (e.isError) await shift($, e.chatId, 'error');
    else if ($.state.get<Mood>(`mood:${e.chatId}`) === 'shell') await shift($, e.chatId, 'busy');
  });
  on('turn.complete', async ($, e) => {
    const left = running($.state.get<string[]>('active') ?? [], e.chatId);
    $.state.set('active', left);
    $.state.set(`mood:${e.chatId}`, null);
    await $.ui.status({ id: 'mood', text: e.reason === 'error' ? 'mood: shaken' : 'mood: calm' });
    if (left.length === 0) await $.look.surface('chat', null).catch((error) => $.log.warn(`look refused: ${error}`));
  });
  on('pr.merged', async ($) => {
    await $.look.effect({ kind: 'fireworks' }).catch((error) => $.log.warn(`effect refused: ${error}`));
  });
}
