import { test, expect, stub, fire } from 'faber/testing';

type Fired = Awaited<ReturnType<typeof fire>>;

const shell = (command: string, cwd = '/work/app') => ({
  name: 'tool.call',
  call: { id: 't1', provider: 'claude', tool: 'Bash', kind: 'shell', input: { command }, primary: command, cwd },
});

const files = (count: number, size: number) => ({
  entries: Array.from({ length: count }, (_, i) => ({ path: `file${i}.txt`, size, kind: 'file' })),
  truncated: false,
  totalSize: count * size,
});

const methods = (r: Fired) => r.calls.map((c) => c.method);

test('denies a delete of the filesystem root and says so in a toast and a band', async () => {
  const r = await fire(shell('ls && rm -rf /'));
  expect(r.answer.deny).toContain('would wipe the filesystem root or home folder');
  expect(methods(r)).toContain('ui.toast');
  expect(methods(r)).toContain('ui.band');
  expect(methods(r)).not.toContain('fs.walk');
});

test('denies a delete of the home folder', async () => {
  expect((await fire(shell('rm -rf ~'))).answer.deny).toBeTruthy();
});

test('lets deletes that are not recursive, and other commands, pass', async () => {
  for (const command of ['rm file.txt', 'ls ~', 'echo hi']) expect((await fire(shell(command))).answer).toBeNull();
});

test('holds a recursive delete in the worktree with the count and size from fs.walk', async () => {
  stub('fs.walk', files(25, 2048));
  const r = await fire(shell('rm -rf build'));
  expect(r.answer.ask).toBe('Blast Radius · rm -rf: Would delete 25 files (50 KB)');
  expect(r.calls.filter((c) => c.method === 'fs.walk').length).toBe(1);
  expect(r.calls.find((c) => c.method === 'fs.walk')?.args.path).toBe('build');
});

test('offers Proceed and Cancel on the card, and only Proceed lets the delete run', async () => {
  stub('fs.walk', files(3, 10));
  const { choices } = (await fire(shell('rm -rf build'))).answer;
  expect(choices.map((c: { label: string }) => c.label)).toEqual(['Proceed', 'Cancel']);
  expect(choices.map((c: { proceed?: boolean }) => c.proceed === true)).toEqual([true, false]);
});

test('says it cannot inspect a path outside the worktree and never walks it', async () => {
  const r = await fire(shell('rm -rf ../elsewhere'));
  expect(r.answer.ask).toContain('Outside workspace, cannot inspect');
  expect(methods(r)).not.toContain('fs.walk');
});

test('still holds the delete when the walk fails', async () => {
  stub('fs.walk', () => { throw new Error('unreadable'); });
  expect((await fire(shell('rm -rf build'))).answer.ask).toContain('Cannot inspect');
});

test('finds a delete anywhere in a compound line', async () => {
  stub('fs.walk', files(1, 1));
  const lines = [
    'ls -ld . && mkdir x && cd x && ls && rm -rf x',
    'cd build; rm -rf out',
    'false || rm -rf out',
    'echo done | rm -rf out',
    '(cd build && rm -rf out)',
    'echo $(rm -rf out)',
    'echo `rm -rf out`',
    'sudo rm -rf out',
    '/bin/rm -rf out',
    'sh -c "ls && rm -rf out"',
    'ls\nrm -rf out',
    'rm -r -f out',
    'rm --recursive out',
  ];
  const missed: string[] = [];
  for (const line of lines) if (!(await fire(shell(line))).answer?.ask) missed.push(line);
  expect(missed).toEqual([]);
});

test('holds xargs rm, find -delete, find -exec rm and git clean, and lists what they touch', async () => {
  stub('fs.walk', files(1, 1));
  const xargs = await fire(shell('ls build | xargs rm -rf'));
  expect(xargs.answer.ask).toContain('Cannot inspect');
  expect(methods(xargs)).not.toContain('fs.walk');
  expect((await fire(shell('find build -name "*.o" -delete'))).calls.find((c) => c.method === 'fs.walk')?.args.path).toBe('build');
  expect((await fire(shell('find . -type d -exec rm -rf {} +'))).calls.find((c) => c.method === 'fs.walk')?.args.path).toBe('.');
  expect((await fire(shell('find out -name x -exec rm -rf {} \\;'))).calls.find((c) => c.method === 'fs.walk')?.args.path).toBe('out');
  expect((await fire(shell('git clean -fdx'))).answer.ask).toContain('Blast Radius');
  expect((await fire(shell('git clean --force -d'))).answer.ask).toContain('Blast Radius');
});

test('denies a wipe of root inside a compound line, a find or a pipe', async () => {
  const allowed: string[] = [];
  for (const line of ['cd x && rm -rf /', 'find / -delete', 'ls | xargs rm -rf ~', 'true; rm -rf $HOME']) if (!(await fire(shell(line))).answer?.deny) allowed.push(line);
  expect(allowed).toEqual([]);
});

test('lets compound lines without a recursive delete pass', async () => {
  const held: string[] = [];
  for (const line of ['ls && rm file.txt', 'git clean -n', 'git clean -fdn', 'find . -name x | xargs rm', 'mkdir x && cd x && ls', 'git status; git diff | head']) if ((await fire(shell(line))).answer) held.push(line);
  expect(held).toEqual([]);
});

test('judges a permission request the same way', async () => {
  stub('fs.walk', files(2, 1024));
  const r = await fire({ name: 'permission.request', canAlways: false, call: shell('rm -rf build').call });
  expect(r.answer.ask).toContain('Would delete 2 files');
});
