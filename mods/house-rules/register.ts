export function register(on: On, options: Options<{ rules: string }>) {
  const rules = options.rules?.trim();
  if (!rules) return;
  on('prompt.compose', () => ({ sections: [{ title: 'House rules', text: rules }] }));
}
