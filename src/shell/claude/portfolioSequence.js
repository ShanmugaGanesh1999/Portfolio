export const PORTFOLIO_SECTIONS = ['info', 'stats', 'about', 'skills', 'experience', 'projects', 'credentials', 'contact'];

// One timer owns the sequence, so interrupting cannot leave later sections queued.
export function playSections(sections, { intro = false, onCommand, onStatus, onSection, onDone }) {
  let index = 0;
  let timer;
  function next() {
    if (index === sections.length) {
      onDone();
      return;
    }
    const section = sections[index++];
    const halfDelay = (1000 + Math.round(Math.random() * 2000)) / 2;
    onCommand(`/${section}`);
    onStatus('Thinking…');
    timer = setTimeout(() => {
      onStatus(`Loading ${section}…`);
      timer = setTimeout(() => {
        onSection(section);
        next();
      }, halfDelay);
    }, halfDelay);
  }
  timer = setTimeout(() => {
    if (intro) {
      onCommand('claude --dangerously-skip-permissions');
      onStatus('executing…');
      timer = setTimeout(next, 1000);
    } else next();
  }, 0);
  return () => clearTimeout(timer);
}
