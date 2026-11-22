const skip = new Set(['node_modules', '.git', '.build', 'build', 'dist', 'DerivedData', 'Pods', 'vendor']);
const source = /\.(swift|ts|tsx|js|jsx|py|rb|go|rs|java|kt|c|h|m|mm|cpp|hpp|cs|sh|md)$/;
const marker = /\b(TODO|FIXME)\b/;
const limits = { files: 300, depth: 6, listed: 20, ms: 8000 };

type Hit = { at: string; text: string };

/** Breadth first through the folder, reading at most `limits.files` source files and stopping at the time budget. */
async function scan($: Dollar, root: string) {
  const hits: Hit[] = [];
  const counts = { TODO: 0, FIXME: 0 };
  const started = Date.now();
  let files = 0;
  let cut = false;
  const queue: [string, number][] = [[root, 0]];
  while (queue.length) {
    const [dir, depth] = queue.shift()!;
    let names: string[];
    try { names = await $.fs.list(dir); } catch { continue; }
    for (const name of names) {
      const path = dir === '.' ? name : `${dir}/${name}`;
      if (name.endsWith('/')) {
        if (depth < limits.depth && !skip.has(name.slice(0, -1))) queue.push([path.slice(0, -1), depth + 1]);
        continue;
      }
      if (!source.test(name)) continue;
      if (files >= limits.files || Date.now() - started > limits.ms) { cut = true; continue; }
      files++;
      let body: string;
      try { body = await $.fs.read(path); } catch { continue; }
      body.split('\n').forEach((line, i) => {
        const found = marker.exec(line);
        if (!found) return;
        counts[found[1] as 'TODO' | 'FIXME']++;
        if (hits.length < limits.listed) hits.push({ at: `${path}:${i + 1}`, text: line.trim().slice(0, 120) });
      });
    }
  }
  return { total: counts.TODO + counts.FIXME, ...counts, filesScanned: files, truncated: cut, first: hits };
}

export function register(on: On, _options: Options, $: Dollar) {
  $.tool.register({
    name: 'todo_count',
    description: `Counts TODO and FIXME comments in the open project and lists the first ${limits.listed}. Reads at most ${limits.files} source files, skipping node_modules, build output and .git.`,
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Folder to scan, relative to the project. Defaults to the project root.' } },
    },
    readOnly: true,
  });

  on('tool.run', { tool: 'todo_count' }, async ($, e): Promise<ToolJson | ToolError> => {
    const path = typeof e.input.path === 'string' && e.input.path ? e.input.path.replace(/\/+$/, '') : '.';
    try {
      return { json: await scan($, path) };
    } catch (err) {
      return { error: `Could not scan ${path}: ${err instanceof Error ? err.message : String(err)}` };
    }
  });
}
