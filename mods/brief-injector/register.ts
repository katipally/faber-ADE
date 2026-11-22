export function register(on: On, options: Options<{ brief: string }>) {
  const brief = options.brief?.trim();
  if (!brief) return;
  on('prompt.submit', () => ({ context: `Project brief:\n${brief}` }));
}
