const dimmed = ['sidebar', 'inspector', 'header'] as const;

export function register(on: On, _options: unknown, $: Dollar) {
  $.command.register({ name: 'focus-dim', detail: 'Toggle dimming the side panes while the agent works' }).catch(() => {});
  $.keys.register({ id: 'toggle', key: 'ctrl+shift+f', description: 'Toggle focus dim', when: 'global-app' }).catch((error) => $.log.warn(`key refused: ${error}`));

  const dim = (enabled: boolean) =>
    Promise.all(dimmed.map((name) => $.look.surface(name, enabled ? { opacity: 0.25, blur: 'thick' } : null))).catch((error) => $.log.warn(`look refused: ${error}`));

  on('turn.start', async ($, e) => {
    $.state.set('active', [...($.state.get<string[]>('active') ?? []).filter((id) => id !== e.chatId), e.chatId]);
    if ($.state.get<boolean>('off') !== true) await dim(true);
  });
  on('turn.complete', async ($, e) => {
    const left = ($.state.get<string[]>('active') ?? []).filter((id) => id !== e.chatId);
    $.state.set('active', left);
    if (left.length === 0) await dim(false);
  });
  const toggle = async ($: Dollar) => {
    const off = $.state.get<boolean>('off') !== true;
    $.state.set('off', off);
    if (off) await dim(false);
    else if (($.state.get<string[]>('active') ?? []).length > 0) await dim(true);
    return { text: off ? 'Focus dim off' : 'Focus dim on' };
  };
  on('command.run', { command: 'focus-dim' }, toggle);
  on('key.press', { id: 'toggle' }, toggle);
}
