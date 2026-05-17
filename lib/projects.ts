import { seedEdges, seedNodes } from "@/lib/seed-data";
import { supabase } from "@/lib/supabase";
import type { BookProject, StoryEdge, StoryNode } from "@/lib/types";

export async function listUserProjects() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("id,title,subtitle,owner_id,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((project) => ({
    id: project.id,
    title: project.title,
    subtitle: project.subtitle ?? "",
    ownerId: project.owner_id,
    createdAt: project.created_at,
    updatedAt: project.updated_at
  })) satisfies BookProject[];
}

function createEmptyProjectNodes(projectId: string, title: string) {
  const now = new Date().toISOString();
  const rootId = `${projectId}-root`;
  const nodes: StoryNode[] = [
    {
      id: rootId,
      type: "storyNode",
      position: { x: 0, y: 0 },
      data: {
        title,
        type: "Fabuła",
        description: "",
        notes: "",
        tags: [],
        color: "#263247",
        icon: "book",
        createdAt: now,
        updatedAt: now,
        details: {},
        images: [],
        relationships: []
      }
    }
  ];
  return { nodes, edges: [] as StoryEdge[] };
}

function createDemoProjectNodes(projectId: string, title: string) {
  const now = new Date().toISOString();
  const neutralNodes = seedNodes.map((node, index) => ({
    ...node,
    id: `${projectId}-${node.id}`,
    data: {
      ...node.data,
      title: node.id === "root" ? title : node.data.type === "Postać" ? `Postać ${index}` : node.data.type === "Relacja" ? "Relacja 1" : node.data.title,
      description: "",
      notes: "",
      details: {},
      images: [],
      relationships: [],
      createdAt: now,
      updatedAt: now
    }
  }));
  const edges = seedEdges.map((edge) => ({
    ...edge,
    id: `${projectId}-${edge.id}`,
    source: `${projectId}-${edge.source}`,
    target: `${projectId}-${edge.target}`,
    label: undefined
  }));
  return { nodes: neutralNodes, edges };
}

export async function createUserProject(title = "Nowy projekt książki", mode: "empty" | "demo" = "empty") {
  if (!supabase) throw new Error("Brak konfiguracji Supabase.");

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Musisz być zalogowana/zalogowany.");

  const projectId = crypto.randomUUID();
  const now = new Date().toISOString();
  const project: BookProject = {
    id: projectId,
    title,
    subtitle: "Nowa mapa fabuły, postaci i relacji",
    ownerId: user.id,
    createdAt: now,
    updatedAt: now
  };

  await supabase.from("projects").insert({
    id: project.id,
    owner_id: user.id,
    user_id: user.id,
    title: project.title,
    subtitle: project.subtitle
  });

  const { nodes, edges } = mode === "demo" ? createDemoProjectNodes(projectId, title) : createEmptyProjectNodes(projectId, title);

  await saveProjectSnapshot(project, nodes, edges);

  return { project, nodes, edges };
}

export async function loadProjectSnapshot(projectId: string) {
  if (!supabase) throw new Error("Brak konfiguracji Supabase.");

  const [{ data: project, error: projectError }, { data: nodeRows, error: nodeError }, { data: edgeRows, error: edgeError }] =
    await Promise.all([
      supabase.from("projects").select("id,title,subtitle,owner_id,created_at,updated_at").eq("id", projectId).single(),
      supabase.from("story_nodes").select("*").eq("project_id", projectId),
      supabase.from("story_edges").select("*").eq("project_id", projectId)
    ]);

  if (projectError) throw projectError;
  if (nodeError) throw nodeError;
  if (edgeError) throw edgeError;

  const mappedProject: BookProject = {
    id: project.id,
    title: project.title,
    subtitle: project.subtitle ?? "",
    ownerId: project.owner_id,
    createdAt: project.created_at,
    updatedAt: project.updated_at
  };

  const nodes: StoryNode[] = (nodeRows ?? []).map((node) => ({
    id: node.id,
    type: "storyNode",
    position: { x: node.position_x, y: node.position_y },
    data: {
      title: node.title,
      type: node.node_type,
      description: node.description ?? "",
      notes: node.notes ?? "",
      tags: node.tags ?? [],
      color: node.color ?? "#263247",
      icon: node.icon ?? "note",
      collapsed: node.collapsed ?? false,
      details: node.details ?? {},
      images: node.images ?? [],
      createdAt: node.created_at,
      updatedAt: node.updated_at
    }
  }));

  const edges: StoryEdge[] = (edgeRows ?? []).map((edge) => ({
    id: edge.id,
    source: edge.source_node_id,
    target: edge.target_node_id,
    label: edge.label ?? undefined,
    animated: edge.animated ?? false
  }));

  return { project: mappedProject, nodes, edges };
}

export async function saveProjectSnapshot(project: BookProject, nodes: StoryNode[], edges: StoryEdge[]) {
  if (!supabase) return;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("story_nodes").upsert(
    nodes.map((node) => ({
      id: node.id,
      project_id: project.id,
      user_id: user.id,
      title: node.data.title,
      node_type: node.data.type,
      description: node.data.description,
      notes: node.data.notes,
      tags: node.data.tags,
      color: node.data.color,
      icon: node.data.icon,
      position_x: node.position.x,
      position_y: node.position.y,
      collapsed: node.data.collapsed ?? false,
      details: node.data.details,
      images: node.data.images ?? [],
      updated_at: node.data.updatedAt
    }))
  );

  await supabase.from("story_edges").upsert(
    edges.map((edge) => ({
      id: edge.id,
      project_id: project.id,
      user_id: user.id,
      source_node_id: edge.source,
      target_node_id: edge.target,
      label: edge.label ?? null,
      animated: edge.animated ?? false
    }))
  );
}
