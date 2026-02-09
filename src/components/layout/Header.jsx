import { Icon } from "../ui";

/**
 * Header — Top terminal title bar with traffic lights and SSH badge
 */
export default function Header() {
  return (
    <header className="h-10 border-b border-border flex items-center px-4 justify-between bg-sidebar shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-xs text-comment">
          <Icon name="terminal" size="text-[14px]" className="mr-1" />
          shanmuga@sg-sys: ~/portfolio/v2.0
        </div>
      </div>
      <div className="text-[10px] text-comment font-bold hidden sm:block">
        SSH: 256-BIT ENCRYPTION ACTIVE
      </div>
    </header>
  );
}
