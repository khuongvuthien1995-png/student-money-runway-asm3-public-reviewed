# P1 Supabase Database Tests

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P1 — database and security foundation
> Created: 2026-10-12T02:10:37+11:00
> Updated: 2026-10-12T02:10:37+11:00

Run the migration first, then execute `001_schema_assertions.sql` in the SQL Editor for the student-owned `student-money-runway-asm3-dev` development project. It is read-only and rolls back.

Live transactional testing requires two Auth users created and controlled by the student. Do not paste their passwords, secret keys or database password into files or chat.

1. Create User A and User B through Supabase Auth using student-controlled addresses; copy only their UUIDs into a private SQL Editor session.
2. As a privileged database administrator, create User A’s plan with 95,000 / 10,000 / 45,500 / 18,000 cents. Confirm the `user_id` uniqueness constraint rejects a second plan for User A.
3. Invoke `public.confirm_purchase(UserA, 'Monthly public transport pass', 16000, <new UUID>)`. Expect one purchase, available funds 79,000, protected total 73,500 and runway 5,500.
4. Repeat exactly the same RPC request. Expect `replayed = true`, the same purchase ID and no second deduction.
5. Reuse that key with a different amount/name or User B. Expect `IDEMPOTENCY_KEY_REUSED` and no write.
6. Invoke amount 30,000 against a fresh canonical plan. Expect `PURCHASE_EXCEEDS_RUNWAY`, no purchase and no deduction.
7. Submit two distinct keys concurrently against a plan that can fund only one purchase. Expect one success and one `PURCHASE_EXCEEDS_RUNWAY` after plan-row serialization.
8. Under User B’s JWT/user-scoped Data API, attempt to read or write User A rows. Expect no access. Under `authenticated`, confirm direct table INSERT is denied because grants were revoked.
9. Remove test rows only in the development project using an authorised administrator process after recording evidence.

Record actual outcomes separately. These instructions are not a claim that any live database test has passed.
