import { test, expect, stub, fire } from 'faber/testing';

type Fired = Awaited<ReturnType<typeof fire>>;

const usage = (percent?: number, chatId = 'c1'): { name: string; chatId: string; usage: { [key: string]: number } } => ({ name: 'usage', chatId, usage: percent == null ? {} : { percent } });

const call = (r: Fired, method: string) => r.calls.find((c) => c.method === method);

const tone = async (percent: number) => call(await fire(usage(percent)), 'ui.band')?.args.tree.children[0].props.tone;

test('shows the percent in the status bar and the band', async () => {
  const r = await fire(usage(42.4));
  expect(call(r, 'ui.status')?.args).toEqual({ id: 'ctx', text: 'ctx 42%', chat: 'c1' });
  expect(call(r, 'ui.band')?.args.zone).toBe('right');
  expect(call(r, 'ui.band')?.args.chat).toBe('c1');
  expect(call(r, 'store.set')?.args).toEqual({ key: 'percent', value: 42.4 });
});

test('does nothing without a reading', async () => {
  expect((await fire(usage())).calls).toEqual([]);
});

test('turns amber and then red with the defaults', async () => {
  expect([await tone(60), await tone(70), await tone(90)]).toEqual(['muted', 'warn', 'err']);
});

test('thresholds follow the config', { config: { warnAt: 50, dangerAt: 60 } }, async () => {
  expect([await tone(45), await tone(55), await tone(65)]).toEqual(['muted', 'warn', 'err']);
});

test('a failing stub skips the hook instead of breaking the chain', async () => {
  stub('ui.status', () => { throw new Error('no room'); });
  const r = await fire(usage(10));
  expect(r.errors.length).toBe(1);
  expect(r.errors[0].message).toContain('no room');
});
