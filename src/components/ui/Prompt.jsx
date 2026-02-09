/**
 * Prompt — Terminal prompt line with green arrow prefix
 * @param {string} command - Terminal command text (e.g. "cat intro.ascii")
 * @param {string} className - Extra styling
 */
export default function Prompt({ command, className = "" }) {
  return (
    <div className={`text-xl font-bold ${className}`}>
      <span className="text-success font-bold">➜ </span>
      {command}
    </div>
  );
}
