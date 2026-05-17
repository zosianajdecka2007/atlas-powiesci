-- Replace this value with an existing auth.users.id before running.
with owner as (
  select '00000000-0000-0000-0000-000000000000'::uuid as id
),
project_insert as (
  insert into public.projects (id, owner_id, user_id, title, subtitle)
  select
    '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842'::uuid,
    owner.id,
    owner.id,
    'Tam, gdzie rozsądek przegrał z nami',
    'Mapa trylogii, relacji i emocjonalnych punktów zwrotnych'
  from owner
  on conflict (id) do update
    set title = excluded.title,
        subtitle = excluded.subtitle
  returning id
)
insert into public.story_nodes (
  id,
  project_id,
  user_id,
  title,
  node_type,
  description,
  notes,
  tags,
  color,
  icon,
  position_x,
  position_y,
  details
)
values
  ('root', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Tam, gdzie rozsądek przegrał z nami', 'Fabuła', 'Centralny projekt książki / trylogii.', 'Główny hub dla tomów, postaci, relacji, lokacji i osi czasu.', array['trylogia','romans','drama'], '#263247', 'book', 0, 0, '{"summary":"Historia o napięciu, wyborach i tym, co zostaje po przekroczeniu granicy rozsądku."}'::jsonb),
  ('leah', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Leah Carter', 'Postać', 'Bohaterka balansująca między kontrolą a pragnieniem wolności.', '', array['protagonistka','sekret'], '#8f3147', 'user', -430, -190, '{"firstName":"Leah","lastName":"Carter","age":22}'::jsonb),
  ('leo', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Leonardo Moretti', 'Postać', 'Postać magnetyczna, spokojna na zewnątrz, niebezpiecznie pamiętliwa.', '', array['love interest','tajemnica'], '#263247', 'user', 420, -180, '{"firstName":"Leonardo","lastName":"Moretti","nicknames":["Leo"]}'::jsonb),
  ('mia', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Mia Anderson', 'Postać', 'Najbliższa przyjaciółka, która widzi więcej, niż mówi.', '', array['przyjaźń','wsparcie'], '#6f7f72', 'user', -430, 110, '{"firstName":"Mia","lastName":"Anderson"}'::jsonb),
  ('nate', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Nate Reed', 'Postać', 'Dawny znajomy, potencjalny katalizator konfliktu.', '', array['konflikt','przeszłość'], '#b58145', 'user', 425, 120, '{"firstName":"Nate","lastName":"Reed"}'::jsonb),
  ('relationship-leah-leo', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Relacja Leah & Leo', 'Relacja', 'Relacja oparta na chemii, niedopowiedzeniach i wzajemnym testowaniu granic.', '', array['romans','napięcie'], '#8f3147', 'heart', 0, -330, '{"relationType":"romantyczna / konfliktowa","trustLevel":4,"tensionLevel":9,"obsessionLevel":7,"jealousyLevel":6}'::jsonb),
  ('volume-one', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Tom 1', 'Rozdział', 'Pierwszy tom jako główna gałąź fabularna.', '', array['tom','początek'], '#263247', 'book', 0, 300, '{"chapterNumber":1,"chapterTitle":"Powrót nad jezioro","pov":"Leah"}'::jsonb),
  ('lake-house', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', '00000000-0000-0000-0000-000000000000', 'Dom nad jeziorem', 'Lokacja', 'Miejsce wspomnień, sekretów i powracających decyzji.', '', array['lokacja','symbol'], '#315a70', 'home', -40, 560, '{"summary":"Stary dom z werandą, zapachem deszczu i pokojami, które pamiętają więcej niż bohaterowie."}'::jsonb)
on conflict (id) do update
set title = excluded.title,
    node_type = excluded.node_type,
    description = excluded.description,
    tags = excluded.tags,
    details = excluded.details;

insert into public.story_edges (id, project_id, source_node_id, target_node_id, animated)
values
  ('root-leah', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'root', 'leah', true),
  ('root-leo', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'root', 'leo', true),
  ('root-mia', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'root', 'mia', false),
  ('root-nate', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'root', 'nate', false),
  ('root-relation', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'root', 'relationship-leah-leo', true),
  ('leah-relation', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'leah', 'relationship-leah-leo', false),
  ('leo-relation', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'leo', 'relationship-leah-leo', false),
  ('root-volume-one', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'root', 'volume-one', false),
  ('volume-one-lake-house', '2d0d8e7f-36b9-41b7-9a1d-fd5f031a2842', 'volume-one', 'lake-house', false)
on conflict (id) do update
set source_node_id = excluded.source_node_id,
    target_node_id = excluded.target_node_id,
    animated = excluded.animated;
