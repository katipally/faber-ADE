import { test, expect, fire } from 'faber/testing';

const row = (component: string, props: Record<string, unknown>) => fire({ name: 'ui.render', component, requestId: 't1', chatId: 'c1', props });
const tree = (answer: unknown) => JSON.stringify(answer);

test('a shell call gets a badge around the default row', async () => {
  const answer = tree((await row('ToolUse', { tool: 'Bash', isRunning: false, isErrored: false })).answer);
  expect(answer).toContain('"SH"');
  expect(answer).toContain('"type":"Default"');
});

test('a failed shell call says so', async () => {
  expect(tree((await row('ToolUse', { tool: 'Bash', isRunning: false, isErrored: true })).answer)).toContain('FAIL');
});

test('other tools are left alone', async () => {
  expect((await row('ToolUse', { tool: 'Read', isRunning: false, isErrored: false })).answer).toBe(null);
});

test('short output is left alone and long output is folded', async () => {
  expect((await row('ToolResult', { output: 'a\nb' })).answer).toBe(null);
  const long = Array.from({ length: 100 }, (_, i) => `line ${i}`).join('\n');
  const answer = tree((await row('ToolResult', { output: long })).answer);
  expect(answer).toContain('100 lines of output, folded');
  expect(answer).not.toContain('"type":"Default"');
});
