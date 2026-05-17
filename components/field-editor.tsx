"use client";

import type { DetailValue, FieldSchema } from "@/lib/types";
import { TagsInput } from "@/components/tags-input";

type FieldEditorProps = {
  field: FieldSchema;
  value: DetailValue | undefined;
  onChange: (value: DetailValue) => void;
};

export function FieldEditor({ field, value, onChange }: FieldEditorProps) {
  const baseClass =
    "mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-wine dark:border-paper/10 dark:bg-[#242424]";

  if (field.kind === "textarea") {
    return (
      <label className="block text-xs font-medium text-ink/55 dark:text-paper/55">
        {field.label}
        <textarea
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={`${baseClass} h-28 resize-none leading-5`}
        />
      </label>
    );
  }

  if (field.kind === "number") {
    return (
      <label className="block text-xs font-medium text-ink/55 dark:text-paper/55">
        {field.label}
        <input
          type="number"
          min={field.min}
          max={field.max}
          value={value === undefined || value === "" ? "" : Number(value)}
          onChange={(event) => onChange(Number(event.target.value))}
          className={baseClass}
        />
      </label>
    );
  }

  if (field.kind === "tags") {
    return (
      <label className="block text-xs font-medium text-ink/55 dark:text-paper/55">
        {field.label}
        <TagsInput value={Array.isArray(value) ? value : String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean)} onChange={onChange} />
      </label>
    );
  }

  return (
    <label className="block text-xs font-medium text-ink/55 dark:text-paper/55">
      {field.label}
      <input
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        className={baseClass}
      />
    </label>
  );
}
