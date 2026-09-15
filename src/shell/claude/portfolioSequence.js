import { randomVerb } from "./verbs.js";

export const loadingDelay = () => 500 + Math.round(Math.random() * 1500);

export const PORTFOLIO_SECTIONS = ['info', 'stats', 'about', 'skills', 'experience', 'projects', 'credentials', 'contact'];

// One timer owns the sequence, so interrupting cannot leave later sections queued.
export function playSections(sections, { intro = false, onCommand, onStatus, onSection, onDone }) {
  let index = 0;
  let timer;
  let cancelled = false;
  function next() {
    if (cancelled) return;
    if (index === sections.length) {
      onDone();
      return;
    }
    const section = sections[index++];
    const halfDelay = loadingDelay() / 2;
    onCommand(`/${section}`);
    onStatus(`${randomVerb()}…`);
    timer = setTimeout(() => {
      onStatus(`Loading ${section}…`);
      timer = setTimeout(() => {
        onSection(section, next);
      }, halfDelay);
    }, halfDelay);
  }
  timer = setTimeout(() => {
    if (intro) {
      onCommand('claude --dangerously-skip-permissions');
      onStatus('executing…');
      timer = setTimeout(next, loadingDelay());
    } else next();
  }, 0);
  return () => { cancelled = true; clearTimeout(timer); };
}
