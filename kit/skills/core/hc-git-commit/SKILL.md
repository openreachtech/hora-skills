---
name: hc-git-commit
description: >
  Conventions for git commits. Covers the granularity of what belongs in a single commit,
  and the message format — two formats are supported (imperative and Conventional Commits),
  selected per project rather than per commit. Use this skill before writing any commit
  message, and before deciding how to split working-tree changes into commits.
---

# Git Commit

Conventions for **what goes into one commit** and **how that commit is described**.

These are two concerns decided at two different moments:

- **Granularity** is decided *while working* — which changes get staged together.
- **Format** is decided *at commit time* — how the staged change is worded.

Granularity comes first. A badly scoped commit cannot be rescued by a well-written subject
line, because the subject is then forced to describe several unrelated things at once.

## Choosing the format

Two message formats are in use across projects. They are **not interchangeable within a
repository** — one repository uses one format throughout its history.

Resolve which one applies, in this order.

1. **The project's `CLAUDE.md`.** A project declares its format under a
   `## Commit message format` heading:

   ```markdown
   ## Commit message format

   - Format: imperative
   ```

   The accepted values are `imperative` and `conventional`.

2. **The existing history**, when `CLAUDE.md` declares nothing. Read the recent non-merge
   subjects and count how many carry a type prefix:

   ```bash
   git log --no-merges -n 30 --pretty=format:'%s'
   ```

   If **most** of them begin with `feat:` / `fix:` / `refactor:` / `test:` / `docs:` /
   `chore:` (optionally with a scope, as in `feat(resolver):`), the project uses
   conventional. Otherwise it uses imperative.

3. **Default to imperative** when the history is too short to judge, as in a new repository.

- Never mix the two formats within one repository. A history that is genuinely split down the
  middle is a defect to raise with the user — it is not a licence to choose per commit.
- When a project's resolved format contradicts what the user asks for in the moment, follow
  the user for that commit, but tell them which format the repository otherwise uses.
- Once resolved, follow the matching detail file:
  [format-imperative.md](./references/format-imperative.md) or
  [format-conventional.md](./references/format-conventional.md).

## Rules that apply to both formats

### Subject line

- The subject is a **single line**, and carries **no trailing period**.
- Keep the subject **below 72 characters as much as possible**. This is a target, not a hard
  limit — most subjects should clear it, and a minority legitimately will not.
  - When a subject runs long, the usual cause is that the **commit is doing more than one
    thing**. Reach for [granularity.md](./references/granularity.md) first: splitting the
    commit shortens both subjects and is the fix that actually improves the history.
  - The other legitimate cause is a **long but precise identifier**. Here the target yields:
    naming `BaseRestfulApiLauncher#createResponseBodyParser()` in full is worth more than
    hitting 72. Never truncate, abbreviate, or paraphrase an identifier to fit.
  - What the target rules out is **padding** — the redundant trailing clause that restates
    what the identifier already says. Cut the clause, not the identifier.
- Describe **the change**, not the activity that produced it. `wip`, `save progress`,
  `Update files`, and `Address feedback` describe a working session; they tell a later reader
  nothing about what the tree now does differently. (The one deliberate exception is the
  branch-opening marker below, which carries no changes at all.)
- Do not record **process or provenance** in the message: no "as requested", no "per review
  comment", no tool attribution.

### The branch-opening marker commit

A new branch opens with an **empty commit** whose subject begins with `Start`. This is a
deliberate convention, not a checkpoint or a placeholder.

```bash
# opening a long-lived dev branch
git switch -c dev
git commit --allow-empty -m 'Start dev'

# opening a topic branch
git switch -c rename/FormElementClerk
git commit --allow-empty -m 'Start renaming FormElementClerk to FormElementInspector'
```

- It must be **empty** (`--allow-empty`). Its purpose is to give a fresh branch a commit so a
  pull request can be opened before any code exists. A `Start …` subject on a commit that
  actually contains changes is not this convention — it is a mislabelled change.
