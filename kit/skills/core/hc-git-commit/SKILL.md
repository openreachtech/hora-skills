---
name: hc-git-commit
description: >
  Conventions for git commits and the branches they land on. Covers what belongs in a single
  commit and the order commits land in, the message format (imperative or Conventional
  Commits), the verb vocabulary shared by both, and the trunk role with the subjects that open
  and close a branch. The commands that gate a commit belong to the workflows convention. Use
  before writing a commit message, before splitting a working tree into commits, and before
  cutting or merging a branch.
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

### The resolved format governs what to write, never how to read

A history may hold subjects in any other convention — written before the project settled on
one, or by another team, or by hand in a hurry — and those commits are still the record of what
happened. So when searching for where something changed, do not filter on the resolved format
alone.

```bash
git log --format='%h %s' <range>                                            # no filter
git log --format='%h %s' <range> | grep -P '^\S+ [a-z-]+(\([^)]*\))?!?: '   # type prefixes
```

Filter the subject line, as above, rather than reaching for `--grep`: that searches the whole
message, so it also matches trailers such as `Co-Authored-By:`. And treat any subject filter as
a shortcut rather than a guarantee — read the range's subjects, or its diff, without one before
concluding that a change is not in the history.

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

A branch that will act as a trunk opens with an **empty commit** whose subject begins with
`Start`. This is a deliberate convention, not a checkpoint or a placeholder.

```bash
# opening a long-lived dev branch
git switch -c dev
git commit --allow-empty -m 'Start dev'

# opening a general branch that will carry sub-branches
git switch -c feature/equip-tools-for-each-application
git commit --allow-empty -m 'Start adding the skills installer'

# opening a nested trunk: cut from the branch above, and carrying sub-branches of its own
git switch -c update/the-domains-a-repository-selects
git commit --allow-empty -m 'Start updating the domains a repository selects'
```

- It must be **empty** (`--allow-empty`). It exists to put a commit on a branch that has no
  work on it yet, so there is nothing for it to carry. A `Start …` subject on a commit that
  actually contains changes is not this convention — it is a mislabelled change.
- It is the **first commit on the branch**, made immediately after branching.
- **One per trunk, and none on a sub-branch.** The test is the branch's role: will other
  branches be cut from this one and merged back into it? Where the answer is yes, the branch is
  a trunk — that is what [branches.md](./references/branches.md) defines the word to mean, and
  that definition is the whole of the condition.
- **A nested trunk takes a marker of its own.** A general branch cut from `main` that then has
  work split off it is a sub-branch and a trunk at once, and it is the trunk half the marker
  answers to. Such a branch merges back locally, with no pull request anywhere in it, and it
  still opens with `Start …`.
- **Whether a pull request is ever opened decides nothing.** Where the merge does go through a
  host, the marker buys a branch that can be reviewed before any code exists — but that is
  something the commit makes possible, never the test for making one.
- **`Start` is not a verb for resuming work mid-branch.** A branch already carrying commits has
  nothing left to open.
- The subject names **what is being started**, which depends on the kind of trunk.
  - A **trunk that is one by name** is named directly: a `dev` branch opens with `Start dev`.
    Here `dev` is the branch, not a placeholder word.
  - A **general branch acting as a trunk** states the work it will carry — `Start adding the
    skills installer`, `Start renaming kit/skills/_core/ to core/`. A later reader scanning the
    log gets the branch's purpose for free.
- **The marker takes no type prefix, in either message format.** Repositories on Conventional
  Commits write `Start dev`, not `chore: start dev`. The marker sits outside the format.

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

### Verbs

A subject opens with a verb naming what actually happened. The vocabulary is the same in both
message formats — capitalized on the imperative format, lowercase after the type on
Conventional Commits.

| verb | use for |
| :-- | :-- |
| `Add` | a new file, member, case, or capability that did not exist |
| `Declare` | a class written for the first time |
| `Define` | a class member, function, or constant written for the first time |
| `Purge` | a whole file deleted, with nothing replacing it |
| `Kick out` | a part deleted from a file that stays — an entry, a rule, a field |
| `Update` | an existing thing changed, without a change in contract |
| `Fix` | incorrect behavior corrected |
| `Rename` | identifier changed, behavior untouched |
| `Move` | relocation between files or directories, content untouched |
| `Extract` | logic pulled out into its own member or module |
| `Combine` | two members or modules folded into one |
| `Optimize` | a change made for speed, behavior untouched |
| `Use` | switching to a different existing mechanism |
| `Allow` / `Prevent` | a constraint loosened or tightened |
| `Export` | public surface changed |
| `Start` | **empty** branch-opening marker only — see above |
| `Merge` | **merge commits only** — see above |

- **`Declare` is for the class itself; `Define` is for what is written inside or beside it** —
  a member, a function, a constant. Both are the specific forms of `Add`, and where they apply,
  `Add` is the vaguer choice. `Add` remains correct for everything else that did not exist
  before — a test file, a case, a reference document.

  ```
  Declare SkillsInstaller to replace the installed skills
  Define SkillsInstaller#replaceInstalledSkills() to swap the tree in one pass
  Define SKILL_DOMAIN naming the domains a repository can select
  Add tests for SkillsInstaller
  ```

- **`Purge` and `Kick out` split on what survives.** `Purge` is for a file that is gone —
  `Purge tests/legacy/OldValidator.js`. `Kick out` takes the shape `Kick out <what> from
  <where>`, because the point is that `<where>` is still there without `<what>` —
  `Kick out main: from package.json`. The pair mirrors `Declare` and `Define`.
- **The table carries no `Remove` or `Delete`** for that reason: both read the same whether a
  whole file went or one line inside it did, so the subject alone leaves the reader guessing.
  Splitting the word is what makes the difference visible in `git log`.
- **A restriction lifted is `Allow`, never a negative.** `Don't disable the action button when
  the competition is completed` describes a state the code should hold; a subject describes a
  transition. `Allow the action button when the competition is completed` says the same change,
  and it completes *"Applying this commit will …"*, which a negative cannot.
- **`Start` and `Merge` are reserved** for the two commits that carry no change of their own —
  the branch-opening marker and the merge commit, both described above. A change that folds two
  things into one takes `Combine`, never `Merge`, so that a merge commit stays recognizable by
  its subject alone.

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

- Order commits so that **no commit depends on a later one**. A reader checking out any single
  commit should find a coherent tree.
- **What must pass before a commit is not settled here.** Which commands run before a commit,
  and which before the work is called complete, belongs to the workflows convention. This one
  settles what goes into a commit, how it is worded, and the order the commits land in — never
  whether a command's result permits the commit.

## Granularity in one line

One commit is **one decision a reviewer can accept or reject on its own**. If the subject
needs the word "and" to be accurate, the commit is two commits.

The full heuristic — what to split, what to keep together, and how to stage a mixed working
tree — is in [granularity.md](./references/granularity.md).

## Detail files

- [branches.md](./references/branches.md) — the trunk role, naming a branch, merging it back
- [granularity.md](./references/granularity.md) — what belongs in one commit, splitting a mixed working tree
- [format-imperative.md](./references/format-imperative.md) — capitalized imperative subject, no type prefix
- [format-conventional.md](./references/format-conventional.md) — Conventional Commits (`type: summary`)
