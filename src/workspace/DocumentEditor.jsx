import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDocument } from './documents.js';
import { useWorkspace } from './WorkspaceContext';

export default function DocumentEditor({ tab }) {
  const ws = useWorkspace();
  const document = getDocument(tab.id);
  const saved = ws.state.tabState[tab.id] ?? {};
  const source = saved.source ?? document.language === 'JSON';
  const query = saved.findQuery ?? '';
  const [copied, setCopied] = useState('');
  const selectedLine = saved.line ?? 1;
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const initialScrollRef = useRef(saved.scrollY);
  const lines = document.content.split('\n');
  const matches = query ? lines.flatMap((line, index) => line.toLowerCase().includes(query.toLowerCase()) ? [index + 1] : []) : [];
  const outline = lines.flatMap((line, index) => /^#{1,3} /.test(line) ? [{ title: line.replace(/^#+ /, ''), line: index + 1 }] : []);

  useEffect(() => {
    const keydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, []);

  useEffect(() => {
    if (initialScrollRef.current != null) { initialScrollRef.current = null; return; }
    if (source) contentRef.current?.querySelector(`[data-line="${selectedLine}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [source, selectedLine]);

  const goToLine = (line) => {
    ws.updateTabState(tab.id, { source: true, line });
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(document.content); setCopied('Copied'); }
    catch { setCopied('Copy unavailable — select the source text'); }
  };
  return (
    <article className="document-editor min-h-full font-mono" style={{ fontSize: "var(--editor-font-size, 14px)" }} aria-label={document.title}>
      <div className="sticky top-0 z-10 bg-bg border-b border-border px-3 py-2 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex gap-2" aria-label="Document view">
          {['Preview', 'Source'].map((label, index) => <button key={label} aria-pressed={source === Boolean(index)} className={source === Boolean(index) ? 'text-accent' : 'text-comment'} onClick={() => { ws.updateTabState(tab.id, { source: Boolean(index) }); }}>{label}</button>)}
        </div>
        <input ref={inputRef} aria-label="Find in document" placeholder="Find in document" value={query} className="bg-sidebar border border-border rounded px-2 py-1 min-w-0 w-40" onChange={(event) => { ws.updateTabState(tab.id, { findQuery: event.target.value }); }} onKeyDown={(event) => { if (event.key === 'Enter' && matches.length) goToLine(matches.find((line) => line > selectedLine) ?? matches[0]); }} />
        {query && <button onClick={() => matches.length && goToLine(matches.find((line) => line > selectedLine) ?? matches[0])}>{matches.length} matches ↓</button>}
        {outline.length > 0 && <select aria-label="Document outline" value="" className="bg-sidebar min-w-0 max-w-48 border border-border rounded py-1" onChange={(event) => goToLine(Number(event.target.value))}><option value="" disabled>Outline</option>{outline.map((item) => <option key={item.line} value={item.line}>{item.title}</option>)}</select>}
        <button className="ml-auto" onClick={copy}>Copy</button>
        <span className="text-comment" role="status">{copied || 'Read-only'}</span>
      </div>
      <div ref={contentRef}>
        {source ? <pre className="py-4 overflow-x-auto leading-6" style={{ fontSize: "inherit" }} aria-label="Document source">{lines.map((line, index) => <div key={index} data-line={index + 1} className={`flex ${selectedLine === index + 1 ? 'bg-border/40' : ''}`} onClick={() => { ws.updateTabState(tab.id, { line: index + 1 }); }}><span className="select-none text-comment text-right w-12 pr-4 shrink-0" aria-hidden="true">{index + 1}</span><code className="pr-6 whitespace-pre-wrap break-words min-w-0">{query ? line.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')).map((part, i) => part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part) : line || ' '}</code></div>)}</pre> : <div className="ct-markdown p-5 md:p-8 max-w-4xl leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]}>{document.language === 'JSON' ? `\`\`\`json\n${document.content}\n\`\`\`` : document.content}</ReactMarkdown></div>}
      </div>
    </article>
  );
}
