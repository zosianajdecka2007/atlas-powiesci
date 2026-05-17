import type { BookProject, StoryEdge, StoryNode } from "@/lib/types";

export function exportProjectToMarkdown(project: BookProject, nodes: StoryNode[], edges: StoryEdge[]) {
  const lines = [
    `# ${project.title}`,
    "",
    project.subtitle,
    "",
    "## Node'y",
    ""
  ];

  for (const node of nodes) {
    lines.push(`### ${node.data.title}`);
    lines.push(`- Typ: ${node.data.type}`);
    lines.push(`- Tagi: ${node.data.tags.join(", ") || "brak"}`);
    lines.push(`- Opis: ${node.data.description || "brak"}`);
    lines.push(`- Utworzono: ${new Date(node.data.createdAt).toLocaleString("pl-PL")}`);
    lines.push("");
    if (node.data.notes) {
      lines.push(node.data.notes);
      lines.push("");
    }
  }

  lines.push("## Połączenia", "");
  for (const edge of edges) {
    const source = nodes.find((node) => node.id === edge.source)?.data.title ?? edge.source;
    const target = nodes.find((node) => node.id === edge.target)?.data.title ?? edge.target;
    lines.push(`- ${source} -> ${target}`);
  }

  return lines.join("\n");
}

export function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
