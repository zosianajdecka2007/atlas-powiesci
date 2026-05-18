import type { BookProject, StoryEdge, StoryNode } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const storageKey = "atlas-powiesci-project";

export type PersistedProject = {
  project: BookProject;
  nodes: StoryNode[];
  edges: StoryEdge[];
};

export function loadLocalProject() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedProject;
  } catch {
    return null;
  }
}

export async function autosaveProject(payload: PersistedProject) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }

  if (!supabase) return { mode: "local" as const };

  const {
    data: { user }
  } = await supabase.auth.getUser();

  await supabase.from("projects").upsert({
    id: payload.project.id,
    owner_id: user?.id,
    user_id: user?.id,
    title: payload.project.title,
    subtitle: payload.project.subtitle,
    updated_at: new Date().toISOString()
  });

  const [{ data: storedNodes }, { data: storedEdges }] = await Promise.all([
    supabase.from("story_nodes").select("id").eq("project_id", payload.project.id),
    supabase.from("story_edges").select("id").eq("project_id", payload.project.id)
  ]);

  const nodeIds = new Set(payload.nodes.map((node) => node.id));
  const edgeIds = new Set(payload.edges.map((edge) => edge.id));
  const staleNodeIds = (storedNodes ?? []).map((node) => node.id).filter((id) => !nodeIds.has(id));
  const staleEdgeIds = (storedEdges ?? []).map((edge) => edge.id).filter((id) => !edgeIds.has(id));

  if (staleEdgeIds.length > 0) {
    await supabase.from("story_edges").delete().in("id", staleEdgeIds);
  }

  if (staleNodeIds.length > 0) {
    await supabase.from("story_nodes").delete().in("id", staleNodeIds);
  }

  await supabase.from("story_nodes").upsert(
    payload.nodes.map((node) => ({
      id: node.id,
      project_id: payload.project.id,
      user_id: user?.id,
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

  const imageRows = payload.nodes.flatMap((node) =>
    (node.data.images ?? []).map((image) => ({
      id: image.id,
      node_id: node.id,
      project_id: payload.project.id,
      user_id: user?.id,
      asset_type: "image",
      image_kind: image.kind,
      title: image.caption || node.data.title,
      url: image.url,
      storage_path: image.storagePath ?? null,
      content: image.caption,
      tags: image.tags,
      is_primary: image.isPrimary,
      sort_order: image.order,
      created_at: image.createdAt
    }))
  );

  const { data: storedAssets } = await supabase
    .from("node_assets")
    .select("id")
    .in("node_id", payload.nodes.map((node) => node.id));
  const imageIds = new Set(imageRows.map((image) => image.id));
  const staleAssetIds = (storedAssets ?? []).map((asset) => asset.id).filter((id) => !imageIds.has(id));

  if (staleAssetIds.length > 0) {
    await supabase.from("node_assets").delete().in("id", staleAssetIds);
  }

  if (imageRows.length > 0) {
    await supabase.from("node_assets").upsert(imageRows);
    await supabase.from("node_images").upsert(
      imageRows.map((image) => ({
        id: image.id,
        project_id: image.project_id,
        user_id: image.user_id,
        node_id: image.node_id,
        storage_path: image.storage_path,
        url: image.url,
        image_kind: image.image_kind,
        caption: image.content,
        tags: image.tags,
        is_primary: image.is_primary,
        sort_order: image.sort_order
      }))
    );
  }

  const relationshipRows = payload.nodes.flatMap((node) =>
    (node.data.relationships ?? []).map((relationship) => ({
      id: relationship.id,
      project_id: payload.project.id,
      user_id: user?.id,
      source_character_id: node.id,
      target_character_id: relationship.targetNodeId,
      relationship_type: relationship.type,
      reverse_relationship_type: relationship.reverseType,
      trust_level: relationship.trustLevel ?? null,
      tension_level: relationship.tensionLevel ?? null,
      conflict_level: relationship.conflictLevel ?? null,
      closeness_level: relationship.closenessLevel ?? null,
      jealousy_level: relationship.jealousyLevel ?? null,
      safety_level: relationship.safetyLevel ?? null,
      dependency_level: relationship.dependencyLevel ?? null,
      obsession_level: relationship.obsessionLevel ?? null,
      power_dynamic: relationship.powerDynamic ?? "",
      description: relationship.description ?? "",
      secrets: relationship.secrets ?? "",
      notes: relationship.notes ?? "",
      important_scenes: relationship.importantScenes ?? "",
      timeline: relationship.timeline ?? []
    }))
  );

  if (relationshipRows.length > 0) {
    await supabase.from("relationships").upsert(relationshipRows);
  }

  await supabase.from("story_edges").upsert(
    payload.edges.map((edge) => ({
      id: edge.id,
      project_id: payload.project.id,
      user_id: user?.id,
      source_node_id: edge.source,
      target_node_id: edge.target,
      label: edge.label ?? null,
      animated: edge.animated ?? false
    }))
  );

  return { mode: "supabase" as const };
}
