/**
 * StatusBar — Bottom VS Code-style status bar
 */
export default function StatusBar() {
  return (
    <footer className="h-6 bg-accent text-bg px-3 flex items-center justify-between text-[10px] font-bold shrink-0">
      <div className="flex gap-4">
        <span>MASTER</span>
        <span className="hidden sm:inline">+ 14,302 lines</span>
        <span>UTF-8</span>
      </div>
      <div className="flex gap-4">
        <span>LF</span>
        <span className="hidden sm:inline">Python/Shell</span>
        <span>0:0:1</span>
      </div>
    </footer>
  );
}
