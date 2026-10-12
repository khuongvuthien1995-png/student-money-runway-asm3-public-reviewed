-- Student Money Runway — ASM3 P1
-- Initial financial schema, least-privilege grants, RLS policies and atomic purchase RPC.
-- Apply only to the student-owned `student-money-runway-asm3-dev` Supabase project after review.

begin;

create extension if not exists pgcrypto;

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  planning_date date not null,
  available_funds_cents bigint not null check (available_funds_cents between 0 and 100000000),
  safety_buffer_cents bigint not null check (safety_buffer_cents between 0 and 100000000),
  fixed_essentials_cents bigint not null check (fixed_essentials_cents between 0 and 100000000),
  flexible_essentials_cents bigint not null check (flexible_essentials_cents between 0 and 100000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plans_user_id_key unique (user_id),
  -- Required by the child composite ownership foreign key, even though id is already the primary key.
  constraint plans_id_user_id_key unique (id, user_id)
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 120),
  amount_cents bigint not null check (amount_cents between 1 and 100000000),
  idempotency_key uuid not null unique,
  created_at timestamptz not null default now(),
  -- A purchase can only name a plan owned by the same Auth user.
  constraint purchases_plan_user_id_fkey
    foreign key (plan_id, user_id)
    references public.plans (id, user_id)
    on delete cascade
);

create index purchases_plan_created_at_idx on public.purchases (plan_id, created_at desc);
create index purchases_user_created_at_idx on public.purchases (user_id, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

alter table public.plans enable row level security;
alter table public.purchases enable row level security;

-- RLS remains defense in depth. Financial data mutations are intentionally routed through FastAPI,
-- whose server credential bypasses RLS and must therefore enforce verified-user ownership itself.
create policy plans_select_own on public.plans
  for select to authenticated using (user_id = auth.uid());
create policy plans_insert_own on public.plans
  for insert to authenticated with check (user_id = auth.uid());
create policy plans_update_own on public.plans
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy purchases_select_own on public.purchases
  for select to authenticated using (user_id = auth.uid());
create policy purchases_insert_own_plan on public.purchases
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.plans
      where plans.id = purchases.plan_id and plans.user_id = auth.uid()
    )
  );

-- Do not grant browser roles direct table access. The policies above protect future deliberately
-- scoped user-token access; the intended product path is FastAPI only.
revoke all on table public.plans from public, anon, authenticated;
revoke all on table public.purchases from public, anon, authenticated;
grant select, insert, update, delete on table public.plans to service_role;
grant select, insert, update, delete on table public.purchases to service_role;

create function public.confirm_purchase(
  p_user_id uuid,
  p_name text,
  p_amount_cents bigint,
  p_idempotency_key uuid
)
returns table (
  purchase_id uuid,
  purchase_name text,
  purchase_amount_cents bigint,
  purchase_created_at timestamptz,
  plan_id uuid,
  plan_user_id uuid,
  planning_date date,
  available_funds_cents bigint,
  safety_buffer_cents bigint,
  fixed_essentials_cents bigint,
  flexible_essentials_cents bigint,
  plan_created_at timestamptz,
  plan_updated_at timestamptz,
  replayed boolean
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_name text := btrim(p_name);
  v_purchase public.purchases%rowtype;
  v_plan public.plans%rowtype;
  v_protected_total bigint;
  v_runway bigint;
  v_is_replay boolean := false;
begin
  if p_user_id is null then
    raise exception using errcode = 'P0001', message = 'AUTHENTICATED_USER_REQUIRED';
  end if;
  if p_idempotency_key is null then
    raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_KEY_REQUIRED';
  end if;
  if v_name is null or length(v_name) not between 1 and 120 then
    raise exception using errcode = 'P0001', message = 'PURCHASE_NAME_INVALID';
  end if;
  if p_amount_cents is null or p_amount_cents not between 1 and 100000000 then
    raise exception using errcode = 'P0001', message = 'PURCHASE_AMOUNT_INVALID';
  end if;

  -- Serializes duplicate keys before the unique constraint is reached and makes retry semantics stable.
  perform pg_advisory_xact_lock(hashtextextended(p_idempotency_key::text, 0));

  select * into v_purchase
  from public.purchases
  where idempotency_key = p_idempotency_key;

  if found then
    if v_purchase.user_id <> p_user_id
      or v_purchase.name <> v_name
      or v_purchase.amount_cents <> p_amount_cents then
      raise exception using errcode = 'P0001', message = 'IDEMPOTENCY_KEY_REUSED';
    end if;
    v_is_replay := true;
    select * into v_plan from public.plans where id = v_purchase.plan_id for update;
    if not found or v_plan.user_id <> p_user_id then
      raise exception using errcode = 'P0001', message = 'PLAN_OWNERSHIP_MISMATCH';
    end if;
  else
    -- The per-plan row lock serializes distinct concurrent purchase attempts for one user.
    select * into v_plan from public.plans where user_id = p_user_id for update;
    if not found then
      raise exception using errcode = 'P0001', message = 'PLAN_NOT_FOUND';
    end if;

    v_protected_total := v_plan.fixed_essentials_cents
      + v_plan.flexible_essentials_cents
      + v_plan.safety_buffer_cents;
    v_runway := greatest(0::bigint, v_plan.available_funds_cents - v_protected_total);
    if p_amount_cents > v_runway then
      raise exception using errcode = 'P0001', message = 'PURCHASE_EXCEEDS_RUNWAY';
    end if;

    insert into public.purchases (plan_id, user_id, name, amount_cents, idempotency_key)
    values (v_plan.id, p_user_id, v_name, p_amount_cents, p_idempotency_key)
    returning * into v_purchase;

    -- The function's RETURN TABLE columns are PL/pgSQL variables. Qualify table reads and
    -- RETURNING to avoid ambiguity with the available_funds_cents output variable.
    update public.plans as plan
    set available_funds_cents = plan.available_funds_cents - p_amount_cents
    where plan.id = v_plan.id
    returning plan.* into v_plan;
  end if;

  return query
  select v_purchase.id, v_purchase.name, v_purchase.amount_cents, v_purchase.created_at,
    v_plan.id, v_plan.user_id, v_plan.planning_date, v_plan.available_funds_cents,
    v_plan.safety_buffer_cents, v_plan.fixed_essentials_cents, v_plan.flexible_essentials_cents,
    v_plan.created_at, v_plan.updated_at, v_is_replay;
end;
$$;

-- SECURITY DEFINER means callers must be deliberately restricted. Only the backend's service role
-- may invoke this function after it has verified the bearer token and derived p_user_id.
revoke all on function public.set_updated_at() from public;
revoke all on function public.confirm_purchase(uuid, text, bigint, uuid) from public, anon, authenticated;
grant execute on function public.confirm_purchase(uuid, text, bigint, uuid) to service_role;

comment on function public.confirm_purchase(uuid, text, bigint, uuid) is
  'Backend-only atomic confirmation. Caller must supply only a FastAPI-verified auth.users id.';

commit;
