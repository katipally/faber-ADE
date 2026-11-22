export function register(on: On, options: Options<{}, { warnAt: number; dangerAt: number }>) {
  const { warnAt = 65, dangerAt = 85 } = options.config ?? {};
  on('usage', async ($, e) => {
    const percent = e.usage.percent;
    if (percent == null) return;
    const tone = percent > dangerAt ? 'err' : percent > warnAt ? 'warn' : 'muted';
    await $.store.set({ key: 'percent', value: percent });
    await $.ui.status({ id: 'ctx', text: `ctx ${Math.round(percent)}%` });
    await $.ui.band({
      zone: 'right',
      tree: (
        <Box axis="row" gap="sm" align="center" padding={{ x: 10, y: 3 }} radius={12} borderColor="line2">
          <Text text={`ctx ${Math.round(percent)}%`} tone={tone} size="caption" />
          <Meter value={percent / 100} tone={tone} />
        </Box>
      ),
    });
  });
}
