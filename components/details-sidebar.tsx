"use client";

import { motion } from "framer-motion";
import { Check, Copy, Maximize2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AccordionSection } from "@/components/accordion-section";
import { AiStudioPanel } from "@/components/ai-studio-panel";
import { CharacterRelationsPanel } from "@/components/character-relations-panel";
import { FieldEditor } from "@/components/field-editor";
import { ImageManager } from "@/components/image-manager";
import { accentColors, getSchemaForType, nodeTypes } from "@/lib/node-schema";
import type { DetailValue, NodeImage, RelationshipType, StoryNode, StoryNodeData } from "@/lib/types";

type DetailsSidebarProps = {
  node: StoryNode;
  nodes: StoryNode[];
  onAddChild: () => void;
  onDelete: () => void;
  onUpdate: (nodeId: string, patch: Partial<StoryNodeData>) => void;
  onUpdateDetail: (nodeId: string, key: string, value: DetailValue) => void;
  onUpdateImages: (nodeId: string, images: NodeImage[]) => void;
  editMode: "small" | "large";
  onEditModeChange: (mode: "small" | "large") => void;
  onOpenLarge: () => void;
  onConnectCharacter: (sourceId: string, targetName: string, type: RelationshipType, existingTargetId?: string, openAfterCreate?: boolean) => void;
  onOpenNode: (nodeId: string, large?: boolean) => void;
};

