import { test, expect, stub, fire } from 'faber/testing';

type Fired = Awaited<ReturnType<typeof fire>>;

const calls = (r: Fired, method: string) => r.calls.filter((c) => c.method === method).map((c) => c.args);
const shell = { provider: 'claude', tool: 'Bash', kind: 'shell', input: { command: 'ls' }, cwd: '/w' };
const turn = (name: string, chatId = 'c1') => ({ name, chatId, provider: 'claude', reason: 'done' });

test('loads the synthwave preset', async () => {
  const r = await fire('session.start', { session: { provider: 'claude' } });
  expect(calls(r, 'look.preset')).toEqual(['synthwave-sunset']);
  expect(r.errors).toEqual([]);
});

test('a refused preset is logged, not fatal', async () => {
  stub('look.preset', () => { throw new Error('no such theme'); });
  const r = await fire('session.start', { session: { provider: 'claude' } });
  expect(r.errors).toEqual([]);
  expect(calls(r, 'log.warn')[0]).toContain('no such theme');
});

test('a turn tints the chat and says so in the status', async () => {
  const r = await fire(turn('turn.start'));
  expect(calls(r, 'look.surface')).toEqual([{ name: 'chat', style: { opacity: 0.08, tint: '#2a0a4a' } }]);
  expect(calls(r, 'ui.status')).toEqual([{ id: 'mood', text: 'mood: focused', chat: 'c1' }]);
});

test('a shell call flashes pink and the next good result goes back', async () => {
  await fire(turn('turn.start'));
  const hit = await fire({ name: 'tool.call', chatId: 'c1', call: shell });
  expect(calls(hit, 'look.surface')[0].style.tint).toBe('#ff2e93');
  const back = await fire({ name: 'tool.result', chatId: 'c1', call: shell, isError: false });
  expect(calls(back, 'look.surface')[0].style.tint).toBe('#2a0a4a');
});

test('a file read does not change the look', async () => {
  await fire(turn('turn.start'));
  const read = await fire({ name: 'tool.call', chatId: 'c1', call: { ...shell, tool: 'Read', kind: 'read' } });
  expect(calls(read, 'look.surface')).toEqual([]);
});

test('an error turns red and the same mood is not sent twice', async () => {
  await fire(turn('turn.start'));
  const bad = await fire({ name: 'tool.result', chatId: 'c1', call: shell, isError: true });
  expect(calls(bad, 'look.surface')[0].style.tint).toBe('#ff3b5c');
  const again = await fire({ name: 'tool.result', chatId: 'c1', call: shell, isError: true });
  expect(again.calls.length).toBe(0);
});

test('the turn end removes the chat tweak, tint included, so the preset shows again', async () => {
  await fire('session.start', { session: { provider: 'claude' } });
  await fire(turn('turn.start'));
  const r = await fire(turn('turn.complete'));
  expect(calls(r, 'look.surface')).toEqual([{ name: 'chat', style: null }]);
  expect(calls(r, 'ui.status')[0].text).toBe('mood: calm');
});

test('the look stays while another chat still runs', async () => {
  await fire(turn('turn.start', 'c1'));
  await fire(turn('turn.start', 'c2'));
  expect(calls(await fire(turn('turn.complete', 'c1')), 'look.surface')).toEqual([]);
  expect(calls(await fire(turn('turn.complete', 'c2')), 'look.surface').length).toBe(1);
});

test('a merged pull request sets off fireworks', async () => {
  const r = await fire('pr.merged', { repo: 'acme/app', number: 7, title: 'Ship it', workspace: '/w' });
  expect(calls(r, 'look.effect')).toEqual([{ kind: 'fireworks' }]);
});
