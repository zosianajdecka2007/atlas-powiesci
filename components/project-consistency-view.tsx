"use client";

import { AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { findSimilarCharacters } from "@/lib/relationships";
import type { StoryEdge, StoryNode } from "@/lib/types";

type ProjectConsistencyViewProps = {
  nodes: StoryNode[];
  edges: StoryEdge[];
  onBack: () => void;
  onOpenNode: (nodeId: string, large?: boolean) => void;
};

export function ProjectConsistencyView({ nodes, edges, onBack, onOpenNode }: ProjectConsistencyViewProps) {
  const characters = nodes.filter((node) => node.data.type === "Postać");
  const duplicateWarnings = characters.flatMap((node, index) =>
    findSimilarCharacters(characters.slice(index + 1), node.data.title).map((match) => ({
      id: `dup-${node.id}-${match.id}`,
      title: "Możliwy duplikat postaci",
      description: `${node.data.title} i ${match.data.title} wyglądają na podobne wpisy.`,
      nodeId: node.id
    }))
  );

  const reverseWarnings = characters.flatMap((node) =>
    (node.data.relationships ?? [])
      .filter((relationship) => {
        const target = characters.find((item) => item.id === relationship.targetNodeId);
        return !target?.data.relationships?.some((reverse) => reverse.targetNodeId === node.id);
      })
      .map((relationship) => ({
        id: `reverse-${node.id}-${relationship.targetNodeId}-${relationship.type}`,
        title: "Brak relacji zwrotnej",
        description: `${node.data.title} ma relację „${relationship.type}” z ${relationship.targetName}, ale druga strona nie ma relacji zwrotnej.`,
        nodeId: node.id
      }))
  );

  const dataWarnings = characters
    .filter((node) => !node.data.details.firstName && !node.data.details.lastName && node.data.title === "Wpisz imię i nazwisko postaci")
    .map((node) => ({
      id: `missing-${node.id}`,
      title: "Brak podstawowych danych",
      description: `Postać ${node.data.title} nie ma uzupełnionego imienia, nazwiska ani opisu.`,
      nodeId: node.id
    }));

  const edgeWarnings = edges
    .filter((edge) => {
      const source = nodes.find((node) => node.id === edge.source);
      const target = nodes.find((node) => node.id === edge.target);
      return source?.data.type === "Postać" && target?.data.type === "Postać" && !edge.label;
    })
    .map((edge) => ({
      id: `edge-${edge.id}`,
      title: "Relacja bez typu",
      description: "Połączenie między postaciami nie ma etykiety typu relacji.",
      nodeId: edge.source
    }));

  const warnings = [...duplicateWarnings, ...reverseWarnings, ...dataWarnings, ...edgeWarnings];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-paper text-ink dark:bg-[#141414] dark:text-paper">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-ink/10 bg-paper/90 px-5 backdrop-blur-xl dark:border-paper/10 dark:bg-[#141414]/90">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm transition hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424]"
        >
          <ArrowLeft size={16} />
          Wróć do mapy
        </button>
        <div>
          <p className="text-sm font-semibold">Spójność projektu</p>
          <p className="text-xs text-ink/45 dark:text-paper/45">Duplikaty, relacje zwrotne i brakujące dane.</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        {warnings.length === 0 ? (
          <section className="rounded-lg border border-ink/10 bg-porcelain p-8 text-center dark:border-paper/10 dark:bg-[#1b1b1b]">
            <CheckCircle2 size={30} className="mx-auto mb-3 text-sage" />
            <p className="text-lg font-semibold">Nie znaleziono ostrzeżeń.</p>
            <p className="mt-2 text-sm text-ink/55 dark:text-paper/55">Projekt wygląda spójnie na podstawowym poziomie.</p>
          </section>
        ) : (
          <div className="grid gap-3">
            {warnings.map((warning) => (
              <button
                key={warning.id}
                onClick={() => onOpenNode(warning.nodeId, true)}
                className="rounded-lg border border-ink/10 bg-porcelain p-4 text-left transition hover:border-wine hover:shadow-soft dark:border-paper/10 dark:bg-[#1b1b1b]"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 text-wine" />
                  <div>
                    <p className="font-semibold">{warning.title}</p>
                    <p className="mt-1 text-sm leading-6 text-ink/60 dark:text-paper/60">{warning.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
