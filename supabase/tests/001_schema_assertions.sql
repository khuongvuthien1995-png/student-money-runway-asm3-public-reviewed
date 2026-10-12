-- Read-only P1 schema/security assertions. Run after the migration in Supabase SQL Editor.
-- This script creates no financial rows, makes no DDL/DML changes and rolls back its transaction.
begin;

do $$
declare
  v_plan_id_attnum smallint;
  v_plan_user_id_attnum smallint;
  v_purchase_plan_id_attnum smallint;
  v_purchase_user_id_attnum smallint;
  v_purchase_idempotency_key_attnum smallint;
  v_column text;
begin
  if to_regclass('public.plans') is null or to_regclass('public.purchases') is null then
    raise exception 'P1 tables are missing';
  end if;
  if not exists (
    select 1 from pg_class where oid = 'public.plans'::regclass and relrowsecurity
  ) or not exists (
    select 1 from pg_class where oid = 'public.purchases'::regclass and relrowsecurity
  ) then
    raise exception 'RLS is not enabled on every financial table';
  end if;
  if not exists (
    select 1 from pg_proc where oid = 'public.confirm_purchase(uuid,text,bigint,uuid)'::regprocedure
  ) then
    raise exception 'confirm_purchase RPC is missing';
  end if;

  select attnum into v_plan_id_attnum
  from pg_attribute
  where attrelid = 'public.plans'::regclass and attname = 'id' and not attisdropped;
  select attnum into v_plan_user_id_attnum
  from pg_attribute
  where attrelid = 'public.plans'::regclass and attname = 'user_id' and not attisdropped;
  select attnum into v_purchase_plan_id_attnum
  from pg_attribute
  where attrelid = 'public.purchases'::regclass and attname = 'plan_id' and not attisdropped;
  select attnum into v_purchase_user_id_attnum
  from pg_attribute
  where attrelid = 'public.purchases'::regclass and attname = 'user_id' and not attisdropped;
  select attnum into v_purchase_idempotency_key_attnum
  from pg_attribute
  where attrelid = 'public.purchases'::regclass and attname = 'idempotency_key' and not attisdropped;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plans'::regclass
      and contype = 'u'
      and conkey = array[v_plan_id_attnum, v_plan_user_id_attnum]
  ) then
    raise exception 'plans(id, user_id) unique constraint is missing';
  end if;
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plans'::regclass
      and contype = 'u'
      and conkey = array[v_plan_user_id_attnum]
  ) then
    raise exception 'plans(user_id) one-plan-per-user constraint is missing';
  end if;
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.purchases'::regclass
      and contype = 'u'
      and conkey = array[v_purchase_idempotency_key_attnum]
  ) then
    raise exception 'purchases(idempotency_key) unique constraint is missing';
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.purchases'::regclass
      and contype = 'f'
      and confrelid = 'public.plans'::regclass
      and conkey = array[v_purchase_plan_id_attnum, v_purchase_user_id_attnum]
      and confkey = array[v_plan_id_attnum, v_plan_user_id_attnum]
      and confdeltype = 'c'
  ) then
    raise exception 'purchases(plan_id, user_id) ownership foreign key with cascade is missing';
  end if;
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plans'::regclass
      and contype = 'f'
      and confrelid = 'auth.users'::regclass
      and conkey = array[v_plan_user_id_attnum]
      and confdeltype = 'c'
  ) then
    raise exception 'plans(user_id) auth-user cascade foreign key is missing';
  end if;
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.purchases'::regclass
      and contype = 'f'
      and confrelid = 'auth.users'::regclass
      and conkey = array[v_purchase_user_id_attnum]
      and confdeltype = 'c'
  ) then
    raise exception 'purchases(user_id) auth-user cascade foreign key is missing';
  end if;
  if to_regclass('public.purchases_plan_created_at_idx') is null
    or to_regclass('public.purchases_user_created_at_idx') is null then
    raise exception 'purchase history indexes are missing';
  end if;
  if exists (
    select 1
    from pg_attribute
    where attrelid = 'public.plans'::regclass
      and attname in ('runway_cents', 'shortfall_cents')
      and not attisdropped
  ) then
    raise exception 'derived runway/shortfall columns must not be persisted';
  end if;
  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.plans'::regclass
      and tgname = 'plans_set_updated_at'
      and not tgisinternal
      and tgenabled <> 'D'
  ) then
    raise exception 'plans updated_at trigger is missing or disabled';
  end if;

  foreach v_column in array array[
    'available_funds_cents',
    'safety_buffer_cents',
    'fixed_essentials_cents',
    'flexible_essentials_cents'
  ] loop
    if not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.plans'::regclass
        and contype = 'c'
        and pg_get_constraintdef(oid) like '%' || v_column || '%'
        and pg_get_constraintdef(oid) like '%100000000%'
    ) then
      raise exception 'plan cents constraint is missing for %', v_column;
    end if;
  end loop;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.purchases'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%amount_cents%'
      and pg_get_constraintdef(oid) like '%100000000%'
  ) then
    raise exception 'purchase cents constraint is missing';
  end if;

  if has_function_privilege('anon', 'public.confirm_purchase(uuid,text,bigint,uuid)', 'execute')
    or has_function_privilege('authenticated', 'public.confirm_purchase(uuid,text,bigint,uuid)', 'execute') then
    raise exception 'browser role can execute confirm_purchase';
  end if;
  if not has_function_privilege('service_role', 'public.confirm_purchase(uuid,text,bigint,uuid)', 'execute') then
    raise exception 'service_role cannot execute confirm_purchase';
  end if;
  if exists (
    select 1
    from pg_proc as procedure
    where procedure.oid = 'public.confirm_purchase(uuid,text,bigint,uuid)'::regprocedure
      and (
        not procedure.prosecdef
        or not coalesce(procedure.proconfig, array[]::text[]) @> array['search_path=pg_catalog, public']
      )
  ) then
    raise exception 'confirm_purchase must remain SECURITY DEFINER with a pinned search_path';
  end if;
  if has_table_privilege('anon', 'public.plans', 'select')
    or has_table_privilege('anon', 'public.plans', 'insert')
    or has_table_privilege('anon', 'public.plans', 'update')
    or has_table_privilege('anon', 'public.plans', 'delete')
    or has_table_privilege('anon', 'public.purchases', 'select')
    or has_table_privilege('anon', 'public.purchases', 'insert')
    or has_table_privilege('anon', 'public.purchases', 'update')
    or has_table_privilege('anon', 'public.purchases', 'delete')
    or has_table_privilege('authenticated', 'public.plans', 'select')
    or has_table_privilege('authenticated', 'public.plans', 'insert')
    or has_table_privilege('authenticated', 'public.plans', 'update')
    or has_table_privilege('authenticated', 'public.plans', 'delete')
    or has_table_privilege('authenticated', 'public.purchases', 'select')
    or has_table_privilege('authenticated', 'public.purchases', 'insert')
    or has_table_privilege('authenticated', 'public.purchases', 'update')
    or has_table_privilege('authenticated', 'public.purchases', 'delete') then
    raise exception 'browser role has direct financial table privilege';
  end if;
end;
$$;

rollback;
