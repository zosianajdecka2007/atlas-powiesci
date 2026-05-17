"use client";

import { useEffect, useState } from "react";
import { AuthScreen } from "@/components/auth-screen";
import { BookWorkspace } from "@/components/book-workspace";
import { Dashboard } from "@/components/dashboard";
import { supabase } from "@/lib/supabase";
import type { BookProject, StoryEdge, StoryNode } from "@/lib/types";

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      window.setTimeout(() => resolve(null as T), ms);
    })
  ]);
}

export default function Page() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);
  const [activeSnapshot, setActiveSnapshot] = useState<{
    project: BookProject;
    nodes: StoryNode[];
    edges: StoryEdge[];
  } | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    withTimeout(supabase.auth.getSession(), 5000)
      .then((result) => {
        setSessionEmail(result?.data?.session?.user.email ?? null);
      })
      .catch(() => {
        setSessionEmail(null);
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSessionEmail(session?.user.email ?? null);
      if (!session) setActiveSnapshot(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-paper text-sm text-ink/55">Ładowanie...</main>;
  }

  if (!sessionEmail) {
    return <AuthScreen mode={authMode} onModeChange={setAuthMode} />;
  }

  if (!activeSnapshot) {
    return (
      <Dashboard
        email={sessionEmail}
        onOpenProject={(project, nodes, edges) => setActiveSnapshot({ project, nodes, edges })}
        onCreateProject={(project, nodes, edges) => setActiveSnapshot({ project, nodes, edges })}
        onSignOut={() => supabase?.auth.signOut()}
      />
    );
  }

  return (
    <BookWorkspace
      initialProject={activeSnapshot.project}
      initialNodes={activeSnapshot.nodes}
      initialEdges={activeSnapshot.edges}
      userEmail={sessionEmail}
      onBackToDashboard={() => setActiveSnapshot(null)}
      onSignOut={() => supabase?.auth.signOut()}
    />
  );
}
