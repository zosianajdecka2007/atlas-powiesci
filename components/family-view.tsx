"use client";

import { ArrowLeft, UsersRound } from "lucide-react";
import type { StoryNode } from "@/lib/types";

type FamilyViewProps = {
  nodes: StoryNode[];
  onBack: () => void;
  onOpenNode: (nodeId: string, large?: boolean) => void;
};

const familyTypes = new Set(["matka", "ojciec", "córka", "syn", "brat", "siostra", "rodzeństwo", "dziecko"]);

export function FamilyView({ nodes, onBack, onOpenNode }: FamilyViewProps) {
  const characters = nodes.filter((node) => node.data.type === "Postać");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-paper text-ink dark:bg-[#141414] dark:text-paper">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-ink/10 bg-paper/90 px-5 backdrop-blur-xl dark:border-paper/10 dark:bg-[#141414]/90">
        <button onClick={onBack} className="rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm transition hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424]">
          <ArrowLeft size={16} className="mr-2 inline" />
          Wróć do mapy
        </button>
        <div>
          <p className="text-sm font-semibold">Rodzina</p>
          <p className="text-xs text-ink/45 dark:text-paper/45">Automatyczne drzewka rodzinne z relacji postaci.</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          {characters.map((character) => {
            const family = (character.data.relationships ?? []).filter((relationship) => familyTypes.has(relationship.type));
            return (
              <section key={character.id} className="rounded-lg border border-ink/10 bg-porcelain p-4 dark:border-paper/10 dark:bg-[#1b1b1b]">
                <button onClick={() => onOpenNode(character.id, true)} className="mb-3 flex items-center gap-2 text-left">
                  <UsersRound size={17} className="text-wine" />
                  <span className="font-semibold">{character.data.title}</span>
                </button>
                {family.length === 0 ? (
                  <p className="text-sm text-ink/50 dark:text-paper/50">Brak relacji rodzinnych.</p>
                ) : (
                  <div className="grid gap-2">
                    {family.map((relationship) => (
                      <button
                        key={relationship.id}
                        onClick={() => onOpenNode(relationship.targetNodeId, true)}
                        className="flex items-center justify-between rounded-md border border-ink/10 bg-white px-3 py-2 text-left text-sm transition hover:border-wine dark:border-paper/10 dark:bg-[#242424]"
                      >
                        <span>{relationship.targetName}</span>
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-wine">{relationship.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
