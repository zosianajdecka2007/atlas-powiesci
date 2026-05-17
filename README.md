# Atlas powieści

Nowoczesna aplikacja webowa dla pisarzy do budowania książek, trylogii, postaci, relacji i fabuły jako interaktywnej mapy myśli.

## Stack

- Next.js + React + TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- React Flow do mapy node’ów
- Framer Motion do spokojnych animacji UI

## Struktura

```txt
app/
  layout.tsx          globalny layout
  page.tsx            pierwszy widok aplikacji
components/
  book-workspace.tsx  główny ekran roboczy z React Flow
  story-node-card.tsx własny node z menu akcji
  details-sidebar.tsx panel szczegółów node’a
  field-editor.tsx    dynamiczne pola formularzy
lib/
  node-schema.ts      typy node’ów i układy pól
  seed-data.ts        projekt startowy
  autosave.ts         autosave localStorage + Supabase
  supabase.ts         klient Supabase
  export.ts           eksport Markdown / PDF przez print
supabase/
  schema.sql          struktura bazy, RLS, relacje
  seed.sql            przykładowy projekt i node’y
```

## Uruchomienie

```bash
npm install
npm run dev
```

Skopiuj `.env.example` do `.env.local` i uzupełnij:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Bez zmiennych Supabase aplikacja działa lokalnie i zapisuje projekt w `localStorage`.

## Supabase

1. Uruchom `supabase/schema.sql` w SQL editorze Supabase.
2. Włącz Email Auth lub innego providera.
3. Opcjonalnie uruchom `supabase/seed.sql`, podstawiając `owner_id` aktywnego użytkownika.

Autosave zapisuje projekty, node’y i połączenia. Zdjęcia, playlisty, cytaty i pliki mają przygotowaną tabelę `node_assets`; obrazy można przechowywać w bucket `node-assets`.
