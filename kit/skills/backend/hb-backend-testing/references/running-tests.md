# Running tests

How to run the whole suite, a single test (with and without rebuilding the database), reset the
database piecemeal, size the worker/heap budget so a run cannot take the machine down, and what a
live (real-dialect) run requires. Referenced from §2 of [SKILL.md](../SKILL.md). Commands are the
recommended shape; adapt the script names to your project (they are defined in `package.json`).

## The whole suite

```bash
npm run test
```

- Runs on **SQLite** — the local default (fast, zero external services), under
  `NODE_ENV=development`.
- **Rebuilds the database first**, then runs, so every full run starts clean:
  1. teardown (drop the local DB)
  2. migrate (recreate the schema)
  3. seed (master, then the development / dev-master fixtures)
  4. run `tests/__tests__/` (read-only) and `tests/_orders/` (DB-writing, in category order)

Because the suite re-seeds up front, a green full run proves the tests pass **from a clean database in
the committed order**. It is the authoritative run — and the slowest.

## Parallelism and memory: the worker budget

Jest runs test files in **parallel workers** — roughly one per core by default — and each worker is
its own Node process with its own heap. Two levers set the budget, and they must be set **together**:

```bash
# the shape — the numbers come from the measurement below, never from a default
NODE_OPTIONS="--experimental-vm-modules --max-old-space-size=1536" npx jest --maxWorkers=4
```

- **`--max-old-space-size` is a ceiling, not a reservation.** It does not set memory aside; it is
  the point up to which V8 may **defer garbage collection**. A generous value therefore buys no
  headroom — it licenses each worker to grow that far before the GC is forced to work. Set it above
  what the machine can actually give and the limit never engages: the worker balloons until the
  **operating system**, not V8, ends it — and **one worker is enough** to take the machine down.
- **The budget is a multiplication.** Every worker may sit at its peak at once, so the invariant is:

  ```
  workers × (heap cap + per-process overhead) ≤ memory actually free
  ```

  "Actually free" means what is left **after everything else resident on the machine** — a local
  database, an E2E stack's daemons and pollers — not the installed total.
- **Derive the cap from a measured peak, not from hope.** Run the suite once with `--logHeapUsage`
  (Jest prints each test file's heap as it finishes) and set the cap comfortably above the largest
  value. A cap below the real peak thrashes the GC and fails anyway; a cap far above it only moves
  the death from V8's out-of-memory error (which comes with a trace) to the machine's (which comes
  with nothing).
- **The budget rots as the project grows.** Per-worker usage rises with every model, seeder and test
  added, so a workers × cap pair that fit when it was chosen silently stops fitting. When a
  previously green suite starts dying without output, **re-measure the peak and re-do the
  multiplication** before suspecting the tests.

How the two failures announce themselves is the diagnostic: a worker stopped **by the cap** throws
`JavaScript heap out of memory` with a stack trace; a worker stopped **by the machine** is killed
silently and can take the whole run — and every other process on the box — with it.

## A single test through the suite runner

Run the runner against **one path**, choosing which seed set the database has. It re-establishes the
seeds, then runs only that path:

```bash
# with the development (dev-master) seeds applied — the usual mode for a DB-writing test
./test.sh --seeded tests/_orders/<Category>/SomeCreator.js

# with master seeds only (no development fixtures)
./test.sh --empty tests/__tests__/<path>/SomeUnit.js
```

- **`--seeded`** applies the development fixtures before running; **`--empty`** runs against master
  seeds only.
- Point the path at a category's `_.test.js` to run the whole category in order, or at a single file.

## A single test without rebuilding the database (fastest)

For a tight edit-run loop, invoke Jest **directly** against the file — this skips migrations and
seeders entirely and runs against the database **exactly as it currently is**:

```bash
NODE_OPTIONS="--experimental-vm-modules" NODE_ENV=development npx jest <path-of-test-file>
```

For a DB-writing or order-sensitive test, run the cases **serially** with `--runInBand` (no parallel
workers racing on the same database):

```bash
NODE_OPTIONS="--experimental-vm-modules" NODE_ENV=development npx jest --runInBand <path-of-test-file>
```

- **Prerequisite: the database must already be prepared** (migrated + seeded once). This mode does not
  set anything up — it assumes the schema and fixtures the test expects are already present. Prepare
  them once with `npm run test` (or the piecemeal commands below), then iterate with `npx jest`.
- `--experimental-vm-modules` is required for the ES-module test loader; `NODE_ENV=development`
  selects the SQLite config.
- **`_orders` caveat**: a DB-writing test **mutates shared state**. After running one this way, the
  database no longer matches its seeded baseline, so a later fast run can produce a **different
  result**. Before trusting subsequent runs, **restore the database** — re-run the relevant migrations
  / seeders (below), or a full `npm run test`.

## Preparing or resetting the database piecemeal

When you only need to re-establish part of the state — instead of a full rebuild — run just that
step. This is what makes the fast `npx jest` loop usable.

**Migrations only** (schema):

```bash
npm run db:teardown                    # drop the local DB
NODE_ENV=development npm run db:setup   # re-apply migrations (schema only, no data)
```

**One seeder set only** — undo or (re)apply a single set without touching the others. The general
lever is `sequelize-cli` with an explicit `--seeders-path`:

```bash
NODE_ENV=development npx sequelize-cli db:seed:undo:all --seeders-path sequelize/seeders/<set>/
NODE_ENV=development npx sequelize-cli db:seed:all       --seeders-path sequelize/seeders/<set>/
```

The three standard sets, and the npm wrappers the project provides for the common two:

| Seeder set (dir) | Undo | (Re)apply |
| --- | --- | --- |
| dev-master fixtures (`sequelize/seeders/dev-master/`) | `sequelize-cli db:seed:undo:all --seeders-path sequelize/seeders/dev-master/` | `npm run db:seed:master` |
| development fixtures (`sequelize/seeders/development/`) | `sequelize-cli db:seed:undo:all --seeders-path sequelize/seeders/development/` | `npm run db:seed:dev` |
| production master (`sequelize/seeders/master/`) | `sequelize-cli db:seed:undo:all --seeders-path sequelize/seeders/master/` | `sequelize-cli db:seed:all --seeders-path sequelize/seeders/master --debug` |

- Prefix each `sequelize-cli` / `npm run` command with `NODE_ENV=development` (SQLite).
- **After running `_orders` tests**, re-applying the mutated seeder set (undo → apply) is usually
  enough to get back to a known baseline without a full teardown/migrate.
- The rebuild-everything shortcut is `npm run db:refresh` (alias `npm run r`): teardown → migrate →
  seed dev-master → seed dev, in one command.

## A live (real-dialect) run

Everything above runs on **SQLite**, the local default. A test that depends on real-dialect behavior
SQLite does not emulate has to run against **MariaDB**, and that means **a MariaDB running locally**;
`NODE_ENV=live` selects its connection config, and the same test files run unchanged — only the
dialect differs.

Standing that database up is deliberately **not covered here**: this skill governs where tests go and
how they are run, not how a database is provisioned.
