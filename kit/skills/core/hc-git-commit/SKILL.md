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
- Do not record **how the change came to be asked for**: no "as requested", no "per review
  comment", no tool attribution. Where the content itself came from is a different matter — that
  belongs in the subject wherever it is part of what the work is.

### The branch-opening marker commit

A branch that will act as a trunk opens with an **empty commit** whose subject begins with
`Start` — or with `Release`, on a `release/x.x.x` trunk. This is a deliberate convention, not a
checkpoint or a placeholder.

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
  - A **`release/x.x.x` trunk** is opened by its version alone: `Release 0.2.0`. The word
    `Start` does not appear, because the version is the whole of what is being started.
  - **Where the work carries content in from elsewhere, the marker names the origin** — `Start
    migrating the mail templates from lunas-ec-cart-backend`. Stated once here, it covers every
    commit on the branch, and the merge commit keeps it in the history after the branch is gone.
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

**The table below lists the verbs whose role is fixed, not the verbs a subject may use.** A row
is there because choosing the wrong verb would lose something a later reader needs — whether a
file survived, whether a class or one of its members was written, whether a constraint went one
way or the other. Where a listed verb names what happened, it is the one to use, and no synonym
substitutes for it. Where nothing listed names it, open the subject with the verb that does:
`Document`, `Name`, `Point`, `Follow` and their like fix no such distinction and need no row.

| verb | use for |
| :-- | :-- |
| `Add` | a new file, member, case, or capability that did not exist |
| `Declare` | a class written for the first time |
| `Define` | a class member, function, or constant written for the first time |
| `Fulfill` | a gap filled where something was declared but left short — a TODO, an unset option |
| `Purge` | a whole file or folder deleted, with nothing replacing it |
| `Kick out` | a part deleted from what stays — a class member, a section, an entry, a field |
| `Tidy up` | a place brought into order, where nothing was removed and no behavior changed |
| `Update` | an existing thing changed in itself, leaving it better than before |
| `Retake` | an existing thing redone because what was there was poor, hurried, or a stopgap |
| `Fix` | incorrect behavior corrected |
| `Rename` | identifier changed, behavior untouched |
| `Move` | relocation between files or directories, content untouched |
| `Extract` | logic pulled out into its own member or module |
| `Unify` | two members or modules folded into one |
| `Optimize` | a change made for speed, behavior untouched |
| `Use` | switching to a different existing mechanism |
| `Allow` / `Prevent` | a constraint loosened or tightened |
| `Turn on` / `Turn off` | a switch flipped — a boolean, a lint rule, a feature flag |
| `Adjust` | a dial moved — a threshold, a limit, the options of a rule that stays on |
| `Export` | public surface changed |
| `Install` / `Uninstall` | a dependency the project takes on, or gives up |
| `Start` | **empty** branch-opening marker only — see above |
| `Release` | **empty** marker opening a `release/x.x.x` trunk only — see above |
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

- **`Purge` and `Kick out` split on what survives.** `Purge` is for a file or a folder that is
  gone whole — `Purge tests/legacy/OldValidator.js`, `Purge tests/legacy/`. `Kick out` takes the
  shape `Kick out <what> from <where>`, because the point is that `<where>` is still there
  without `<what>` — a member of a class, a section of a document, an entry of a manifest:
  `Kick out main: from package.json`. The pair mirrors `Declare` and `Define`.
- **`Tidy up` is the cleanup that is not a removal.** It takes the shape `Tidy up <where>` —
  `Tidy up the environment files` — and covers stale naming, leftover duplication and disorder,
  where naming each micro-change on its own would be noise. When the cleanup *is* a removal, the
  verb is `Purge` or `Kick out`, however the branch that carries it happens to be named.
  - **The test is that no responsibility moves.** A typo in a comment or a type, a formatting
    correction, a blank line added or taken out, declarations put into dictionary order, the
    parameter of every public function renamed to `it` — the tree does the same thing before
    and after, and a reviewer confirms exactly that. One identifier renamed on its own merits
    is `Rename`; a sweep that makes a whole surface uniform is a tidy-up.
  - **Reordering is `Tidy up` only among items of one kind.** Declarations, cases, entries,
    imports — putting a set of peers into order changes nothing. Reordering control flow does:
    two `if` statements swapped is a behavior change wearing the clothes of a tidy-up, and it
    takes the verb its behavior deserves.
- **`Update` and `Retake` split on what was there before.** `Update` carries a sound
  implementation forward and leaves it giving something it did not give before — the gain is the
  point. `Retake` replaces what was poor, hurried or a stopgap with what should have been there,
  and claims no gain beyond that. Neither is `Fix`: that one is for behavior that was wrong,
  where `Retake` is for an implementation that worked and was not good enough.
