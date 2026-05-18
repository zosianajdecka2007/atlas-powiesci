"use client";

import { Brain, FileDown, LineChart, PenLine, Sparkles } from "lucide-react";
import type { ElementType } from "react";

export function AiStudioPanel() {
  return (
    <section className="rounded-lg border border-ink/10 bg-white/72 p-4 dark:border-paper/10 dark:bg-[#242424]/72">
      <div className="mb-4 flex items-center gap-2">
        <Brain size={17} className="text-wine" />
        <p className="text-sm font-semibold">AI Writing Studio</p>
      </div>
      <div className="grid gap-2">
        <AiButton icon={Sparkles} label="Przeanalizuj rozdział" description="Tempo, dialogi, napięcie, naturalność i continuity." />
        <AiButton icon={PenLine} label="Sugestie scen" description="Callbacks, cisza, konflikt, intimacy i rozwój relacji." />
        <AiButton icon={LineChart} label="Emotional tracker" description="Loneliness, obsession, trust, happiness, trauma, intimacy." />
        <AiButton icon={FileDown} label="Eksport Book Bible PDF" description="Cinematic PDF z postaciami, relacjami, mapami i moodboardem." />
      </div>
      <p className="mt-4 text-xs leading-5 text-ink/50 dark:text-paper/50">
        Moduły są przygotowane w UI. Do pełnej analizy trzeba później podłączyć bezpieczny endpoint AI po stronie serwera.
      </p>
    </section>
  );
}

function AiButton({ icon: Icon, label, description }: { icon: ElementType; label: string; description: string }) {
  return (
    <button className="rounded-lg border border-ink/10 p-3 text-left transition hover:border-wine hover:shadow-soft dark:border-paper/10">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-wine" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">{description}</p>
    </button>
  );
}
