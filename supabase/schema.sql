create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  subtitle text default '',
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.story_nodes (
  id text primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  parent_node_id text references public.story_nodes(id) on delete set null,
  title text not null,
  normalized_title text generated always as (lower(regexp_replace(title, '\s+', ' ', 'g'))) stored,
  node_type text not null,
  description text default '',
  notes text default '',
  tags text[] not null default '{}',
  color text not null default '#263247',
  icon text not null default 'note',
  position_x double precision not null default 0,
  position_y double precision not null default 0,
  collapsed boolean not null default false,
  details jsonb not null default '{}',
  images jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index unique_character_title_per_project
on public.story_nodes (project_id, normalized_title)
where node_type = 'Postać';

create table public.story_edges (
  id text primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  source_node_id text not null references public.story_nodes(id) on delete cascade,
  target_node_id text not null references public.story_nodes(id) on delete cascade,
  label text,
  animated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.node_assets (
  id uuid primary key default uuid_generate_v4(),
  node_id text not null references public.story_nodes(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  asset_type text not null check (asset_type in ('image', 'playlist', 'quote', 'file')),
  image_kind text check (image_kind in ('avatar', 'cover', 'gallery', 'moodboard', 'inspiration')),
  title text not null,
  url text,
  storage_path text,
  content text,
  tags text[] not null default '{}',
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.relationships (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  source_character_id text not null references public.story_nodes(id) on delete cascade,
  target_character_id text not null references public.story_nodes(id) on delete cascade,
  relationship_type text not null,
  reverse_relationship_type text,
  trust_level integer check (trust_level between 1 and 10),
  tension_level integer check (tension_level between 1 and 10),
  conflict_level integer check (conflict_level between 1 and 10),
  closeness_level integer check (closeness_level between 1 and 10),
  description text default '',
  secrets text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, source_character_id, target_character_id, relationship_type)
);

create table public.node_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  node_id text not null references public.story_nodes(id) on delete cascade,
  storage_path text,
  url text not null,
  image_kind text not null default 'gallery',
  caption text default '',
  tags text[] not null default '{}',
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.character_life_events (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  character_node_id text not null references public.story_nodes(id) on delete cascade,
  event_type text not null,
  title text not null,
  event_date text,
  description text default '',
  related_node_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  tag_type text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (project_id, tag_type, name)
);

create table public.project_history (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('node-assets', 'node-assets', false)
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.story_nodes enable row level security;
alter table public.story_edges enable row level security;
alter table public.node_assets enable row level security;
alter table public.relationships enable row level security;
alter table public.node_images enable row level security;
alter table public.character_life_events enable row level security;
alter table public.tags enable row level security;
alter table public.project_history enable row level security;

create policy "Users can read own projects" on public.projects
  for select using (auth.uid() = owner_id or auth.uid() = user_id);

create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = owner_id or auth.uid() = user_id);

create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = owner_id or auth.uid() = user_id);

create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = owner_id or auth.uid() = user_id);

create policy "Users can manage own nodes" on public.story_nodes
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = story_nodes.project_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can manage own edges" on public.story_edges
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = story_edges.project_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can manage own assets" on public.node_assets
  for all using (
    exists (
      select 1 from public.story_nodes
      join public.projects on projects.id = story_nodes.project_id
      where story_nodes.id = node_assets.node_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can manage own relationships" on public.relationships
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = relationships.project_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can manage own node images" on public.node_images
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = node_images.project_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can manage own life events" on public.character_life_events
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = character_life_events.project_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can manage own tags" on public.tags
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = tags.project_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can read own history" on public.project_history
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = project_history.project_id
      and (projects.owner_id = auth.uid() or projects.user_id = auth.uid())
    )
  );

create policy "Users can read own node files" on storage.objects
  for select using (
    bucket_id = 'node-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload own node files" on storage.objects
  for insert with check (
    bucket_id = 'node-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_projects_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

create trigger touch_story_nodes_updated_at
before update on public.story_nodes
for each row execute function public.touch_updated_at();

create trigger touch_story_edges_updated_at
before update on public.story_edges
for each row execute function public.touch_updated_at();

create trigger touch_relationships_updated_at
before update on public.relationships
for each row execute function public.touch_updated_at();

create trigger touch_node_images_updated_at
before update on public.node_images
for each row execute function public.touch_updated_at();

create trigger touch_character_life_events_updated_at
before update on public.character_life_events
for each row execute function public.touch_updated_at();
