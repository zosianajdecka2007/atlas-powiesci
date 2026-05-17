import type { CharacterRelationship, RelationshipType, StoryNode } from "@/lib/types";

export const relationshipTypes: RelationshipType[] = [
  "matka",
  "ojciec",
  "córka",
  "syn",
  "brat",
  "siostra",
  "rodzeństwo",
  "dziecko",
  "partner",
  "ex",
  "crush",
  "przyjaciel",
  "najlepszy przyjaciel",
  "wróg",
  "rywal",
  "mentor",
  "znajomy",
  "członek paczki",
  "inna relacja"
];

const reverseMap: Record<RelationshipType, RelationshipType> = {
  matka: "dziecko",
  ojciec: "dziecko",
  córka: "dziecko",
  syn: "dziecko",
  brat: "rodzeństwo",
  siostra: "rodzeństwo",
  rodzeństwo: "rodzeństwo",
  dziecko: "inna relacja",
  partner: "partner",
  ex: "ex",
  crush: "crush",
  przyjaciel: "przyjaciel",
  "najlepszy przyjaciel": "najlepszy przyjaciel",
  wróg: "wróg",
  rywal: "rywal",
  mentor: "inna relacja",
  znajomy: "znajomy",
  "członek paczki": "członek paczki",
  "inna relacja": "inna relacja"
};

export function getReverseRelationshipType(type: RelationshipType): RelationshipType {
  return reverseMap[type] ?? "inna relacja";
}

export function normalizePersonName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function findSimilarCharacters(nodes: StoryNode[], name: string) {
  const normalized = normalizePersonName(name);
  if (!normalized) return [];

  return nodes
    .filter((node) => node.data.type === "Postać")
    .filter((node) => {
      const title = normalizePersonName(node.data.title);
      const firstName = normalizePersonName(String(node.data.details.firstName ?? ""));
      const lastName = normalizePersonName(String(node.data.details.lastName ?? ""));
      const fullName = normalizePersonName(`${firstName} ${lastName}`);
      return title === normalized || fullName === normalized || title.includes(normalized) || normalized.includes(title);
    });
}

export function makeRelationship(
  targetNode: StoryNode,
  type: RelationshipType,
  reverseType = getReverseRelationshipType(type)
): CharacterRelationship {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    targetNodeId: targetNode.id,
    targetName: targetNode.data.title,
    type,
    reverseType,
    trustLevel: 5,
    tensionLevel: 1,
    conflictLevel: 1,
    closenessLevel: 5,
    createdAt: now,
    updatedAt: now
  };
}

export function relationshipColor(type?: string) {
  if (!type) return "#6b7280";
  if (["matka", "ojciec", "córka", "syn", "brat", "siostra", "rodzeństwo", "dziecko"].includes(type)) return "#263247";
  if (["partner", "ex", "crush"].includes(type)) return "#8f3147";
  if (["przyjaciel", "najlepszy przyjaciel", "członek paczki", "znajomy"].includes(type)) return "#6f7f72";
  if (["wróg", "rywal"].includes(type)) return "#b91c1c";
  if (["mentor"].includes(type)) return "#7c3f58";
  return "#6b7280";
}