- **A member's inputs and outputs are `Update`'s ground.** A parameter it now takes, a return
  value it now gives — the member itself is what changed. That a parameter is something which
  appeared does not make it `Add`: addition takes `Add` where what appeared stands as an item of
  its own, such as a test case or a manifest entry. Whether the change breaks a caller is marked
  by the format rather than the verb — Conventional Commits writes `!` with a `BREAKING CHANGE:`
  trailer.
- **`Fulfill` fills a gap that was already there; `Add` brings something that was not.** A test
  left as a TODO, a JSDoc block without its `@returns`, an option a rule was never given, a
  `package.json` field left blank — the place existed and was short, and the commit makes it
  whole. Where what is covered is itself new, its tests arrive with it and that is `Add`.
  Nothing is replaced either way, which is what separates `Fulfill` from `Update`, and nothing
  was wrong, which separates it from `Fix`. An option that was set and then moved is `Adjust`;
  an option that was never set is `Fulfill`.
- **`Add` covers a whole new thing and a part added to one that stands.** A test file that did
  not exist and one more case inside a file that did are both `Add`, so long as what they cover
  is itself new — coverage that was owed is `Fulfill`. Addition is deliberately left unsplit: no
  pair divides it the way `Purge` and `Kick out` divide deletion, because none is needed — the
  subject names the thing added either way, and nothing a later reader wants is hidden by the
  choice. Do not invent a verb for the partial case.

  Nor reach for `Update` there. An item added inside something else is still an addition: `Add`
  names what appeared, where `Update` names only the thing it appeared in. The more telling verb
  wins, as `Declare` and `Define` win over `Add` where they apply.
- **The table carries no `Remove` or `Delete`.** Both read the same whether a whole file went
  or one line inside it did, so the subject alone leaves the reader guessing. Splitting the word
  into two is what makes the difference visible in `git log`.
- **The table carries no `Migrate`.** Carrying content in from elsewhere is bracketed by the
  branch, not repeated on every commit: the marker names the origin once — `Start migrating the
  mail templates from lunas-ec-cart-backend` — and each commit inside then says what kind of
  thing arrived, `Declare` or `Define` or `Add`. A subject reading `Migrate BaseInputValidator`
  says less than `Declare BaseInputValidator` does, and the origin it gestures at is nowhere.
- **`Extract` leaves the logic in the tree, in a home of its own.** The call site stays and
  delegates to what was pulled out, which is what separates it from `Purge` and `Kick out` —
  nothing was deleted. Relocating something intact is `Move`; `Extract` makes a new home out of
  part of an existing one, and `Unify` is the same operation run backwards. `Cut out` is not
  in the table for the reason `Remove` and `Delete` are not: it reads as excision, so the
  subject leaves open whether the logic landed somewhere or went away.
- **`Install` and `Uninstall` name the dependency, not the file that records it.** `Install
  date-fns 4.1.0` and `Uninstall date-fns` say what the project now depends on, or no longer
  does. Reaching instead for `Add`, or for `Kick out`, would describe an edit to `package.json`,
  which is merely where the fact is written down. A version change to a dependency already
  installed is `Update`.
- **A restriction lifted is `Allow`, never a negative.** `Don't disable the action button when
  the competition is completed` describes a state the code should hold; a subject describes a
  transition. `Allow the action button when the competition is completed` says the same change,
  and it completes *"Applying this commit will …"*, which a negative cannot.
- **`Turn on` and `Turn off` name the switch, not what it permits.** `Turn off
  jsdoc/require-jsdoc for tests in eslint.config.js` says which setting moved; `Allow` and
  `Prevent` name the behavior that is now open or closed. Where both would be true, the switch
  is the more telling of the two, because a reader can go and find it. A value that moved along
  a scale is neither: that one is `Adjust`.
- **A setting changes in three degrees, and each has its own verb.** `Turn on` and `Turn off`
  flip the switch. `Adjust` moves the dial while the switch stays where it is — `Adjust MaxFiles
  to 20 in <config>`, `Adjust max-len to 120 in eslint.config.js`. `Update` is for the setting
  that changed in itself rather than in degree — `Update jest version to 30.4.2 in
  package.json`. `Adjust` carries no direction: a dial is as properly turned down as up, which
  is why `Update`'s gain does not apply to it.
- **`Start`, `Release` and `Merge` are reserved** for the commits that carry no change of their
  own — the two branch-opening markers and the merge commit, all described above. A change that
  folds two things into one takes `Unify`, never `Merge`, so that a merge commit stays
  recognizable by its subject alone.

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
Tidy up the JSDoc of BaseRestfulApiLauncher.get:ResponseBodyParser
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
