"use client";

import { X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

type TagsInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function TagsInput({ value, onChange, placeholder = "Wpisz i zatwierdź Enterem" }: TagsInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    }
    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="mt-1 rounded-lg border border-ink/10 bg-white px-2 py-2 transition focus-within:border-wine dark:border-paper/10 dark:bg-[#242424]">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-1 text-xs text-ink/70 dark:bg-paper/5 dark:text-paper/70">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-ink/45 transition hover:text-wine dark:text-paper/45">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-32 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35 dark:placeholder:text-paper/35"
        />
      </div>
    </div>
  );
}
