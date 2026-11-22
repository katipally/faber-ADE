const LONG = 40;

export function register(on: On) {
  // `<Default />` is Faber's own row, so this adds the badge and keeps everything else.
  on('ui.render', { component: 'ToolUse', tool: 'Bash' }, ($, e) => (
    <Box axis="row" gap="sm" align="center">
      <Text size="caption" weight="semibold" mono tone={e.props.isErrored ? 'err' : e.props.isRunning ? 'info' : 'ok'}>
        {e.props.isErrored ? 'FAIL' : e.props.isRunning ? 'RUN' : 'SH'}
      </Text>
      <Default />
    </Box>
  ));

  // No `<Default />`, so this replaces the output; the row offers "Show original".
  on('ui.render', { component: 'ToolResult' }, ($, e, next) => {
    const lines = e.props.output.split('\n').length;
    if (lines <= LONG) return next(e);
    return <Text size="caption" tone="muted" mono>{`${lines} lines of output, folded`}</Text>;
  });
}
