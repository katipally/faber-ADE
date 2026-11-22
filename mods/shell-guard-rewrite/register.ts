export function register(on: On) {
  on('tool.call', (e) => e.call.kind === 'shell' && /^\s*npm\s+(install|i)\s*$/.test(String(e.call.input.command)), ($, e, next) =>
    next({ ...e, call: { ...e.call, input: { ...e.call.input, command: 'npm ci' } } }));
}
