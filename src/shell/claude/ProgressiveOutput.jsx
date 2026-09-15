import { useEffect, useRef, useState } from 'react';
import { revealWords } from './revealWords';

export default function ProgressiveOutput({ children, active, animate = true, initialWords, onComplete, onProgress, onReveal }) {
  const [words, setWords] = useState(() => initialWords ?? (!animate || (document.documentElement.dataset.motion === 'reduce' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? Infinity : 0));
  const completed = useRef(false);
  const { content, total } = revealWords(children, words);
  useEffect(() => {
    if (!active || completed.current) return;
    const timer = setTimeout(() => {
      if (words >= total) {
        completed.current = true;
        onComplete?.();
      } else setWords((value) => value + 5);
    }, words >= total ? 0 : 55);
    return () => clearTimeout(timer);
  }, [active, words, total, onComplete]);
  useEffect(() => { onProgress?.(); onReveal?.(words); }, [words, onProgress, onReveal]);
  return <div className="ct-progressive" aria-busy={active || undefined}>{content}</div>;
}
