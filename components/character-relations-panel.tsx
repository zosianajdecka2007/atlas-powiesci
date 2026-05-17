"use client";

import { Plus, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { findSimilarCharacters, relationshipTypes } from "@/lib/relationships";
import type { RelationshipType, StoryNode } from "@/lib/types";

type CharacterRelationsPanelProps = {
  node: StoryNode;
  nodes: StoryNode[];
  onConnectCharacter: (sourceId: string, targetName: string, type: RelationshipType, existingTargetId?: string, openAfterCreate?: boolean) => void;
  onOpenNode: (nodeId: string) => void;
};

const quickTypes: { label: string; type: RelationshipType }[] = [
  { label: "Dodaj rodzica", type: "matka" },
  { label: "Dodaj rodzeństwo", type: "rodzeństwo" },
  { label: "Dodaj dziecko", type: "dziecko" },
  { label: "Dodaj partnera", type: "partner" },
  { label: "Dodaj ex", type: "ex" },
  { label: "Dodaj przyjaciela", type: "przyjaciel" },
  { label: "Dodaj inną relację", type: "inna relacja" }
];

export function CharacterRelationsPanel({ node, nodes, onConnectCharacter, onOpenNode }: CharacterRelationsPanelProps) {
  const [draftName, setDraftName] = useState("");
  const [draftType, setDraftType] = useState<RelationshipType>("przyjaciel");
  const [openCreate, setOpenCreate] = useState(false);
  const matches = useMemo(
    () => findSimilarCharacters(nodes.filter((item) => item.id !== node.id), draftName).slice(0, 5),
    [draftName, node.id, nodes]
  );
  const relationships = node.data.relationships ?? [];

  const submit = (existingTargetId?: string, openAfterCreate = false) => {
    if (!draftName.trim() && !existingTargetId) return;
    const target = existingTargetId ? nodes.find((item) => item.id === existingTargetId) : null;
    onConnectCharacter(node.id, target?.data.title ?? draftName, draftType, existingTargetId, openAfterCreate);
    setDraftName("");
  };

  return (
    <section className="rounded-lg border border-ink/10 bg-white/72 p-4 dark:border-paper/10 dark:bg-[#242424]/72">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Powiązane postacie</p>
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">Twórz profile i relacje zwrotne bez opuszczania postaci.</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {quickTypes.map((item) => (
          <button
            key={item.label}
            onClick={() => setDraftType(item.type)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              draftType === item.type ? "border-wine bg-wine/5 text-wine" : "border-ink/10 text-ink/60 hover:border-wine hover:text-wine dark:border-paper/10 dark:text-paper/60"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-2 md:grid-cols-[170px_1fr_auto]">
        <select
          value={draftType}
          onChange={(event) => setDraftType(event.target.value as RelationshipType)}
          className="rounded-lg border border-ink/10 bg-porcelain px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
        >
          {relationshipTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-ink/35 dark:text-paper/35" />
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            placeholder="Wpisz imię i nazwisko postaci"
            className="w-full rounded-lg border border-ink/10 bg-porcelain py-2 pl-9 pr-3 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
          />
          {draftName.trim() && (
            <div className="absolute left-0 right-0 top-11 z-20 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft dark:border-paper/10 dark:bg-[#2b2b2b]">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => submit(match.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-ink/5 dark:hover:bg-paper/5"
                >
                  <UserRound size={14} />
                  Połącz z istniejącą: {match.data.title}
                </button>
              ))}
              <button
                onClick={() => submit(undefined, openCreate)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-wine transition hover:bg-wine/5"
              >
                <Plus size={14} />
                Utwórz nową postać: {draftName}
              </button>
              {matches.length > 0 && (
                <p className="px-3 py-2 text-xs text-ink/45 dark:text-paper/45">
                  Podobna postać już istnieje. Możesz ją połączyć zamiast tworzyć duplikat.
                </p>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => submit(undefined, openCreate)}
          className="rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-wine dark:bg-paper dark:text-ink dark:hover:bg-wine dark:hover:text-white"
        >
          Dodaj
        </button>
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs text-ink/55 dark:text-paper/55">
        <input type="checkbox" checked={openCreate} onChange={(event) => setOpenCreate(event.target.checked)} />
        Otwórz profil po utworzeniu nowej postaci
      </label>

      <div className="mt-5 grid gap-2">
        {relationships.length === 0 ? (
          <p className="rounded-lg border border-ink/10 p-4 text-sm text-ink/50 dark:border-paper/10 dark:text-paper/50">Brak powiązanych postaci.</p>
        ) : (
          relationships.map((relationship) => (
            <button
              key={relationship.id}
              onClick={() => onOpenNode(relationship.targetNodeId)}
              className="grid gap-2 rounded-lg border border-ink/10 p-3 text-left transition hover:border-wine dark:border-paper/10 md:grid-cols-[130px_1fr]"
            >
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-wine">{relationship.type}</span>
              <span>
                <span className="block text-sm font-semibold">{relationship.targetName}</span>
                <span className="text-xs text-ink/50 dark:text-paper/50">
                  Bliskość {relationship.closenessLevel ?? "-"} / Zaufanie {relationship.trustLevel ?? "-"} / Konflikt {relationship.conflictLevel ?? "-"}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
