import type { Edge, Node } from "@xyflow/react";

export type NodeType =
  | "Postać"
  | "Fabuła"
  | "Rozdział"
  | "Relacja"
  | "Świat"
  | "Motyw"
  | "Tajemnica"
  | "Sekret"
  | "Scena"
  | "Timeline"
  | "Organizacja"
  | "Rodzina"
  | "Lokacja"
  | "Cytat"
  | "Muzyka"
  | "Notatka"
  | "Inne";

export type NodeIcon = "user" | "book" | "sparkles" | "map" | "heart" | "clock" | "home" | "music" | "quote" | "note";

export type DetailValue = string | number | string[];

export type RelationshipType =
  | "matka"
  | "ojciec"
  | "córka"
  | "syn"
  | "brat"
  | "siostra"
  | "rodzeństwo"
  | "dziecko"
  | "partner"
  | "ex"
  | "crush"
  | "przyjaciel"
  | "najlepszy przyjaciel"
  | "wróg"
  | "rywal"
  | "mentor"
  | "znajomy"
  | "członek paczki"
  | "inna relacja";

export type CharacterRelationship = {
  id: string;
  targetNodeId: string;
  targetName: string;
  type: RelationshipType;
  reverseType: RelationshipType;
  trustLevel?: number;
  tensionLevel?: number;
  conflictLevel?: number;
  closenessLevel?: number;
  description?: string;
  secrets?: string;
  importantScenes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type NodeImageKind = "avatar" | "cover" | "gallery" | "moodboard" | "inspiration";

export type NodeImage = {
  id: string;
  url: string;
  storagePath?: string;
  kind: NodeImageKind;
  caption: string;
  tags: string[];
  isPrimary: boolean;
  order: number;
  createdAt: string;
};

export type StoryNodeData = {
  [key: string]: unknown;
  title: string;
  type: NodeType;
  description: string;
  notes: string;
  tags: string[];
  color: string;
  icon: NodeIcon;
  createdAt: string;
  updatedAt: string;
  collapsed?: boolean;
  details: Record<string, DetailValue>;
  images?: NodeImage[];
  relationships?: CharacterRelationship[];
};

export type StoryNode = Node<StoryNodeData, "storyNode">;
export type StoryEdge = Edge;

export type BookProject = {
  id: string;
  title: string;
  subtitle: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};

export type FieldSchema = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "number" | "tags";
  min?: number;
  max?: number;
};

export type SectionSchema = {
  id: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;
  fields: FieldSchema[];
};

export type TabSchema = {
  id: string;
  label: string;
  fields?: FieldSchema[];
  sections?: SectionSchema[];
};
