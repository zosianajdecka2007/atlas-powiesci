"use client";

import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Download,
  FileText,
  Moon,
  PanelRightClose,
  Plus,
  Search,
  Sun,
  Tags,
  UsersRound,
  AlertTriangle,
  GitBranch,
  Clock3,
  Heart,
  MapPin,
  EyeOff
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DetailsSidebar } from "@/components/details-sidebar";
import { FamilyView } from "@/components/family-view";
import { NodeDetailLargeView } from "@/components/node-detail-large-view";
import { ProjectConsistencyView } from "@/components/project-consistency-view";
import { RelationshipProfilePanel } from "@/components/relationship-profile-panel";
import { StoryNodeCard } from "@/components/story-node-card";
import { ToolbarButton } from "@/components/toolbar-button";
import { autosaveProject, loadLocalProject } from "@/lib/autosave";
import { exportProjectToMarkdown, downloadTextFile } from "@/lib/export";
import { accentColors, nodeTypes } from "@/lib/node-schema";
import { findSimilarCharacters, getReverseRelationshipType, makeRelationship, relationshipColor } from "@/lib/relationships";
import { seedEdges, seedNodes, seedProject } from "@/lib/seed-data";
import type { BookProject, NodeImage, NodeType, RelationshipType, StoryEdge, StoryNode, StoryNodeData } from "@/lib/types";
import type { GeneratedChapter } from "@/lib/chapter-plot";

const flowNodeTypes = { storyNode: StoryNodeCard };

function createNodeData(title: string, type: NodeType, parent?: StoryNode): StoryNodeData {
  const timestamp = new Date().toISOString();
  const color = accentColors[Math.floor(Math.random() * accentColors.length)];
  const resolvedTitle = type === "Postać" && title === "Nowy node" ? "Wpisz imię i nazwisko postaci" : title;

  return {
    title: resolvedTitle,
    type,
    description: "",
    notes: "",
    tags: type === "Inne" ? [] : [type.toLowerCase()],
    color,
    icon: type === "Postać" ? "user" : type === "Relacja" ? "heart" : type === "Timeline" ? "clock" : "note",
    createdAt: timestamp,
    updatedAt: timestamp,
    details: parent ? { source: parent.data.title } : {},
    images: []
  };
}

function getDescendantIds(nodeId: string, edges: StoryEdge[]) {
  const descendants = new Set<string>();
  const visit = (id: string) => {
    edges
      .filter((edge) => edge.source === id)
      .forEach((edge) => {
        if (!descendants.has(edge.target)) {
          descendants.add(edge.target);
          visit(edge.target);
        }
      });
  };
  visit(nodeId);
  return descendants;
}

type BookWorkspaceProps = {
  initialProject?: BookProject;
  initialNodes?: StoryNode[];
  initialEdges?: StoryEdge[];
  userEmail?: string | null;
  onBackToDashboard?: () => void;
  onSignOut?: () => void;
};

