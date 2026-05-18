"use client";

import { Clock3, Plus } from "lucide-react";
import { relationshipTypes } from "@/lib/relationships";
import type { CharacterRelationship, RelationshipTimelinePoint, RelationshipType, StoryNode } from "@/lib/types";

type RelationshipProfilePanelProps = {
  source: StoryNode;
  target: StoryNode;
  relationship: CharacterRelationship;
  onUpdate: (relationshipId: string, patch: Partial<CharacterRelationship>) => void;
  onOpenCharacter: (nodeId: string) => void;
};

const metrics: { key: keyof CharacterRelationship; label: string }[] = [
  { key: "closenessLevel", label: "Bliskość" },
  { key: "trustLevel", label: "Zaufanie" },
  { key: "conflictLevel", label: "Konflikt" },
  { key: "tensionLevel", label: "Napięcie" },
  { key: "jealousyLevel", label: "Zazdrość" },
  { key: "safetyLevel", label: "Bezpieczeństwo" },
  { key: "dependencyLevel", label: "Dependency" },
  { key: "obsessionLevel", label: "Obsession" }
];

export function RelationshipProfilePanel({ source, target, relationship, onUpdate, onOpenCharacter }: RelationshipProfilePanelProps) {
  const updateTimelinePoint = (pointId: string, patch: Partial<RelationshipTimelinePoint>) => {
    onUpdate(relationship.id, {
      timeline: (relationship.timeline ?? []).map((point) => (point.id === pointId ? { ...point, ...patch } : point))
    });
  };

  const addTimelinePoint = () => {
    onUpdate(relationship.id, {
      timeline: [
        ...(relationship.timeline ?? []),
        {
          id: crypto.randomUUID(),
          label: `Tom ${(relationship.timeline ?? []).length + 1}`
        }
      ]
    });
  };

  return (
    <section className="rounded-lg border border-ink/10 bg-porcelain p-4 shadow-soft dark:border-paper/10 dark:bg-[#1b1b1b]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Profil relacji</p>
          <button onClick={() => onOpenCharacter(source.id)} className="text-xs text-ink/55 hover:text-wine dark:text-paper/55">
            {source.data.title}
          </button>
          <span className="px-2 text-xs text-ink/35">→</span>
          <button onClick={() => onOpenCharacter(target.id)} className="text-xs text-ink/55 hover:text-wine dark:text-paper/55">
            {target.data.title}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
          Typ relacji
          <select
            value={relationship.type}
            onChange={(event) => onUpdate(relationship.id, { type: event.target.value as RelationshipType })}
            className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
          >
            {relationshipTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
          Power dynamic
          <input
            value={relationship.powerDynamic ?? ""}
            onChange={(event) => onUpdate(relationship.id, { powerDynamic: event.target.value })}
            className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <label key={metric.key} className="text-xs font-medium text-ink/55 dark:text-paper/55">
            {metric.label}
            <input
              type="number"
              min={1}
              max={10}
              value={Number(relationship[metric.key] ?? "") || ""}
              onChange={(event) => onUpdate(relationship.id, { [metric.key]: event.target.value ? Number(event.target.value) : undefined })}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <Textarea label="Opis dynamiki" value={relationship.description} onChange={(description) => onUpdate(relationship.id, { description })} />
        <Textarea label="Sekrety" value={relationship.secrets} onChange={(secrets) => onUpdate(relationship.id, { secrets })} />
        <Textarea label="Ważne sceny" value={relationship.importantScenes} onChange={(importantScenes) => onUpdate(relationship.id, { importantScenes })} />
        <Textarea label="Notatki" value={relationship.notes} onChange={(notes) => onUpdate(relationship.id, { notes })} />
      </div>

      <div className="mt-5 rounded-lg border border-ink/10 p-3 dark:border-paper/10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock3 size={15} className="text-wine" />
            <p className="text-sm font-semibold">Timeline relacji</p>
          </div>
          <button onClick={addTimelinePoint} className="flex items-center gap-1 rounded-md border border-ink/10 px-2 py-1 text-xs hover:border-wine hover:text-wine dark:border-paper/10">
            <Plus size={13} />
            Dodaj etap
          </button>
        </div>
        <div className="grid gap-2">
          {(relationship.timeline ?? []).map((point) => (
            <div key={point.id} className="grid gap-2 rounded-md bg-white p-2 dark:bg-[#242424] md:grid-cols-[120px_repeat(4,1fr)]">
              <input value={point.label} onChange={(event) => updateTimelinePoint(point.id, { label: event.target.value })} className="rounded-md border border-ink/10 px-2 py-1 text-xs dark:border-paper/10 dark:bg-[#1b1b1b]" />
              <MiniMetric label="Zauf." value={point.trustLevel} onChange={(trustLevel) => updateTimelinePoint(point.id, { trustLevel })} />
              <MiniMetric label="Napięcie" value={point.tensionLevel} onChange={(tensionLevel) => updateTimelinePoint(point.id, { tensionLevel })} />
              <MiniMetric label="Bliskość" value={point.closenessLevel} onChange={(closenessLevel) => updateTimelinePoint(point.id, { closenessLevel })} />
              <MiniMetric label="Obsess." value={point.obsessionLevel} onChange={(obsessionLevel) => updateTimelinePoint(point.id, { obsessionLevel })} />
            </div>
          ))}
          {(relationship.timeline ?? []).length === 0 && <p className="text-xs text-ink/50 dark:text-paper/50">Dodaj etapy typu Tom 1, Tom 2, Tom 3.</p>}
        </div>
      </div>
    </section>
  );
}

function Textarea({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
      {label}
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-20 w-full resize-none rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
      />
    </label>
  );
}

function MiniMetric({ label, value, onChange }: { label: string; value?: number; onChange: (value?: number) => void }) {
  return (
    <label className="text-[11px] text-ink/50 dark:text-paper/50">
      {label}
      <input
        type="number"
        min={1}
        max={10}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)}
        className="mt-1 w-full rounded-md border border-ink/10 px-2 py-1 text-xs dark:border-paper/10 dark:bg-[#1b1b1b]"
      />
    </label>
  );
}
