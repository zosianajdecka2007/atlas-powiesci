"use client";

import type { LucideIcon } from "lucide-react";

type ToolbarButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

export function ToolbarButton({ icon: Icon, label, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink/72 transition hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424] dark:text-paper/72"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
