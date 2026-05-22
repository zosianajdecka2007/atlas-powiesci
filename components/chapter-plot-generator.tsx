"use client";

import { BookOpen, Loader2, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ChapterPlotInput, ChapterPlotOutput, GeneratedChapter } from "@/lib/chapter-plot";
import type { StoryNode } from "@/lib/types";

type ChapterPlotGeneratorProps = {
  node: StoryNode;
  nodes: StoryNode[];
  onCreateChapters: (sourceNodeId: string, chapters: GeneratedChapter[]) => void;
};

export function ChapterPlotGenerator({ node, nodes, onCreateChapters }: ChapterPlotGeneratorProps) {
  const characters = useMemo(() => nodes.filter((item) => item.data.type === "Postać").map((item) => item.data.title), [nodes]);
  const [input, setInput] = useState<ChapterPlotInput>({
    title: node.data.title,
    premise: String(node.data.details.summary ?? node.data.description ?? ""),
    genre: "",
    tone: "cinematic, emocjonalnie, realistycznie",
    chaptersCount: 12,
    pov: "",
    mainCharacters: characters.slice(0, 6).join(", "),
    coreConflict: "",
    romanticThread: "",
    secrets: "",
    endingDirection: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(ChapterPlotOutput & { mode?: string }) | null>(null);

  const update = (key: keyof ChapterPlotInput, value: string | number) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const generate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chapter-plot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      setResult(await response.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-ink/10 bg-white/72 p-4 dark:border-paper/10 dark:bg-[#242424]/72">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-wine text-white">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold">AI fabuła rozdziałów</p>
          <p className="mt-1 text-xs leading-5 text-ink/50 dark:text-paper/50">
            Wygeneruj pełny plan rozdziałów, a potem dodaj go do mapy jako node’y typu „Rozdział”.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <Input label="Tytuł / robocza nazwa" value={input.title} onChange={(value) => update("title", value)} />
        <Textarea label="O czym jest książka?" value={input.premise} onChange={(value) => update("premise", value)} />
        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Gatunek" value={input.genre} onChange={(value) => update("genre", value)} />
          <Input label="Ton" value={input.tone} onChange={(value) => update("tone", value)} />
          <Input label="POV" value={input.pov} onChange={(value) => update("pov", value)} />
          <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
            Liczba rozdziałów
            <input
              type="number"
              min={3}
              max={60}
              value={input.chaptersCount}
              onChange={(event) => update("chaptersCount", Number(event.target.value))}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-porcelain px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
            />
          </label>
        </div>
        <Textarea label="Główne postacie" value={input.mainCharacters} onChange={(value) => update("mainCharacters", value)} />
        <Textarea label="Główny konflikt" value={input.coreConflict} onChange={(value) => update("coreConflict", value)} />
        <Textarea label="Wątek romantyczny / relacyjny" value={input.romanticThread} onChange={(value) => update("romanticThread", value)} />
        <Textarea label="Sekrety i tajemnice" value={input.secrets} onChange={(value) => update("secrets", value)} />
        <Textarea label="Kierunek finału" value={input.endingDirection} onChange={(value) => update("endingDirection", value)} />
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-wine disabled:opacity-60 dark:bg-paper dark:text-ink dark:hover:bg-wine dark:hover:text-white"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Tworzę fabułę..." : "Wygeneruj fabułę rozdziałów"}
      </button>

      {result && (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-ink/10 bg-porcelain p-4 dark:border-paper/10 dark:bg-[#1b1b1b]">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-wine">{result.mode === "ai" ? "AI" : "tryb lokalny"}</p>
            <p className="mt-2 text-sm leading-6 text-ink/70 dark:text-paper/70">{result.logline}</p>
          </div>

          <div className="grid gap-2">
            {result.chapters.map((chapter) => (
              <article key={chapter.number} className="rounded-lg border border-ink/10 bg-porcelain p-4 dark:border-paper/10 dark:bg-[#1b1b1b]">
                <div className="mb-2 flex items-start gap-2">
                  <BookOpen size={15} className="mt-0.5 text-wine" />
                  <div>
                    <p className="text-sm font-semibold">
                      {chapter.number}. {chapter.title}
                    </p>
                    <p className="text-xs text-ink/45 dark:text-paper/45">POV: {chapter.pov || "do ustalenia"}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-ink/65 dark:text-paper/65">{chapter.goal}</p>
                <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">Cliffhanger: {chapter.cliffhanger}</p>
              </article>
            ))}
          </div>

          <button
            onClick={() => onCreateChapters(node.id, result.chapters)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-wine bg-wine/5 px-4 py-2.5 text-sm font-medium text-wine transition hover:bg-wine hover:text-white"
          >
            <Plus size={16} />
            Dodaj rozdziały do mapy
          </button>
        </div>
      )}
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-ink/10 bg-porcelain px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-24 w-full resize-none rounded-lg border border-ink/10 bg-porcelain px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
      />
    </label>
  );
}
