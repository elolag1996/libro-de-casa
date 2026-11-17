-- Libro de casa · Paso 5
-- Tablas, seguridad por fila (RLS) y protección del original.
-- Se pega entero en el editor SQL de Supabase.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tipos

create type public.origen_receta as enum ('mama', 'abuela', 'tiktok', 'libro', 'mia');
create type public.sitio_despensa as enum ('nevera', 'verdura', 'despensa');
create type public.origen_despensa as enum ('foto', 'manual');

-- ---------------------------------------------------------------- tablas

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  source_type public.origen_receta not null,
  source_url text,
  -- El original. Se escribe una vez y no se toca nunca (ver trigger abajo).
  original_text text not null,
  original_image_path text,
  -- Texto libre a propósito: "para 4 o 5", no un número.
  servings text,
  soak_note text,
  cook_time_note text,
  -- Citas literales de quien la escribió: [{ "texto": "...", "tipo": "compra" }]
  voice_notes jsonb not null default '[]'::jsonb,
  page_number integer,
  created_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position integer not null,
  name text not null,
  -- Nunca un número: "un puñado" se guarda tal cual.
  quantity_text text,
  optional boolean not null default false,
  note text,
  unique (recipe_id, position)
);

create table public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position integer not null,
  text text not null,
  unique (recipe_id, position)
);

create table public.doubts (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position integer not null,
  question text not null,
  -- Fragmento del original que se subraya para señalar la duda.
  anchor_text text,
  answer text,
  answered_at timestamptz,
  unique (recipe_id, position)
);

create table public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  quantity_text text,
  location public.sitio_despensa not null,
  -- Lo que Claude detecta dudoso entra sin confirmar: "¿Queso fresco?"
  confirmed boolean not null default false,
  source public.origen_despensa not null default 'manual',
  created_at timestamptz not null default now()
);

create index recipes_user_id_idx on public.recipes (user_id);
create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients (recipe_id);
create index recipe_steps_recipe_id_idx on public.recipe_steps (recipe_id);
create index doubts_recipe_id_idx on public.doubts (recipe_id);
create index pantry_items_user_id_idx on public.pantry_items (user_id);

-- ------------------------------------------------- el original no se toca

create or replace function public.original_inmutable()
returns trigger
language plpgsql
as $$
begin
  if new.original_text is distinct from old.original_text then
    raise exception 'El original no se toca: original_text es inmutable (receta %)', old.id;
  end if;
  return new;
end;
$$;

create trigger recipes_original_inmutable
  before update on public.recipes
  for each row
  execute function public.original_inmutable();

-- --------------------------------------------- seguridad por fila (RLS)

alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.doubts enable row level security;
alter table public.pantry_items enable row level security;

-- Permisos de tabla. El proyecto se crea con "Automatically expose new
-- tables" desactivado, así que aquí se dice a mano quién toca qué: nada es
-- accesible por descuido. Encima de esto manda la RLS de abajo.
grant select, insert, update, delete on public.recipes to authenticated;
grant select, insert, update, delete on public.recipe_ingredients to authenticated;
grant select, insert, update, delete on public.recipe_steps to authenticated;
grant select, insert, update, delete on public.doubts to authenticated;
grant select, insert, update, delete on public.pantry_items to authenticated;

-- Sin sesión no se entra a nada: se deniega el permiso, no se devuelve vacío.
revoke all on public.recipes from anon;
revoke all on public.recipe_ingredients from anon;
revoke all on public.recipe_steps from anon;
revoke all on public.doubts from anon;
revoke all on public.pantry_items from anon;

-- ¿Esta receta es de quien pregunta?
create or replace function public.es_mi_receta(receta uuid)
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.recipes
    where recipes.id = receta
      and recipes.user_id = (select auth.uid())
  );
$$;

create policy "recipes: ver lo mío" on public.recipes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "recipes: crear lo mío" on public.recipes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "recipes: editar lo mío" on public.recipes
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "recipes: borrar lo mío" on public.recipes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "ingredientes: los de mis recetas" on public.recipe_ingredients
  for all to authenticated using (public.es_mi_receta(recipe_id))
  with check (public.es_mi_receta(recipe_id));

create policy "pasos: los de mis recetas" on public.recipe_steps
  for all to authenticated using (public.es_mi_receta(recipe_id))
  with check (public.es_mi_receta(recipe_id));

create policy "dudas: las de mis recetas" on public.doubts
  for all to authenticated using (public.es_mi_receta(recipe_id))
  with check (public.es_mi_receta(recipe_id));

create policy "despensa: lo mío" on public.pantry_items
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
