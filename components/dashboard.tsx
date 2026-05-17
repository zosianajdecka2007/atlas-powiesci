"use client";

import { BookOpen, LogOut, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createUserProject, listUserProjects } from "@/lib/projects";
import type { BookProject, StoryEdge, StoryNode } from "@/lib/types";

type DashboardProps = {
  email: string | null;
  onOpenProject: (project: BookProject, nodes: StoryNode[], edges: StoryEdge[]) => void;
  onCreateProject: (project: BookProject, nodes: StoryNode[], edges: StoryEdge[]) => void;
  onSignOut: () => void;
};

export function Dashboard({ email, onOpenProject, onCreateProject, onSignOut }: DashboardProps) {
  const [projects, setProjects] = useState<BookProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listUserProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const createProject = async (mode: "empty" | "demo" = "empty") => {
    setCreating(true);
    setError("");
    try {
      const snapshot = await createUserProject(mode === "empty" ? "Nowy projekt książki" : "Projekt demo", mode);
      onCreateProject(snapshot.project, snapshot.nodes, snapshot.edges);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się utworzyć projektu.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper px-5 py-6 text-ink dark:bg-[#141414] dark:text-paper">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-ink text-paper dark:bg-paper dark:text-ink">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Moje projekty</h1>
              <p className="text-sm text-ink/55 dark:text-paper/55">{email}</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm transition hover:border-wine hover:text-wine dark:border-paper/10 dark:bg-[#242424]"
          >
            <LogOut size={16} />
            Wyloguj
          </button>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => createProject("empty")}
            disabled={creating}
            className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-wine disabled:opacity-60 dark:bg-paper dark:text-ink dark:hover:bg-wine dark:hover:text-white"
          >
            <Plus size={16} />
            {creating ? "Tworzę..." : "Stwórz pusty projekt"}
          </button>
          <button
            onClick={() => createProject("demo")}
            disabled={creating}
            className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-sm transition hover:border-wine hover:text-wine disabled:opacity-60 dark:border-paper/10 dark:bg-[#242424]"
          >
            Użyj szablonu demo
          </button>
          <button
            disabled
            className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink/35 dark:border-paper/10 dark:bg-[#242424] dark:text-paper/35"
          >
            Importuj własny projekt
          </button>
        </div>

        {error && <p className="mb-4 rounded-lg border border-wine/20 bg-wine/5 px-3 py-2 text-sm text-wine">{error}</p>}

        {loading ? (
          <p className="text-sm text-ink/55 dark:text-paper/55">Ładowanie projektów...</p>
        ) : projects.length === 0 ? (
          <section className="rounded-lg border border-ink/10 bg-porcelain p-8 text-center dark:border-paper/10 dark:bg-[#1b1b1b]">
            <p className="text-lg font-semibold">Nie masz jeszcze projektu.</p>
            <p className="mt-2 text-sm text-ink/55 dark:text-paper/55">Utwórz pustą mapę książki i zacznij od centralnego node’a.</p>
          </section>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => import("@/lib/projects").then(({ loadProjectSnapshot }) => loadProjectSnapshot(project.id).then((snapshot) => onOpenProject(snapshot.project, snapshot.nodes, snapshot.edges)))}
                className="rounded-lg border border-ink/10 bg-porcelain p-5 text-left transition hover:border-wine hover:shadow-soft dark:border-paper/10 dark:bg-[#1b1b1b]"
              >
                <p className="text-base font-semibold">{project.title}</p>
                <p className="mt-2 line-clamp-2 text-sm text-ink/55 dark:text-paper/55">{project.subtitle}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-ink/40 dark:text-paper/40">Edytowano: {new Date(project.updatedAt).toLocaleString("pl-PL")}</p>
                  <span className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink/60 dark:border-paper/10 dark:text-paper/60">Kontynuuj</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
