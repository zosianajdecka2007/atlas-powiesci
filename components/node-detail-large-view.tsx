"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Maximize2, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AccordionSection } from "@/components/accordion-section";
import { CharacterRelationsPanel } from "@/components/character-relations-panel";
import { FieldEditor } from "@/components/field-editor";
import { ImageManager } from "@/components/image-manager";
import { accentColors, getSchemaForType, nodeTypes } from "@/lib/node-schema";
import type { DetailValue, NodeImage, RelationshipType, StoryNode, StoryNodeData } from "@/lib/types";

type NodeDetailLargeViewProps = {
  node: StoryNode;
  nodes: StoryNode[];
  onBack: () => void;
  onSaveAndBack: () => void;
  onUpdate: (nodeId: string, patch: Partial<StoryNodeData>) => void;
  onUpdateDetail: (nodeId: string, key: string, value: DetailValue) => void;
  onUpdateImages: (nodeId: string, images: NodeImage[]) => void;
  onConnectCharacter: (sourceId: string, targetName: string, type: RelationshipType, existingTargetId?: string, openAfterCreate?: boolean) => void;
  onOpenNode: (nodeId: string, large?: boolean) => void;
};

export function NodeDetailLargeView({
  node,
  nodes,
  onBack,
  onSaveAndBack,
  onUpdate,
  onUpdateDetail,
  onUpdateImages,
  onConnectCharacter,
  onOpenNode
}: NodeDetailLargeViewProps) {
  const schema = useMemo(() => getSchemaForType(node.data.type), [node.data.type]);
  const [activeTab, setActiveTab] = useState(schema[0]?.id ?? "general");
  const [expandedImage, setExpandedImage] = useState<NodeImage | null>(null);
  const selectedTab = schema.find((tab) => tab.id === activeTab) ?? schema[0];
  const images = [...(node.data.images ?? [])].sort((a, b) => a.order - b.order);
  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];

  useEffect(() => {
    if (!schema.some((tab) => tab.id === activeTab) && schema[0]) {
      setActiveTab(schema[0].id);
    }
  }, [activeTab, schema]);

  const markPrimary = (imageId: string) => {
    onUpdateImages(
      node.id,
      images.map((image) => ({ ...image, isPrimary: image.id === imageId }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-paper text-ink dark:bg-[#141414] dark:text-paper">
      <header className="flex h-16 items-center gap-3 border-b border-ink/10 bg-paper/90 px-5 backdrop-blur-xl dark:border-paper/10 dark:bg-[#141414]/90">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm transition hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424]"
        >
          <ArrowLeft size={16} />
          Wróć do mapy
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{node.data.title}</p>
          <p className="text-xs text-ink/45 dark:text-paper/45">Duży widok szczegółowej edycji</p>
        </div>
        <button
          onClick={onSaveAndBack}
          className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm text-paper transition hover:bg-wine dark:bg-paper dark:text-ink dark:hover:bg-wine dark:hover:text-white"
        >
          <Check size={16} />
          Zapisz i wróć do mapy
        </button>
      </header>

      <div className="grid h-[calc(100vh-4rem)] grid-cols-1 overflow-hidden lg:grid-cols-[360px_1fr]">
        <aside className="hidden overflow-y-auto border-r border-ink/10 bg-porcelain/72 p-5 dark:border-paper/10 dark:bg-[#1b1b1b] lg:block">
          <div className="sticky top-5">
            <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-soft dark:border-paper/10 dark:bg-[#242424]">
              <button
                onClick={() => primaryImage && setExpandedImage(primaryImage)}
                className="relative block aspect-[4/5] w-full bg-ink/5 dark:bg-paper/5"
              >
                {primaryImage ? (
                  <img src={primaryImage.url} alt={primaryImage.caption || node.data.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center px-8 text-center text-sm text-ink/45 dark:text-paper/45">
                    Elegancki placeholder. Dodaj zdjęcie główne, żeby profil nabrał klimatu.
                  </div>
                )}
                <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">
                  Powiększ
                </span>
              </button>
              <div className="p-4">
                <input
                  value={node.data.title}
                  onChange={(event) => onUpdate(node.id, { title: event.target.value })}
                  className="w-full bg-transparent text-2xl font-semibold outline-none"
                />
                <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">{node.data.type}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <Info label="Wiek" value={node.data.details.age} />
                  <Info label="Zaufanie" value={node.data.details.trustLevel} />
                  <Info label="Napięcie" value={node.data.details.tensionLevel} />
                  <Info label="Zazdrość" value={node.data.details.jealousyLevel} />
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/68 dark:text-paper/68">
                  {String(node.data.details.visualVibe ?? node.data.description ?? "Krótki vibe postaci pojawi się tutaj.")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {node.data.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-ink/10 px-2.5 py-1 text-xs text-ink/60 dark:border-paper/10 dark:text-paper/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {images.slice(0, 8).map((image) => (
                  <button
                    key={image.id}
                    onClick={() => markPrimary(image.id)}
                    className={`relative aspect-square overflow-hidden rounded-md border ${
                      image.isPrimary ? "border-wine ring-2 ring-wine/20" : "border-ink/10 dark:border-paper/10"
                    }`}
                    title="Ustaw jako zdjęcie główne"
                  >
                    <img src={image.url} alt={image.caption || "Moodboard"} className="h-full w-full object-cover" />
                    {image.isPrimary && <Star size={13} className="absolute right-1 top-1 fill-wine text-wine" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-5 py-6">
            <div className="mb-5 grid gap-4 rounded-lg border border-ink/10 bg-white p-4 dark:border-paper/10 dark:bg-[#242424] md:grid-cols-[1fr_220px_220px]">
              <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
                Opis
                <textarea
                  value={node.data.description}
                  onChange={(event) => onUpdate(node.id, { description: event.target.value })}
                  className="mt-1 h-24 w-full resize-none rounded-lg border border-ink/10 bg-porcelain px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
                />
              </label>
              <label className="text-xs font-medium text-ink/55 dark:text-paper/55">
                Typ
                <select
                  value={node.data.type}
                  onChange={(event) => onUpdate(node.id, { type: event.target.value as StoryNodeData["type"] })}
                  className="mt-1 w-full rounded-lg border border-ink/10 bg-porcelain px-3 py-2 text-sm outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
                >
                  {nodeTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <div>
                <p className="text-xs font-medium text-ink/55 dark:text-paper/55">Kolor</p>
                <div className="mt-1 flex gap-1 rounded-lg border border-ink/10 bg-porcelain p-1 dark:border-paper/10 dark:bg-[#1b1b1b]">
                  {accentColors.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      onClick={() => onUpdate(node.id, { color })}
                      className="size-9 rounded-md"
                      style={{ backgroundColor: color, outline: node.data.color === color ? "2px solid currentColor" : "none" }}
                      aria-label={`Ustaw kolor ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky top-0 z-10 mb-5 flex gap-2 overflow-x-auto border-b border-ink/10 bg-paper/92 py-3 backdrop-blur dark:border-paper/10 dark:bg-[#141414]/92">
              {schema.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-ink text-paper dark:bg-paper dark:text-ink"
                      : "border border-ink/10 bg-white text-ink/60 hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424] dark:text-paper/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <motion.div key={`${node.id}-${selectedTab?.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-16">
              {selectedTab?.id === "photos" && (
                <ImageManager nodeId={node.id} images={node.data.images ?? []} onChange={(images) => onUpdateImages(node.id, images)} />
              )}

              {node.data.type === "Postać" && selectedTab?.id === "relationships" && (
                <CharacterRelationsPanel
                  node={node}
                  nodes={nodes}
                  onConnectCharacter={onConnectCharacter}
                  onOpenNode={(nodeId) => onOpenNode(nodeId, true)}
                />
              )}

              {selectedTab?.sections?.map((section) => (
                <AccordionSection
                  key={section.id}
                  section={{ ...section, defaultOpen: section.defaultOpen ?? true }}
                  details={node.data.details}
                  onChange={(key, value) => onUpdateDetail(node.id, key, value)}
                />
              ))}

              {selectedTab?.fields?.map((field) => (
                <FieldEditor key={field.key} field={field} value={node.data.details[field.key]} onChange={(value) => onUpdateDetail(node.id, field.key, value)} />
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {expandedImage && (
          <motion.button
            className="fixed inset-0 z-[60] grid place-items-center bg-black/78 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <img src={expandedImage.url} alt={expandedImage.caption || "Zdjęcie"} className="max-h-full max-w-full rounded-lg object-contain shadow-soft" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-md border border-ink/10 p-2 dark:border-paper/10">
      <p className="text-ink/42 dark:text-paper/42">{label}</p>
      <p className="mt-1 font-semibold">{value === undefined || value === "" ? "—" : String(value)}</p>
    </div>
  );
}