- It is the **first commit on the branch**, made immediately after branching.
- The subject names **what is being started**, which depends on the kind of branch.
  - A **long-lived integration branch** is named directly: a `dev` branch opens with
    `Start dev`. Here `dev` is the branch, not a placeholder word.
  - A **topic branch** states the work it will carry — `Start renaming FormElementClerk to
    FormElementInspector`, `Start fixing type errors reported by the client package`. A later
    reader scanning the log gets the branch's purpose for free.
- **The marker takes no type prefix, in either message format.** Repositories on Conventional
  Commits write `Start dev`, not `chore: start dev`. The marker sits outside the format.
- One per branch. `Start` is not a verb for resuming work mid-branch.

### The merge commit

A branch merges back into its trunk with `--no-ff`, and the merge commit that results carries a
subject of its own.

```
Merge the classes of the skills installer
Merge the core/ rename in the repository documents
```

- **It names the work, never the branch.** `Merge rename/FormElementClerk` says only what
  `git log --graph` already shows, and the branch is deleted moments later. What it carried is
  the part that has to survive it.
- **It stands in for the message a host would have written.** A merge that goes through a pull
  request is described for free — `Merge pull request #53 from …`. A merge made locally has no
  such author, and this subject fills the gap.
- **It takes no type prefix, in either message format**, for the same reason the branch-opening
  marker takes none: it carries no change of its own. Repositories on Conventional Commits
  write `Merge …`, not `chore: merge …`.
- **A merge made through a pull request is left alone.** The host writes it, and no one here
  chooses its wording.

Which branch is a trunk, how the merge is made, and what becomes of the branch afterwards are in
[branches.md](./references/branches.md).

### Referring to class members

When a subject or body names a class member, use the project's documentation notation.
Instance members are prefixed with `#`, static members with `.`.

| notation | member |
| :-- | :-- |
| `#instanceProperty` | instance property |
| `#instanceMethod()` | instance method |
| `#get:instanceGetter` | instance getter |
| `#set:instanceSetter` | instance setter |
| `.staticProperty` | static property |
| `.staticMethod()` | static method |
| `.get:staticGetter` | static getter |
| `.set:staticSetter` | static setter |

With the class name attached, write it as `SampleClass#extractValue()` or
`SampleClass.createValue()`.

```
Update BaseRestfulApiLauncher#extendRequestHooks() to return fulfilled hooks
Fix JSDoc of BaseRestfulApiLauncher.get:ResponseBodyParser
```

This is the same notation used throughout documentation and error messages; see the
documentation convention.

### Body

- The body is **optional**. Omit it when the subject already says everything — most small,
  well-scoped commits need no body.
- When present, separate it from the subject with **one blank line** and wrap it at
  **72 characters**.
- The body explains **why**, not what. The diff already shows what changed; what it cannot
  show is the constraint, the rejected alternative, or the non-obvious consequence.
- A ticket or issue identifier may appear in the body, but the body must still explain the
  change **without** it. A reader who cannot open the ticket must still be given the
  reason.

### Trailers

- Do not add attribution trailers (`Co-authored-by:`, `Generated-with:`, and similar) unless
  the project explicitly asks for them.

### Each commit stands alone

- Every commit must leave the tree in a state that **passes lint**. Do not commit a known-
  failing intermediate state and repair it in the next commit. See the workflows convention
  for what must be run before completing work.
- Order commits so that **no commit depends on a later one**. A reader checking out any single
  commit should find a coherent tree.

## Granularity in one line

One commit is **one decision a reviewer can accept or reject on its own**. If the subject
needs the word "and" to be accurate, the commit is two commits.

The full heuristic — what to split, what to keep together, and how to stage a mixed working
tree — is in [granularity.md](./references/granularity.md).

## Detail files

- [branches.md](./references/branches.md) — the trunk role, and merging a branch back into it
- [granularity.md](./references/granularity.md) — what belongs in one commit, splitting a mixed working tree
- [format-imperative.md](./references/format-imperative.md) — capitalized imperative subject, no type prefix
- [format-conventional.md](./references/format-conventional.md) — Conventional Commits (`type: summary`)
