const CLEAR_BELOW = 40;
const SHOWERS_BELOW = 70;
const TURNS = 12;

interface Tier { label: string; tone: Tone; color: string; icon: string }
interface Reading { used: number; limit?: number; percent?: number; turns: number[] }

const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">${body}</svg>`;
const cloud = (color: string) => `<path d="M4.5 11.5a3 3 0 0 1-.3-5.98A4 4 0 0 1 11.9 6 2.8 2.8 0 0 1 11.5 11.5Z" fill="${color}"/>`;

const CLEAR: Tier = { label: 'Clear', tone: 'ok', color: '#F2B134', icon: svg('<circle cx="8" cy="8" r="3.2" fill="#F2B134"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="#F2B134" stroke-width="1.4" stroke-linecap="round"/>') };
const SHOWERS: Tier = { label: 'Showers', tone: 'warn', color: '#5B9BD5', icon: svg(`${cloud('#5B9BD5')}<path d="M5.5 13l-.7 1.6M8.5 13l-.7 1.6M11.5 13l-.7 1.6" stroke="#5B9BD5" stroke-width="1.3" stroke-linecap="round"/>`) };
const STORM: Tier = { label: 'Storm', tone: 'err', color: '#E5534B', icon: svg(`${cloud('#E5534B')}<path d="M8.6 9.5 6.8 12.2h1.9l-.8 2.6 2.4-3.2H8.4Z" fill="#FFF3C4"/>`) };
const UNKNOWN: Tier = { label: 'Context', tone: 'muted', color: '#8A8F98', icon: svg(cloud('#8A8F98')) };

const tierFor = (percent: number | undefined): Tier => (percent == null ? UNKNOWN : percent < CLEAR_BELOW ? CLEAR : percent < SHOWERS_BELOW ? SHOWERS : STORM);

const compact = (n: number) => {
  const [value, unit] = n >= 1e6 ? [n / 1e6, 'M'] : n >= 1e3 ? [n / 1e3, 'k'] : [n, ''];
  return (unit && value < 100 ? value.toFixed(1).replace(/\.0$/, '') : String(Math.round(value))) + unit;
};

/** Context used after each turn, scaled to the window when it is known, else to the largest turn. */
const sparkline = (turns: number[], limit: number | undefined, color: string) => {
  const [w, h, pad] = [60, 14, 2];
  const ceiling = limit ?? Math.max(...turns, 1);
  const step = (w - 2 * pad) / (turns.length - 1);
  const points = turns.map((used, i) => [pad + i * step, h - pad - Math.min(used / ceiling, 1) * (h - 2 * pad)].map((n) => n.toFixed(1)));
  const [x, y] = points[points.length - 1];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${points.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="1.8" fill="${color}"/></svg>`;
};

const key = (e: ChatScoped) => `chat:${e.chatId}`;

async function show($: Dollar, reading: Reading | undefined) {
  if (!reading) return $.ui.clearBand();
  const { used, limit, percent, turns } = reading;
  const tier = tierFor(percent);
  const growth = turns.length > 1 ? turns[turns.length - 1] - turns[turns.length - 2] : 0;
  return $.ui.band({
    zone: 'lead',
    tree: (
      <Box axis="row" gap="md" align="center" padding={{ x: 10, y: 4 }} radius={10} background={`${tier.color}1f`} borderColor={`${tier.color}66`}>
        <Box axis="row" gap="sm" align="center">
          <Svg svg={tier.icon} />
          <Text text={tier.label} tone={tier.tone} size="caption" weight="semibold" />
        </Box>
        {percent != null && <Text text={`${Math.round(percent)}% of context`} tone="secondary" size="caption" />}
        <Text text={limit ? `${compact(used)} / ${compact(limit)}` : `${compact(used)} tokens`} tone="muted" size="caption" mono />
        {turns.length > 1 && <Svg svg={sparkline(turns, limit, tier.color)} />}
        {growth !== 0 && <Text text={`${growth > 0 ? '▲ +' : '▼ -'}${compact(Math.abs(growth))} last turn`} tone={growth > 0 ? tier.tone : 'ok'} size="caption" />}
      </Box>
    ),
  });
}

const waiting = ($: Dollar) => $.ui.band({
  zone: 'lead',
  global: true,
  tree: (
    <Box axis="row" gap="sm" align="center">
      <Svg svg={UNKNOWN.icon} />
      <Text text={UNKNOWN.label} tone={UNKNOWN.tone} size="caption" weight="semibold" />
      <Text text="waiting for the first turn" tone="muted" size="caption" />
    </Box>
  ),
});

export function register(on: On, _options: unknown, $: Dollar) {
  // A global tile shows in every chat, open ones included; a chat's own tile in the same zone replaces it there, and returns it when the session ends.
  waiting($).catch((error) => $.log.warn(`waiting tile refused: ${error}`));
  // Usage arrives several times a turn; the turn's final reading is the one kept for the sparkline.
  on('usage', async ($, e) => {
    const { contextUsed: used, contextLimit: limit, percent } = e.usage;
    if (used == null) return;
    const turns = $.state.get<Reading>(key(e))?.turns ?? [];
    const reading = { used, limit, percent, turns };
    $.state.set(key(e), reading);
    await show($, reading);
  });
  on('turn.complete', async ($, e) => {
    const reading = $.state.get<Reading>(key(e));
    if (!reading) return;
    const next = { ...reading, turns: [...reading.turns, reading.used].slice(-TURNS) };
    $.state.set(key(e), next);
    await show($, next);
  });
  on('session.end', async ($, e) => {
    $.state.set(key(e), undefined);
    await show($, undefined);
  });
}