export function BookWorkspace({
  initialProject,
  initialNodes,
  initialEdges,
  userEmail,
  onBackToDashboard,
  onSignOut
}: BookWorkspaceProps = {}) {
  const [project, setProject] = useState(initialProject ?? seedProject);
  const [nodes, setNodes] = useState<StoryNode[]>(initialNodes ?? seedNodes);
  const [edges, setEdges] = useState<StoryEdge[]>(initialEdges ?? seedEdges);
  const [selectedNodeId, setSelectedNodeId] = useState("root");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [editMode, setEditMode] = useState<"small" | "large">("small");
  const [largeViewOpen, setLargeViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<
    "map" | "plot" | "characters" | "relationships" | "family" | "timeline" | "romance" | "secrets" | "locations" | "consistency"
  >("map");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  useEffect(() => {
    if (initialProject) return;
    const stored = loadLocalProject();
    if (stored) {
      setProject(stored.project);
      setNodes(stored.nodes);
      setEdges(stored.edges);
      setSelectedNodeId(stored.nodes[0]?.id ?? "root");
    }
  }, [initialProject]);

  useEffect(() => {
    const storedMode = window.localStorage.getItem("atlas-powiesci-edit-mode");
    if (storedMode === "small" || storedMode === "large") {
      setEditMode(storedMode);
    }
  }, []);

  const changeEditMode = useCallback((mode: "small" | "large") => {
    setEditMode(mode);
    window.localStorage.setItem("atlas-powiesci-edit-mode", mode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setSaveState("saving");
    const timer = window.setTimeout(async () => {
      await autosaveProject({ project, nodes, edges });
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 1200);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [project, nodes, edges]);

  const updateNode = useCallback((nodeId: string, patch: Partial<StoryNodeData>) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...patch,
                updatedAt: new Date().toISOString()
              }
            }
          : node
      )
    );
  }, []);

  const updateNodeDetails = useCallback((nodeId: string, key: string, value: string | number | string[]) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                updatedAt: new Date().toISOString(),
                details: {
                  ...node.data.details,
                  [key]: value
                }
              }
            }
          : node
      )
    );
  }, []);

  const updateNodeImages = useCallback((nodeId: string, images: NodeImage[]) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                images,
                updatedAt: new Date().toISOString()
              }
            }
          : node
      )
    );
  }, []);

  const openNode = useCallback((nodeId: string, large = false) => {
    setSelectedNodeId(nodeId);
    if (large) setLargeViewOpen(true);
  }, []);

  const connectCharacter = useCallback(
    (sourceId: string, targetName: string, type: RelationshipType, existingTargetId?: string, openAfterCreate = false) => {
      const source = nodes.find((node) => node.id === sourceId);
      if (!source) return;

      const similar = existingTargetId ? [] : findSimilarCharacters(nodes.filter((node) => node.id !== sourceId), targetName);
      const targetId = existingTargetId ?? similar[0]?.id ?? `node-${crypto.randomUUID()}`;
      const targetExists = nodes.some((node) => node.id === targetId);
      const now = new Date().toISOString();
      const reverseType = getReverseRelationshipType(type);
      const sourceRelationshipTarget = targetExists
        ? nodes.find((node) => node.id === targetId)
        : ({
            id: targetId,
            type: "storyNode",
            position: { x: source.position.x + 320, y: source.position.y + 120 },
            data: createNodeData(targetName.trim() || "Wpisz imię i nazwisko postaci", "Postać", source)
          } as StoryNode);

      if (!sourceRelationshipTarget) return;

      const sourceRelationship = makeRelationship(sourceRelationshipTarget, type, reverseType);
      const reverseRelationship = makeRelationship(source, reverseType, type);

      setNodes((current) => {
        const newTargetNode: StoryNode = {
          id: targetId,
          type: "storyNode",
          position: { x: source.position.x + 320, y: source.position.y + 120 },
          data: {
            ...createNodeData(targetName.trim() || "Wpisz imię i nazwisko postaci", "Postać", source),
            relationships: [reverseRelationship],
            updatedAt: now
          }
        };
        const next = targetExists
          ? current
          : [...current, newTargetNode];

        return next.map((node) => {
          if (node.id === sourceId) {
            const exists = (node.data.relationships ?? []).some((relationship) => relationship.targetNodeId === targetId && relationship.type === type);
            return {
              ...node,
              data: {
                ...node.data,
                relationships: exists ? node.data.relationships : [...(node.data.relationships ?? []), sourceRelationship],
                updatedAt: now
              }
            };
          }

          if (node.id === targetId && targetExists) {
            const exists = (node.data.relationships ?? []).some((relationship) => relationship.targetNodeId === sourceId && relationship.type === reverseType);
            return {
              ...node,
              data: {
                ...node.data,
                relationships: exists ? node.data.relationships : [...(node.data.relationships ?? []), reverseRelationship],
                updatedAt: now
              }
            };
          }

          return node;
        });
      });

      setEdges((current) => {
        const exists = current.some((edge) => edge.source === sourceId && edge.target === targetId && edge.label === type);
        if (exists) return current;
        return [
          ...current,
          {
            id: `rel-${sourceId}-${targetId}-${type}`,
            source: sourceId,
            target: targetId,
            label: type,
            style: { stroke: relationshipColor(type), strokeWidth: 2 },
            labelStyle: { fill: relationshipColor(type), fontWeight: 600 }
          }
        ];
      });

      if (openAfterCreate) {
        setSelectedNodeId(targetId);
        setLargeViewOpen(true);
      }
    },
    [nodes]
  );

  const updateRelationship = useCallback((relationshipId: string, patch: Partial<NonNullable<StoryNodeData["relationships"]>[number]>) => {
    const now = new Date().toISOString();
    setNodes((current) =>
      current.map((node) => {
        const hasRelationship = node.data.relationships?.some((relationship) => relationship.id === relationshipId);
        return {
          ...node,
          data: {
            ...node.data,
            relationships: node.data.relationships?.map((relationship) =>
              relationship.id === relationshipId ? { ...relationship, ...patch, updatedAt: now } : relationship
            ),
            updatedAt: hasRelationship ? now : node.data.updatedAt
          }
        };
      })
    );
  }, []);

  const addChildNode = useCallback(
    (parentId?: string, explicitType: NodeType = "Notatka") => {
      const parent = nodes.find((node) => node.id === (parentId ?? selectedNodeId));
      const id = `node-${crypto.randomUUID()}`;
      const position = parent
        ? { x: parent.position.x + 260, y: parent.position.y + 170 }
        : { x: 140, y: 140 };
      const node: StoryNode = {
        id,
        type: "storyNode",
        position,
        data: createNodeData("Nowy node", explicitType, parent)
      };

      setNodes((current) => [...current, node]);
      if (parent) {
        setEdges((current) => [
          ...current,
          { id: `edge-${parent.id}-${id}`, source: parent.id, target: id, animated: false }
        ]);
      }
      setSelectedNodeId(id);
    },
    [nodes, selectedNodeId]
  );

  const createChapterNodes = useCallback(
    (sourceNodeId: string, chapters: GeneratedChapter[]) => {
      const source = nodes.find((node) => node.id === sourceNodeId) ?? nodes[0];
      if (!source || chapters.length === 0) return;
      const now = new Date().toISOString();
      const radius = 280;
      const newNodes: StoryNode[] = chapters.map((chapter, index) => {
        const angle = (Math.PI * 2 * index) / Math.max(1, chapters.length);
        const id = `chapter-${crypto.randomUUID()}`;
        return {
          id,
          type: "storyNode",
          position: {
            x: source.position.x + Math.cos(angle) * radius + 120,
            y: source.position.y + Math.sin(angle) * radius + 120
          },
          data: {
            title: `${chapter.number}. ${chapter.title}`,
            type: "Rozdział",
            description: chapter.goal,
            notes: chapter.readerFeeling,
            tags: ["rozdział", "AI fabuła"],
            color: "#263247",
            icon: "book",
            createdAt: now,
            updatedAt: now,
            details: {
              chapterNumber: chapter.number,
              chapterTitle: chapter.title,
              pov: chapter.pov,
              place: chapter.place,
              chapterGoal: chapter.goal,
              plotFunction: chapter.plotFunction,
              emotionalFunction: chapter.emotionalFunction,
              externalConflict: chapter.externalConflict,
              internalConflict: chapter.internalConflict,
              romanticTension: chapter.romanticTension,
              revealedSecret: chapter.revealedSecret,
              openingScene: chapter.openingScene,
              middleScene: chapter.middleScene,
              endingScene: chapter.endingScene,
              cliffhanger: chapter.cliffhanger,
              readerFeeling: chapter.readerFeeling,
              song: chapter.songOrVibe
            },
            images: []
          }
        };
      });
      const newEdges: StoryEdge[] = newNodes.map((node) => ({
        id: `edge-${source.id}-${node.id}`,
        source: source.id,
        target: node.id,
        label: "rozdział"
      }));

      setNodes((current) => [...current, ...newNodes]);
      setEdges((current) => [...current, ...newEdges]);
      setSelectedNodeId(newNodes[0]?.id ?? source.id);
    },
    [nodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      if (nodeId === "root") return;
      const descendants = getDescendantIds(nodeId, edges);
      const idsToRemove = new Set([nodeId, ...descendants]);
      setNodes((current) => current.filter((node) => !idsToRemove.has(node.id)));
      setEdges((current) => current.filter((edge) => !idsToRemove.has(edge.source) && !idsToRemove.has(edge.target)));
      if (idsToRemove.has(selectedNodeId)) setSelectedNodeId("root");
    },
    [edges, selectedNodeId]
  );

  const toggleCollapse = useCallback((nodeId: string) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, collapsed: !node.data.collapsed } } : node
      )
    );
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((current) => addEdge({ ...connection, animated: false }, current));
  }, []);

  const hiddenIds = useMemo(() => {
    const ids = new Set<string>();
    nodes.forEach((node) => {
      if (node.data.collapsed) {
        getDescendantIds(node.id, edges).forEach((id) => ids.add(id));
      }
    });
    return ids;
  }, [edges, nodes]);

  const visibleNodes = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const normalizedTag = tagFilter.toLowerCase().trim();

    const baseNodes = nodes.filter((node) => {
      if (viewMode === "relationships" || viewMode === "characters" || viewMode === "family" || viewMode === "romance") {
        return node.data.type === "Postać";
      }
      if (viewMode === "plot") return ["Fabuła", "Rozdział", "Scena", "Motyw", "Tajemnica"].includes(node.data.type);
      if (viewMode === "timeline") return node.data.type === "Timeline" || node.data.type === "Rozdział" || node.data.type === "Scena";
      if (viewMode === "secrets") return ["Tajemnica", "Sekret"].includes(node.data.type) || node.data.tags.some((tag) => tag.toLowerCase().includes("sekret"));
      if (viewMode === "locations") return node.data.type === "Lokacja" || node.data.type === "Świat";
      return true;
    });

    return baseNodes
      .filter((node) => !hiddenIds.has(node.id))
      .map((node) => ({
        ...node,
        selected: node.id === selectedNodeId,
        data: {
          ...node.data,
          isDimmed:
            Boolean(normalizedSearch || normalizedTag) &&
            !(
              node.data.title.toLowerCase().includes(normalizedSearch) &&
              (normalizedTag === "" || node.data.tags.some((tag) => tag.toLowerCase().includes(normalizedTag)))
            ),
          onAddChild: () => addChildNode(node.id),
          onEdit: () => setSelectedNodeId(node.id),
          onDelete: () => deleteNode(node.id),
          onOpenDetails: () => {
            setSelectedNodeId(node.id);
            if (editMode === "large") setLargeViewOpen(true);
          },
          onToggleCollapse: () => toggleCollapse(node.id)
        }
      }));
  }, [addChildNode, deleteNode, editMode, hiddenIds, nodes, search, selectedNodeId, tagFilter, toggleCollapse, viewMode]);

  const visibleEdges = useMemo(
    () =>
      edges
        .filter((edge) => !hiddenIds.has(edge.source) && !hiddenIds.has(edge.target))
        .filter((edge) => {
          if (viewMode !== "relationships" && viewMode !== "romance" && viewMode !== "family") return true;
          const source = nodes.find((node) => node.id === edge.source);
          const target = nodes.find((node) => node.id === edge.target);
          if (!(source?.data.type === "Postać" && target?.data.type === "Postać")) return false;
          if (viewMode === "romance") {
            return ["partner", "ex", "crush", "love interest", "situationship", "forbidden relationship", "emotionally dependent"].includes(String(edge.label));
          }
          if (viewMode === "family") {
            return ["matka", "ojciec", "córka", "syn", "brat", "siostra", "rodzeństwo", "dziecko"].includes(String(edge.label));
          }
          return true;
        })
        .map((edge) => ({
          ...edge,
          style: { ...(edge.style ?? {}), stroke: relationshipColor(String(edge.label ?? "")) },
          labelStyle: { ...(edge.labelStyle ?? {}), fill: relationshipColor(String(edge.label ?? "")), fontWeight: 600 }
        })),
    [edges, hiddenIds, nodes, viewMode]
  );

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
  const selectedEdgeSource = selectedEdge ? nodes.find((node) => node.id === selectedEdge.source) : null;
  const selectedEdgeTarget = selectedEdge ? nodes.find((node) => node.id === selectedEdge.target) : null;
  const selectedRelationship = selectedEdgeSource?.data.relationships?.find((relationship) => relationship.targetNodeId === selectedEdgeTarget?.id);
  const mapViews = [
    { id: "map", label: "Wszystko", icon: GitBranch },
    { id: "plot", label: "Fabuła", icon: BookOpen },
    { id: "characters", label: "Postacie", icon: UsersRound },
    { id: "relationships", label: "Relacje", icon: Heart },
    { id: "family", label: "Rodzina", icon: UsersRound },
    { id: "timeline", label: "Timeline", icon: Clock3 },
    { id: "romance", label: "Romanse", icon: Heart },
    { id: "secrets", label: "Sekrety", icon: EyeOff },
    { id: "locations", label: "Lokacje", icon: MapPin }
  ] as const;

  const exportMarkdown = () => {
    const markdown = exportProjectToMarkdown(project, nodes, edges);
    downloadTextFile(`${project.title.toLowerCase().replaceAll(" ", "-")}.md`, markdown);
  };

  const allTags = useMemo(() => Array.from(new Set(nodes.flatMap((node) => node.data.tags))).sort(), [nodes]);
  const breadcrumb = useMemo(() => {
    if (!selectedNode) return project.title;
    const incoming = edges.find((edge) => edge.target === selectedNode.id);
    const parent = incoming ? nodes.find((node) => node.id === incoming.source) : null;
    return parent ? `${parent.data.title} / ${selectedNode.data.title}` : selectedNode.data.title;
  }, [edges, nodes, project.title, selectedNode]);

  return (
    <main className="h-screen overflow-hidden bg-paper text-ink transition-colors dark:bg-[#141414] dark:text-paper">
      <div className="flex h-full">
        <aside className="hidden w-72 shrink-0 border-r border-ink/10 bg-porcelain/80 p-4 backdrop-blur-xl dark:border-paper/10 dark:bg-[#1b1b1b]/88 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-ink text-paper dark:bg-paper dark:text-ink">
              <BookOpen size={19} />
            </div>
            <div>
              <p className="text-sm font-semibold">Atlas powieści</p>
              <p className="text-xs text-ink/55 dark:text-paper/55">interaktywna mapa fabuły</p>
            </div>
          </div>

          <label className="mb-3 block text-xs font-medium uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">
            Projekt
          </label>
          <input
            value={project.title}
            onChange={(event) => setProject({ ...project, title: event.target.value, updatedAt: new Date().toISOString() })}
            className="mb-3 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
          />
          <textarea
            value={project.subtitle}
            onChange={(event) => setProject({ ...project, subtitle: event.target.value, updatedAt: new Date().toISOString() })}
            className="mb-6 h-20 w-full resize-none rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
          />

          <div className="space-y-2">
            <ToolbarButton icon={Plus} label="Dodaj node" onClick={() => addChildNode(undefined)} />
            <ToolbarButton icon={FileText} label="Eksport Markdown" onClick={exportMarkdown} />
            <ToolbarButton icon={Download} label="Eksport PDF" onClick={() => window.print()} />
            <ToolbarButton icon={darkMode ? Sun : Moon} label={darkMode ? "Tryb jasny" : "Tryb ciemny"} onClick={() => setDarkMode((value) => !value)} />
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Widoki mapy</p>
            <div className="grid grid-cols-2 gap-2">
              {mapViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setViewMode(view.id)}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition ${
                    viewMode === view.id
                      ? "border-wine bg-wine/5 text-wine"
                      : "border-ink/10 bg-white text-ink/65 hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424] dark:text-paper/65"
                  }`}
                >
                  <view.icon size={14} />
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-ink/10 bg-white p-3 dark:border-paper/10 dark:bg-[#242424]">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Konto</p>
            <div className="space-y-2">
              <p className="truncate text-sm text-ink/70 dark:text-paper/70">{userEmail ?? "Tryb lokalny"}</p>
              {onBackToDashboard && (
                <button onClick={onBackToDashboard} className="w-full rounded-md border border-ink/10 px-3 py-2 text-xs transition hover:border-wine hover:text-wine dark:border-paper/10">
                  Moje projekty
                </button>
              )}
              {onSignOut && (
                <button onClick={onSignOut} className="w-full rounded-md border border-ink/10 px-3 py-2 text-xs transition hover:border-wine hover:text-wine dark:border-paper/10">
                  Wyloguj
                </button>
              )}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-ink/45 dark:text-paper/45">Typy</p>
            <div className="flex flex-wrap gap-2">
              {nodeTypes.slice(0, 12).map((type) => (
                <button
                  key={type}
                  onClick={() => addChildNode(selectedNodeId, type)}
                  className="rounded-full border border-ink/10 px-2.5 py-1 text-xs text-ink/70 transition hover:border-wine hover:text-wine dark:border-paper/10 dark:text-paper/70"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="relative flex min-w-0 flex-1 flex-col">
          <header className="z-20 flex h-16 items-center gap-3 border-b border-ink/10 bg-paper/82 px-4 backdrop-blur-xl dark:border-paper/10 dark:bg-[#141414]/82">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{breadcrumb}</p>
              <p className="text-xs text-ink/45 dark:text-paper/45">
                {viewMode !== "map" ? `Widok: ${mapViews.find((view) => view.id === viewMode)?.label ?? "Mapa"}` : saveState === "saving" ? "Autosave..." : saveState === "saved" ? "Zapisano" : "Gotowe do pisania"}
              </p>
            </div>
            <button
              onClick={() => setViewMode((mode) => (mode === "relationships" ? "map" : "relationships"))}
              className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-sm transition md:flex ${
                viewMode === "relationships"
                  ? "border-wine bg-wine/5 text-wine"
                  : "border-ink/10 bg-white hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424]"
              }`}
            >
              <UsersRound size={16} />
              Mapa relacji
            </button>
            <button
              onClick={() => setViewMode("consistency")}
              className="hidden items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm transition hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424] md:flex"
            >
              <AlertTriangle size={16} />
              Spójność projektu
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 dark:border-paper/10 dark:bg-[#242424] md:flex">
              <Search size={16} className="text-ink/45 dark:text-paper/45" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Szukaj node’ów"
                className="w-48 bg-transparent text-sm outline-none placeholder:text-ink/35 dark:placeholder:text-paper/35"
              />
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 dark:border-paper/10 dark:bg-[#242424] md:flex">
              <Tags size={16} className="text-ink/45 dark:text-paper/45" />
              <input
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                list="tags"
                placeholder="Filtr tagów"
                className="w-36 bg-transparent text-sm outline-none placeholder:text-ink/35 dark:placeholder:text-paper/35"
              />
              <datalist id="tags">
                {allTags.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </div>
            <button
              className="grid size-10 place-items-center rounded-lg border border-ink/10 bg-white transition hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424]"
              onClick={() => setSelectedNodeId("root")}
              aria-label="Pokaż szczegóły projektu"
            >
              <PanelRightClose size={17} />
            </button>
          </header>

          <div className="min-h-0 flex-1">
            <ReactFlow
              nodes={visibleNodes}
              edges={visibleEdges}
              nodeTypes={flowNodeTypes}
              onNodesChange={(changes) => setNodes((current) => applyNodeChanges(changes, current) as StoryNode[])}
              onEdgesChange={(changes) => setEdges((current) => applyEdgeChanges(changes, current))}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              onEdgeClick={(_, edge) => setSelectedEdgeId(edge.id)}
              onNodeDoubleClick={(_, node) => {
                setSelectedNodeId(node.id);
                if (editMode === "large") setLargeViewOpen(true);
              }}
              fitView
              minZoom={0.18}
              maxZoom={1.7}
              proOptions={{ hideAttribution: false }}
            >
              <Background variant={BackgroundVariant.Dots} gap={26} size={1.2} color={darkMode ? "#3a3a3a" : "#d6cec2"} />
              <Controls position="bottom-left" />
              <MiniMap
                position="bottom-right"
                nodeColor={(node) => (node as StoryNode).data.color}
                maskColor={darkMode ? "rgba(20,20,20,.72)" : "rgba(247,242,234,.72)"}
              />
            </ReactFlow>
          </div>
          {viewMode === "relationships" && selectedEdge && selectedEdgeSource && selectedEdgeTarget && (
            <div className="absolute bottom-5 left-1/2 z-30 w-[min(520px,calc(100vw-24px))] -translate-x-1/2 rounded-lg border border-ink/10 bg-porcelain p-4 shadow-soft dark:border-paper/10 dark:bg-[#1b1b1b]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {selectedEdgeSource.data.title} → {selectedEdgeTarget.data.title}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-wine">{String(selectedEdge.label ?? "relacja")}</p>
                </div>
                <button onClick={() => setSelectedEdgeId(null)} className="text-sm text-ink/45 transition hover:text-wine dark:text-paper/45">
                  Zamknij
                </button>
              </div>
              {selectedRelationship && (
                <div className="mt-4">
                  <RelationshipProfilePanel
                    source={selectedEdgeSource}
                    target={selectedEdgeTarget}
                    relationship={selectedRelationship}
                    onUpdate={updateRelationship}
                    onOpenCharacter={(nodeId) => openNode(nodeId, true)}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-y-0 right-0 z-40 w-[min(430px,calc(100vw-16px))] shrink-0 border-l border-ink/10 bg-porcelain shadow-soft dark:border-paper/10 dark:bg-[#1b1b1b] xl:relative xl:block xl:w-[430px]"
            >
              <DetailsSidebar
                node={selectedNode}
                nodes={nodes}
                onAddChild={() => addChildNode(selectedNode.id)}
                onDelete={() => deleteNode(selectedNode.id)}
                onUpdate={updateNode}
                onUpdateDetail={updateNodeDetails}
                onUpdateImages={updateNodeImages}
                editMode={editMode}
                onEditModeChange={changeEditMode}
                onConnectCharacter={connectCharacter}
                onOpenNode={openNode}
                onCreateChapters={createChapterNodes}
                onOpenLarge={() => {
                  changeEditMode("large");
                  setLargeViewOpen(true);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {viewMode === "consistency" && (
            <ProjectConsistencyView
              nodes={nodes}
              edges={edges}
              onBack={() => setViewMode("map")}
              onOpenNode={(nodeId, large) => {
                setViewMode("map");
                openNode(nodeId, large);
              }}
            />
          )}

          {viewMode === "family" && (
            <FamilyView
              nodes={nodes}
              onBack={() => setViewMode("map")}
              onOpenNode={(nodeId, large) => {
                setViewMode("map");
                openNode(nodeId, large);
              }}
            />
          )}

          {selectedNode && largeViewOpen && (
            <NodeDetailLargeView
              node={selectedNode}
              nodes={nodes}
              onBack={() => setLargeViewOpen(false)}
              onSaveAndBack={() => setLargeViewOpen(false)}
              onUpdate={updateNode}
              onUpdateDetail={updateNodeDetails}
              onUpdateImages={updateNodeImages}
              onConnectCharacter={connectCharacter}
              onOpenNode={openNode}
              onCreateChapters={createChapterNodes}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
