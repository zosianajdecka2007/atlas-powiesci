"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock3,
  Heart,
  Home,
  Map,
  MoreHorizontal,
  Music,
  NotebookPen,
  Plus,
  Quote,
  Sparkles,
  Trash2,
  UserRound
} from "lucide-react";
import { useState } from "react";
import type { ElementType } from "react";
import type { StoryNodeData } from "@/lib/types";

const icons = {
  user: UserRound,
  book: BookOpen,
  sparkles: Sparkles,
  map: Map,
  heart: Heart,
  clock: Clock3,
  home: Home,
  music: Music,
  quote: Quote,
  note: NotebookPen
};

type RuntimeNodeData = StoryNodeData & {
  isDimmed?: boolean;
  onAddChild?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onOpenDetails?: () => void;
  onToggleCollapse?: () => void;
};

export function StoryNodeCard({ data, selected }: NodeProps) {
  const nodeData = data as RuntimeNodeData;
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = icons[nodeData.icon] ?? NotebookPen;

  return (
    <div
      className={`group relative w-64 rounded-lg border bg-white p-3 shadow-soft transition dark:bg-[#242424] ${
        selected ? "border-wine ring-4 ring-wine/10" : "border-ink/10 dark:border-paper/10"
      } ${nodeData.isDimmed ? "opacity-35" : "opacity-100"}`}
    >
      <Handle type="target" position={Position.Left} className="!size-2 !border-0 !bg-wine" />
      <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-navy" />

      <div className="flex items-start gap-3">
        <div
          className="grid size-9 shrink-0 place-items-center rounded-lg text-white"
          style={{ backgroundColor: nodeData.color }}
        >
          <Icon size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <button onDoubleClick={nodeData.onOpenDetails} className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-ink dark:text-paper">{nodeData.title}</p>
              <p className="mt-0.5 text-xs text-ink/45 dark:text-paper/45">{nodeData.type}</p>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((value) => !value);
              }}
              className="grid size-7 shrink-0 place-items-center rounded-md text-ink/45 transition hover:bg-ink/5 hover:text-ink dark:text-paper/45 dark:hover:bg-paper/5 dark:hover:text-paper"
              aria-label="Menu node’a"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {nodeData.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink/62 dark:text-paper/62">{nodeData.description}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {nodeData.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink/10 px-2 py-0.5 text-[11px] text-ink/55 dark:border-paper/10 dark:text-paper/55"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-3 top-12 z-30 w-44 overflow-hidden rounded-lg border border-ink/10 bg-white text-sm shadow-soft dark:border-paper/10 dark:bg-[#2b2b2b]">
          <MenuItem icon={Plus} label="Dodaj podgałąź" onClick={nodeData.onAddChild} />
          <MenuItem icon={NotebookPen} label="Edytuj" onClick={nodeData.onEdit} />
          <MenuItem icon={Trash2} label="Usuń" onClick={nodeData.onDelete} danger />
          <MenuItem icon={ChevronRight} label="Otwórz szczegóły" onClick={nodeData.onOpenDetails} />
          <MenuItem icon={nodeData.collapsed ? ChevronRight : ChevronDown} label={nodeData.collapsed ? "Rozwiń gałąź" : "Zwiń gałąź"} onClick={nodeData.onToggleCollapse} />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  danger,
  onClick
}: {
  icon: ElementType;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-ink/5 dark:hover:bg-paper/5 ${
        danger ? "text-wine" : "text-ink/75 dark:text-paper/75"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
