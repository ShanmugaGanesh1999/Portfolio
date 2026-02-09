/**
 * SectionLabel — Directory-style label used in sidebar and sections
 * @param {string} children - Label text
 */
export default function SectionLabel({ children }) {
  return (
    <div className="text-comment text-[10px] uppercase font-bold tracking-widest mt-4 mb-2 px-3">
      {children}
    </div>
  );
}
