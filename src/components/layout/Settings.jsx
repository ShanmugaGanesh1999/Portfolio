import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Icon } from "../ui";

const KEY = "sg-editor-settings:v1";
// Shared with App bootstrap so motion preferences apply before lazy shells mount.
// eslint-disable-next-line react-refresh/only-export-components
export function readSettings() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return { fontSize: [12, 14, 16, 18].includes(value?.fontSize) ? value.fontSize : 14, motion: value?.motion === "reduce" ? "reduce" : "system" };
  } catch { return { fontSize: 14, motion: "system" }; }
}

export default function Settings() {
  const dialog = useRef(null);
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(readSettings);
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  const mod = mac ? "⌘" : "Ctrl+";
  useEffect(() => {
    document.documentElement.style.setProperty("--editor-font-size", `${settings.fontSize}px`);
    document.documentElement.dataset.motion = settings.motion;
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* Settings still work without storage. */ }
  }, [settings]);
  useEffect(() => {
    const open = () => { if (!dialog.current.open) dialog.current.showModal(); };
    window.addEventListener("portfolio:settings", open);
    return () => window.removeEventListener("portfolio:settings", open);
  }, []);
  const shortcuts = [[`${mod}P`, "Quick Open"], [`${mod}⇧P`, "Command Palette"], [`${mod}⇧F`, "Search documents"], [`${mod}B`, "Explorer"], [`${mod}L`, "Agent sidebar"], [`${mod}K`, "Ask about selection"], [`${mod}J`, "Bottom panel"], ["Shift+Tab", "Cycle Agent mode in composer"], ["Esc", "Close dialog / stop response"]];
  return <>
    <button className="settings-trigger" aria-label="Open Settings" title="Settings" onClick={() => dialog.current.showModal()}><Icon name="settings" /></button>
    <dialog ref={dialog} className="editor-settings" aria-labelledby="settings-title" onKeyDown={event => event.stopPropagation()} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="settings-heading"><h2 id="settings-title">Settings</h2><button aria-label="Close Settings" onClick={() => dialog.current.close()}><Icon name="close" /></button></div>
      <p className="settings-description">Personalize this portfolio workspace. Preferences stay in this browser.</p>
      <label className="settings-row"><span>Appearance</span><select value={theme} onChange={event => setTheme(event.target.value)}><option value="dark">Dark</option><option value="light">Light</option></select></label>
      <label className="settings-row"><span>Document font size</span><select value={settings.fontSize} onChange={event => setSettings({ ...settings, fontSize: Number(event.target.value) })}>{[12, 14, 16, 18].map(size => <option key={size} value={size}>{size} px</option>)}</select></label>
      <label className="settings-row"><span>Motion</span><select value={settings.motion} onChange={event => setSettings({ ...settings, motion: event.target.value })}><option value="system">Follow system</option><option value="reduce">Reduce motion</option></select></label>
      <h3>Keyboard shortcuts</h3><dl className="settings-shortcuts">{shortcuts.map(([keys, label]) => <div key={label}><dt>{label}</dt><dd><kbd>{keys}</kbd></dd></div>)}</dl>
      <p className="settings-description">Browser shortcuts can take priority. All actions also have on-screen controls.</p>
      <footer>Shanmuga Ganesh · Interactive portfolio</footer>
    </dialog>
  </>;
}
