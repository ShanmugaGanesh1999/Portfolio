// Start fetching immediately; keep early output buffered for the loading animation.
export function streamOutput(produce, onText, { signal, delay, animate = true }) {
  return new Promise((resolve, reject) => {
    let received = '';
    let shown = 0;
    let finished = false;
    let settled = false;
    let timer;
    const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort); };
    const fail = (error) => { settled = true; cleanup(); reject(error); };
    const abort = () => fail(new DOMException('Interrupted', 'AbortError'));
    if (signal?.aborted) { abort(); return; }
    signal?.addEventListener('abort', abort, { once: true });
    function flush() {
      if (settled) return;
      const previous = shown;
      const rest = received.slice(shown);
      if (animate) shown += (rest.match(/\s*\S+\s*/g) || [rest]).slice(0, 5).join('').length;
      else if (finished) shown = received.length;
      if (shown !== previous) onText(received.slice(0, shown));
      if (finished && shown === received.length) {
        settled = true; cleanup(); resolve(received);
      } else timer = setTimeout(flush, 55);
    }
    timer = setTimeout(flush, delay);
    Promise.resolve().then(() => { if (!settled) return produce((chunk) => { if (!settled) received += chunk; }); })
      .then(() => { finished = true; }, fail);
  });
}
