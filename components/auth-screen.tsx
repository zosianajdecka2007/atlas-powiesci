"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type AuthScreenProps = {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
};

export function AuthScreen({ mode, onModeChange }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setMessage("");
    if (!supabase) {
      setMessage("Dodaj NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY w .env.local.");
      return;
    }
    if (!email || !password) {
      setMessage("Wpisz email i hasło.");
      return;
    }
    if (mode === "register" && password !== repeatPassword) {
      setMessage("Hasła muszą być takie same.");
      return;
    }

    setLoading(true);
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "register") {
      setMessage("Konto utworzone. Jeśli Supabase wymaga potwierdzenia, sprawdź email.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 text-ink dark:bg-[#141414] dark:text-paper">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-porcelain p-6 shadow-soft dark:border-paper/10 dark:bg-[#1b1b1b]">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-ink text-paper dark:bg-paper dark:text-ink">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Atlas powieści</h1>
            <p className="text-sm text-ink/55 dark:text-paper/55">
              {mode === "login" ? "Zaloguj się do swojej mapy książek." : "Utwórz własne konto pisarskie."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-ink/60 dark:text-paper/60">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
            />
          </label>
          <label className="block text-sm font-medium text-ink/60 dark:text-paper/60">
            Hasło
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
            />
          </label>
          {mode === "register" && (
            <label className="block text-sm font-medium text-ink/60 dark:text-paper/60">
              Powtórz hasło
              <input
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
                type="password"
                className="mt-1 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 outline-none focus:border-wine dark:border-paper/10 dark:bg-[#242424]"
              />
            </label>
          )}
        </div>

        {message && <p className="mt-4 rounded-lg border border-wine/20 bg-wine/5 px-3 py-2 text-sm text-wine">{message}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-wine disabled:opacity-60 dark:bg-paper dark:text-ink dark:hover:bg-wine dark:hover:text-white"
        >
          {loading ? "Chwila..." : mode === "login" ? "Zaloguj" : "Utwórz konto"}
        </button>

        <button
          onClick={() => onModeChange(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-sm text-ink/55 transition hover:text-wine dark:text-paper/55"
        >
          {mode === "login" ? "Nie masz konta? Zarejestruj się" : "Masz konto? Zaloguj się"}
        </button>
      </section>
    </main>
  );
}
