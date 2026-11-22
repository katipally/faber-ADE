import { test, expect, stub, fire } from 'faber/testing';

type Fired = Awaited<ReturnType<typeof fire>>;

const surfaces = (r: Fired) => r.calls.filter((c) => c.method === 'look.surface').map((c) => [c.args.name, c.args.style]);
const turn = (name: string, chatId = 'c1') => ({ name, chatId, provider: 'claude', reason: 'done' });
const style = { opacity: 0.25, blur: 'thick' };

test('a turn dims the sidebar, inspector and header', async () => {
  expect(surfaces(await fire(turn('turn.start')))).toEqual([['sidebar', style], ['inspector', style], ['header', style]]);
});

test('the end of the turn restores all three', async () => {
  await fire(turn('turn.start'));
  expect(surfaces(await fire(turn('turn.complete')))).toEqual([['sidebar', null], ['inspector', null], ['header', null]]);
});

test('the panes stay dim until the last running chat ends', async () => {
  await fire(turn('turn.start', 'c1'));
  await fire(turn('turn.start', 'c2'));
  expect(surfaces(await fire(turn('turn.complete', 'c1')))).toEqual([]);
  expect(surfaces(await fire(turn('turn.complete', 'c2'))).length).toBe(3);
});

test('the command turns dimming off, restoring a running turn at once', async () => {
  await fire(turn('turn.start'));
  const off = await fire({ name: 'command.run', command: 'focus-dim', args: '', chat: 'c1', chatId: 'c1' });
  expect(off.answer).toEqual({ text: 'Focus dim off' });
  expect(surfaces(off).map(([, s]) => s)).toEqual([null, null, null]);
  expect(surfaces(await fire(turn('turn.start')))).toEqual([]);
});

test('the command turns it back on, dimming a running turn', async () => {
  await fire({ name: 'command.run', command: 'focus-dim', args: '', chat: 'c1', chatId: 'c1' });
  await fire(turn('turn.start'));
  const on = await fire({ name: 'command.run', command: 'focus-dim', args: '', chat: 'c1', chatId: 'c1' });
  expect(on.answer).toEqual({ text: 'Focus dim on' });
  expect(surfaces(on).length).toBe(3);
});

test('a refused look is logged, not fatal', async () => {
  stub('look.surface', () => { throw new Error('contrast'); });
  const r = await fire(turn('turn.start'));
  expect(r.errors).toEqual([]);
  expect(r.calls.some((c) => c.method === 'log.warn')).toBe(true);
});

test('the key registers while the mod loads and toggles like the command', async () => {
  const pressed = await fire({ name: 'key.press', id: 'toggle', key: 'ctrl+shift+f', chatId: 'c1' });
  expect(pressed.answer).toEqual({ text: 'Focus dim off' });
});