export function DetailsSidebar({
  node,
  nodes,
  onAddChild,
  onDelete,
  onUpdate,
  onUpdateDetail,
  onUpdateImages,
  editMode,
  onEditModeChange,
  onOpenLarge,
  onConnectCharacter,
  onOpenNode
}: DetailsSidebarProps) {
  const schema = useMemo(() => getSchemaForType(node.data.type), [node.data.type]);
  const [activeTab, setActiveTab] = useState(schema[0]?.id ?? "general");
  const [savedPulse, setSavedPulse] = useState(false);
  const baselineRef = useRef<StoryNodeData>(node.data);
  const selectedTab = schema.find((tab) => tab.id === activeTab) ?? schema[0];

  useEffect(() => {
    baselineRef.current = node.data;
    setSavedPulse(false);
  }, [node.id]);

  useEffect(() => {
    if (!schema.some((tab) => tab.id === activeTab) && schema[0]) {
      setActiveTab(schema[0].id);
    }
  }, [activeTab, schema]);

  const saveNow = () => {
    baselineRef.current = node.data;
    setSavedPulse(true);
    window.setTimeout(() => setSavedPulse(false), 1200);
  };

  const cancelChanges = () => {
    onUpdate(node.id, baselineRef.current);
  };

  return (
    <aside className="flex h-full flex-col">
      <div className="border-b border-ink/10 p-5 dark:border-paper/10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Szczegóły node’a</p>
            <input
              value={node.data.title}
              onChange={(event) => onUpdate(node.id, { title: event.target.value })}
              className="mt-2 w-full bg-transparent text-xl font-semibold outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAddChild}
              className="grid size-9 place-items-center rounded-lg border border-ink/10 transition hover:border-wine hover:text-wine dark:border-paper/10"
              aria-label="Dodaj podgałąź"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={onDelete}
              className="grid size-9 place-items-center rounded-lg border border-ink/10 text-wine transition hover:bg-wine hover:text-white dark:border-paper/10"
              aria-label="Usuń node"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
            Typ
            <select
              value={node.data.type}
              onChange={(event) => onUpdate(node.id, { type: event.target.value as StoryNodeData["type"] })}
              className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
            >
              {nodeTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
            Ikona / kolor
            <div className="mt-1 flex gap-1 rounded-lg border border-ink/10 bg-white p-1 dark:border-paper/10 dark:bg-[#242424]">
              {accentColors.slice(0, 5).map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdate(node.id, { color })}
                  className="size-7 rounded-md ring-offset-2 ring-offset-white dark:ring-offset-[#242424]"
                  style={{ backgroundColor: color, outline: node.data.color === color ? "2px solid currentColor" : "none" }}
                  aria-label={`Ustaw kolor ${color}`}
                />
              ))}
            </div>
          </label>
        </div>

        <label className="mt-4 block text-xs font-medium text-ink/55 dark:text-paper/55">
          Opis
          <textarea
            value={node.data.description}
            onChange={(event) => onUpdate(node.id, { description: event.target.value })}
            className="mt-1 h-20 w-full resize-none rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
          />
        </label>

        <label className="mt-3 block text-xs font-medium text-ink/55 dark:text-paper/55">
          Tagi
          <input
            value={node.data.tags.join(", ")}
            onChange={(event) =>
              onUpdate(node.id, {
                tags: event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              })
            }
            className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={saveNow}
            className="flex items-center justify-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm text-paper transition hover:bg-wine dark:bg-paper dark:text-ink dark:hover:bg-wine dark:hover:text-white"
          >
            <Check size={15} />
            {savedPulse ? "Zapisano" : "Zapisz"}
          </button>
          <button
            onClick={cancelChanges}
            className="flex items-center justify-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm transition hover:border-wine hover:text-wine dark:border-paper/10"
          >
            <RotateCcw size={15} />
            Anuluj
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-ink/10 bg-white p-1 dark:border-paper/10 dark:bg-[#242424]">
          <button
            onClick={() => onEditModeChange("small")}
            className={`rounded-md px-3 py-2 text-xs font-medium transition ${
              editMode === "small" ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-ink/60 hover:text-wine dark:text-paper/60"
            }`}
          >
            Mały panel
          </button>
          <button
            onClick={() => {
              onEditModeChange("large");
              onOpenLarge();
            }}
            className={`rounded-md px-3 py-2 text-xs font-medium transition ${
              editMode === "large" ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "text-ink/60 hover:text-wine dark:text-paper/60"
            }`}
          >
            Duży widok
          </button>
        </div>

        <button
          onClick={onOpenLarge}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm transition hover:border-wine hover:text-wine dark:border-paper/10"
        >
          <Maximize2 size={15} />
          Otwórz w dużym widoku
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-ink/10 px-5 py-3 dark:border-paper/10">
        {schema.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeTab === tab.id
                ? "bg-ink text-paper dark:bg-paper dark:text-ink"
                : "border border-ink/10 text-ink/60 hover:border-wine hover:text-wine dark:border-paper/10 dark:text-paper/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={`${node.id}-${selectedTab?.id}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-0 flex-1 overflow-y-auto p-5"
      >
        <div className="space-y-4">
          {selectedTab?.id === "photos" && (
            <ImageManager
              nodeId={node.id}
              images={node.data.images ?? []}
              onChange={(images) => onUpdateImages(node.id, images)}
            />
          )}

          {selectedTab?.id === "general" && <AiStudioPanel />}

          {node.data.type === "Postać" && selectedTab?.id === "relationships" && (
            <CharacterRelationsPanel
              node={node}
              nodes={nodes}
              onConnectCharacter={onConnectCharacter}
              onOpenNode={(nodeId) => onOpenNode(nodeId, false)}
            />
          )}

          {selectedTab?.sections?.map((section) => (
            <AccordionSection
              key={section.id}
              section={section}
              details={node.data.details}
              onChange={(key, value) => onUpdateDetail(node.id, key, value)}
            />
          ))}

          {selectedTab?.fields?.map((field) => (
            <FieldEditor
              key={field.key}
              field={field}
              value={node.data.details[field.key]}
              onChange={(value) => onUpdateDetail(node.id, field.key, value)}
            />
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-ink/10 p-4 text-xs text-ink/55 dark:border-paper/10 dark:text-paper/55">
          <div className="mb-2 flex items-center gap-2 font-medium text-ink/70 dark:text-paper/70">
            <Copy size={14} />
            Historia
          </div>
          <p>Utworzono: {new Date(node.data.createdAt).toLocaleString("pl-PL")}</p>
          <p>Edytowano: {new Date(node.data.updatedAt).toLocaleString("pl-PL")}</p>
        </div>
      </motion.div>
    </aside>
  );
}
