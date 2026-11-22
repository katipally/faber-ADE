export function register(on: On) {
  on('pr.merged', async ($) => {
    try {
      await $.look.effect({ kind: 'fireworks' });
    } catch (error) {
      await $.log.warn(`effect refused: ${error}`);
    }
  });
}
