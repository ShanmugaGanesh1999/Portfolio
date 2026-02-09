/**
 * Prompt — Terminal prompt line with green arrow prefix
 * @param {string} command - Terminal command text (e.g. "cat intro.ascii")
 * @param {string} className - Extra styling
 */
export default function Prompt({ command, className = "" }) {
  return (
    <div className={`text-base sm:text-xl font-bold ${className}`}>
      <span className="text-success font-bold">➜ </span>
      <span className="break-all sm:break-normal">{command}</span>
    </div>
  );
}
