# ASM3 P1 — Database and Security Foundation

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P1 — Supabase database and security foundation
> Created: 2026-10-12T02:10:37+11:00
> Updated: 2026-10-12T03:56:29+11:00

## Scope and execution status

P1 implements the versioned migration at `supabase/migrations/20261012020847_initial_schema.sql`. After explicit user approval, official Supabase CLI 2.120.0 applied it to `khuong-projects / student-money-runway-asm3-dev`, reference `mnjmugwkjtihqswssiwa`, using `npx supabase db push --linked --skip-vault`. Remote history records `20261012020847`, and the reviewed schema assertions passed through `npx supabase db query --linked --file supabase/tests/001_schema_assertions.sql`. See [P1B/P2B live evidence](asm3-p2b-live-integration.md).

Status: **P1B DATABASE DEPLOYMENT PASS — hosted schema and effective privileges verified; live purchase/Auth/concurrency tests pending P2B.**

## Objects

- `public.plans`: one active current plan per `auth.users` identity, enforced by `user_id unique`, plus `(id, user_id) unique` for composite child ownership enforcement.
- `public.purchases`: append-only confirmed purchase records tied to the same plan and user by a composite foreign key.
- `public.set_updated_at()`: plan timestamp trigger.
- `public.confirm_purchase(...)`: backend-only, `SECURITY DEFINER` atomic purchase RPC.
- indexes: purchase plan/user history retrieval ordered by creation time.

All monetary sources are integer cents in the inclusive range 0–100,000,000; purchases are 1–100,000,000. No derived runway or shortfall column exists. Auth-user deletion cascades to that user’s plan and purchases; the composite purchase-to-plan reference also cascades so parent deletion cannot leave an ownership-inconsistent purchase. The product exposes no ordinary plan deletion operation.

## Security design implemented

RLS is enabled on both financial tables and ownership policies are defined for future user-token read access. Direct `anon` and `authenticated` table grants are revoked, so the product cannot perform unrestricted browser financial writes. The intended write path is a future FastAPI service with a server-only Supabase secret key.

That key bypasses RLS. The migration therefore makes `confirm_purchase` executable only by `service_role`; it pins search path, schema-qualifies objects, validates the backend-supplied verified user ID against the locked plan, restricts name/amount, and revokes default public function execution. FastAPI must still verify the bearer JWT and derive the user ID; the function’s `p_user_id` parameter is not client input.

## Atomic purchase RPC contract

`public.confirm_purchase(p_user_id uuid, p_name text, p_amount_cents bigint, p_idempotency_key uuid)`:

1. validates input and obtains an advisory transaction lock for the idempotency key;
2. returns an identical existing purchase exactly once for a matching retry, or rejects changed owner/payload reuse;
3. locks the user’s plan with `FOR UPDATE`;
4. recalculates protected total and runway in cents;
5. rejects excess spend; otherwise inserts one purchase and updates available funds in the same transaction;
6. returns the authoritative purchase and plan fields.

The transaction rolls back entirely on errors. The unique idempotency key and plan-row lock cover repeat requests, retries, and concurrent purchase attempts. FastAPI will map SQL error messages to stable HTTP error codes in P4.

## Validation

Local validation completed:

- migration contains `plans`, `purchases`, foreign keys, `user_id unique`, cent checks, RLS, grants/revokes, index, restricted RPC and search-path pinning;
- `supabase/tests/001_schema_assertions.sql` contains catalog/RLS/privilege checks and rolls back;
- no credential or secret is present in the migration/test/document files;
- approved migration executed successfully on hosted PostgreSQL; reviewed catalog/RLS/privilege assertions passed. Actual purchase behavior, two-user isolation and concurrency remain untested.

## Pre-deployment migration repair

Before first hosted execution, the migration was repaired to wrap all DDL and grants in one transaction, qualify the `plans` alias in the purchase-deduction `UPDATE ... RETURNING`, and add the composite `(plan_id, user_id)` foreign key. The repair prevents PL/pgSQL output-column ambiguity and rejects a purchase whose plan belongs to a different user. The schema assertion script now verifies the composite foreign key, one-plan constraint, idempotency uniqueness, cents checks, indexes, no derived financial columns, browser-role table/RPC denials, service-role RPC access, and the `SECURITY DEFINER` search-path pin.

The function remains in `public` because FastAPI calls the existing PostgREST RPC contract by its current exposed name. This is safe only while execution remains revoked from `PUBLIC`/`anon`/`authenticated`, granted only to `service_role`, and FastAPI derives `p_user_id` from a verified bearer token. Moving it would require a coordinated repository-contract change and live verification.

## Approved database application checkpoint

Completed on 2026-10-12 after explicit approval: linked project and reviewed migration hash reconfirmed; dry-run showed only the approved migration; application and read-only assertions succeeded. Both tables have RLS enabled, all five ownership policies exist, browser table/RPC privileges are denied, and service-role RPC execution is allowed. The two-user procedure in `supabase/tests/README.md` remains pending. Do not edit or blindly rerun the applied migration.

## P1 handoff

P2 may begin only after migration application, assertion success, and documented actual results. P2 adds FastAPI health/config/auth verification; it must not expose a Supabase secret or allow React to call the financial mutation RPC.
