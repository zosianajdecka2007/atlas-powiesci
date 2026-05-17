"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FieldEditor } from "@/components/field-editor";
import type { DetailValue, SectionSchema } from "@/lib/types";

type AccordionSectionProps = {
  section: SectionSchema;
  details: Record<string, DetailValue>;
  onChange: (key: string, value: DetailValue) => void;
};

export function AccordionSection({ section, details, onChange }: AccordionSectionProps) {
  const [open, setOpen] = useState(section.defaultOpen ?? false);

  return (
    <section className="rounded-lg border border-ink/10 bg-white/72 dark:border-paper/10 dark:bg-[#242424]/72">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-ink dark:text-paper">{section.title}</p>
          {section.description && <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">{section.description}</p>}
        </div>
        <ChevronDown size={16} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="grid gap-4 border-t border-ink/10 p-4 dark:border-paper/10">
          {section.fields.map((field) => (
            <FieldEditor
              key={field.key}
              field={field}
              value={details[field.key]}
              onChange={(value) => onChange(field.key, value)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
