import { test, expect, fire, mock } from 'faber/testing';

type Fired = Awaited<ReturnType<typeof fire>>;

const usage = (used: number, percent: number, limit = 200000) => ({ name: 'usage', chatId: 'c1', usage: { contextUsed: used, contextLimit: limit, percent } });
const turnComplete = () => ({ name: 'turn.complete', chatId: 'c1', reason: 'end_turn' });

const texts = (node: any): string[] => (node ? [node.props?.text, ...(node.children ?? []).flatMap(texts)].filter((t): t is string => typeof t === 'string') : []);

const band = (r: Fired) => texts(r.calls.find((c) => c.method === 'ui.band')?.args.tree);

test('names the tier by percent of the window', async () => {
  const tier = async (percent: number) => band(await fire(usage(1000, percent)))[0];
  expect([await tier(10), await tier(50), await tier(90)]).toEqual(['Clear', 'Showers', 'Storm']);
});

test('shows used and limit in a compact form', async () => {
  expect(band(await fire(usage(48500, 24.25)))).toContain('48.5k / 200k');
});

test('a reading without used tokens shows nothing', async () => {
  expect((await fire({ name: 'usage', chatId: 'c1', usage: { percent: 5 } })).calls).toEqual([]);
});

test('keeps a turn per completed turn, so growth shows from the second', async () => {
  await fire(usage(10000, 5));
  expect(band(await fire(turnComplete())).some((t) => t.includes('last turn'))).toBe(false);
  await fire(usage(30000, 15));
  expect(band(await fire(turnComplete()))).toContain('▲ +20k last turn');
});

test('state starts empty in every test, so a turn with no reading draws nothing', async () => {
  expect((await fire(turnComplete())).calls).toEqual([]);
});

test('registers a global waiting tile that every chat shows until its own tile replaces it', async () => {
  await fire(usage(10000, 5));
  const bands = mock.calls('ui.band');
  expect(bands.map((c) => !!c.args.global)).toEqual([true, false]);
  expect(texts(bands[0].args.tree)).toEqual(['Context', 'waiting for the first turn']);
  expect(bands[0].args.zone).toBe(bands[1].args.zone);
});

test('clears the band when the session ends', async () => {
  await fire(usage(10000, 5));
  const r = await fire({ name: 'session.end', chatId: 'c1', session: { provider: 'claude' } });
  expect(r.calls.map((c) => c.method)).toEqual(['ui.clearBand']);
});
