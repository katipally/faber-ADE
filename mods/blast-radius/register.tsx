const plain = (arg: string) => arg.replace(/\$\{HOME\}/g, () => '$HOME').replace(/["'\\]/g, '');

const outside = (target: string, cwd?: string) =>
  /^(~|\$HOME|\.\.)/.test(target) || (target.startsWith('/') && !(cwd && (target === cwd || target.startsWith(`${cwd}/`))));

const wipesEverything = (target: string) => /^(\/|~|\$HOME)\/?\*?$/.test(target);

const SEPARATORS = /&&|\|\||\$\(|[;|&\n()`]/;
const PLACEHOLDERS = new Set(['{}', '+']);
const PIPED = '(paths from another command)';

const named = (words: string[], name: string) => words.findIndex((w) => w === name || w.endsWith(`/${name}`));

// Each piece of a compound line is read on its own, so a delete counts wherever it sits: after && or ;, in a pipe, a subshell, xargs, find -exec or sh -c.
const deletions = (piece: string): string[] => {
  const words = piece.trim().split(/\s+/).map(plain).filter(Boolean);
  const find = named(words, 'find');
  const roots = () => {
    const given = words.slice(find + 1).findIndex((w) => w.startsWith('-') || w === '!');
    const list = given < 0 ? words.slice(find + 1) : words.slice(find + 1, find + 1 + given);
    return list.length ? list : ['.'];
  };
  if (find >= 0 && words.includes('-delete')) return roots();
  const rm = named(words, 'rm');
  if (rm >= 0) {
    const args = words.slice(rm + 1);
    if (!args.some((a) => /^-[a-zA-Z]*[rR]/.test(a) || a === '--recursive')) return [];
    const paths = args.filter((a) => !a.startsWith('-') && !PLACEHOLDERS.has(a));
    return paths.length ? paths : find >= 0 ? roots() : [PIPED];
  }
  const git = named(words, 'git');
  const clean = git >= 0 && words.slice(git + 1).includes('clean');
  const forced = words.some((w) => /^-[a-zA-Z]*f/.test(w) || w === '--force') && !words.some((w) => /^-[a-zA-Z]*n/.test(w) || w === '--dry-run');
  return clean && forced ? ['(untracked files from git clean)'] : [];
};

const deleted = (command: string) => command.split(SEPARATORS).flatMap(deletions);

const MAX_LISTED = 20;
const MAX_WALKED = 3;
const WALK_BUDGET_MS = 700;

const bytes = (n: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${i === 0 ? n : n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
};

const clip = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max - 1)}…`);

type Inspected = { files: string[]; size: number; truncated: boolean; walked: number; unseen: string[]; outside: boolean };

// Targets past the first few, patterns, and anything outside the worktree are listed as not inspected: a walk is capped at 500 ms and a gate has seconds.
const inspect = async ($: Dollar, targets: string[], cwd?: string): Promise<Inspected> => {
  const found: Inspected = { files: [], size: 0, truncated: false, walked: 0, unseen: [], outside: false };
  const started = Date.now();
  for (const [i, target] of targets.entries()) {
    const away = outside(target, cwd);
    found.outside = found.outside || away;
    const readable = !away && !/[*?[(]/.test(target) && i < MAX_WALKED && Date.now() - started < WALK_BUDGET_MS;
    const walk = readable ? await $.fs.walk(target).catch(() => null) : null;
    if (!walk) { found.unseen.push(target); continue; }
    const base = target.replace(/\/$/, '');
    const itself = walk.entries.length === 1 && base.split('/').pop() === walk.entries[0].path;
    for (const entry of walk.entries) if (entry.kind !== 'dir') found.files.push(clip(itself ? base : `${base}/${entry.path}`, 120));
    found.size += walk.totalSize;
    found.truncated = found.truncated || walk.truncated;
    found.walked++;
  }
  return found;
};

const summary = (found: Inspected) => {
  const { files, size, truncated, walked, unseen, outside: away } = found;
  const counted = `Would delete ${truncated ? 'at least ' : ''}${files.length.toLocaleString('en-US')} ${files.length === 1 ? 'file' : 'files'} (${bytes(size)})`;
  if (!unseen.length) return counted;
  return walked ? `${counted}, plus ${unseen.length} ${unseen.length === 1 ? 'path' : 'paths'} not inspected` : away ? 'Outside workspace, cannot inspect' : 'Cannot inspect (not found, a pattern or unreadable)';
};

const detail = (command: string, targets: string[], found: Inspected, text: string) => (
  <Box gap="sm">
    <Text text={text} tone="err" weight="semibold" />
    {found.files.length > 0 && (
      <Box gap="xs">
        <Divider />
        <Text text="Files" tone="muted" size="caption" />
        {found.files.slice(0, MAX_LISTED).map((file) => <Text text={file} mono size="caption" />)}
        {(found.files.length > MAX_LISTED || found.truncated) && (
          <Text text={`and ${(found.files.length - MAX_LISTED).toLocaleString('en-US')}${found.truncated ? '+' : ''} more`} tone="muted" size="caption" />
        )}
      </Box>
    )}
    <Divider />
    <Text text="Paths" tone="muted" size="caption" />
    {targets.slice(0, MAX_LISTED).map((target) => <Text text={clip(target, 160)} mono size="caption" />)}
  </Box>
);

const guard = async ($: Dollar, e: ToolCallEvent | PermissionRequestEvent): Promise<Deny | Ask | undefined> => {
  const command = e.call.primary ?? String(e.call.input.command ?? e.call.input.cmd ?? '');
  const targets = deleted(command);
  if (!targets.length) return;
  const fatal = targets.some(wipesEverything);
  $.ui.toast({ text: `${fatal ? 'Blocked' : 'Held'}: ${command}`, kind: 'warn' }).catch(() => {});
  $.ui.band({
    zone: 'right',
    tree: (
      <Box axis="row" gap="sm" align="center" padding={{ x: 8, y: 3 }} radius={6} borderColor="warn">
        <Text text={fatal ? 'blocked' : 'held'} tone="warn" size="caption" />
        <Text text={command.slice(0, 48)} mono size="caption" />
      </Box>
    ),
  }).catch(() => {});
  if (fatal) return { deny: `Blast Radius: ${command} would wipe the filesystem root or home folder` };
  const found = await inspect($, targets, e.call.cwd);
  const text = summary(found);
  return {
    ask: `Blast Radius · rm -rf: ${text}`,
    detail: detail(command, targets, found, text),
    choices: [{ label: 'Proceed', proceed: true }, { label: 'Cancel', reason: 'The user cancelled the delete after seeing what it would remove' }],
  };
};

export function register(on: On) {
  on('tool.call', { kind: 'shell' }, guard);
  on('permission.request', { kind: 'shell' }, guard);
}
