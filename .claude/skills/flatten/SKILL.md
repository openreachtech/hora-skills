---
name: flatten
description: "Repository-specific build convention: kit/skills/ holds exactly three domain directories (core/, backend/, frontend/), each containing one level of skill folders named hc-*, hb-* or hf-*, and the build copies those folders into dist/skills/ unchanged — dropping only the domain level — to produce the flat .claude/skills/ layout that consuming repositories install. Use when rebuilding the dist/ output, or when adding, renaming or placing a skill under kit/skills/."
---

# Flatten

Consuming repositories install skills as a single flat list directly under `.claude/skills/`, with no domain subdirectories. `dist/skills/` is the build output of this repository that already has that flat shape, ready to be installed as-is.

`kit/skills/` is organized by domain for whoever maintains it, but only by one level, and each skill's folder is already named exactly as it will be installed. Flattening is therefore the whole of the build: drop the domain level, copy everything else through untouched.

## Source layout

`kit/skills/` contains exactly three directories, and nothing else:

| Domain directory | Prefix | What it holds |
|---|---|---|
| `core/` | `hc-` | Conventions and procedures that apply to any project, regardless of stack |
| `backend/` | `hb-` | renchan-based Node backends |
| `frontend/` | `hf-` | Furo/Nuxt apps |

Each domain directory contains skill folders and nothing else. Every skill is therefore at exactly this depth:

```
kit/skills/<domain>/<name>/SKILL.md
```

A skill folder may hold its own subdirectories (`references/`, `scripts/`), but no `SKILL.md` below its top level — those subdirectories are the skill's own files, never more skills. There are no intermediate grouping directories: no `backend/renchan/`, no `frontend/nuxt-vue/components/`, no `core/declarations/classes/`.

### The folder name is the skill's name

A skill folder's name is the skill's `name:`, and the folder name it gets under `dist/skills/`, all one string:

```
kit/skills/frontend/hf-cp-table/   name: hf-cp-table   →   dist/skills/hf-cp-table/
```

The prefix is part of the name: the skill is invoked as `/hf-cp-table`. The `h` stands for **hora**, from Hora Kit — the Open Reach Tech product this skill library is part of — and the second character is the domain: `c` for `core`, `b` for `backend`, `f` for `frontend`.

Two characters buy two things. A consuming repository installs these skills side by side with its own, in one flat list, and the prefix is what tells a reader at a glance which skills came from this library and which domain each belongs to. And because the three prefixes are mutually exclusive and a filesystem cannot hold two folders of one name in one directory, no two skills in the library can end up with the same name — the flat namespace is protected by the source layout itself, with nothing to check.

## The build

```
node .claude/skills/flatten/scripts/build.js
```

It validates the whole source tree first (below), then deletes `dist/skills/` outright and recreates it: `dist/` is a function of the current source alone. Without the deletion, a skill renamed or removed at the source would keep its stale folder in `dist/` indefinitely, and the build would go on shipping a skill that no longer exists — a failure invisible in a diff, because nothing about the stale folder changes.

Each skill folder is then copied to `dist/skills/<folder name>/` **byte for byte**. Nothing is rewritten:

- The `name:` line stays. The field and the folder name are the same string by construction, so there is no second, divergent source of truth to remove.
- No source note is appended. The source path is `kit/skills/<domain>/<name>/`, and the prefix names the domain, so an installed `hf-cp-table/` already says where it came from. A footer repeating it would be text to maintain that carries nothing.

Validation runs before the deletion, so a source tree that cannot produce a valid flat namespace leaves the previous output untouched rather than half-replaced. Every problem found is reported at once, not one per run:

| Aborts the build | Why |
|---|---|
| An entry directly under `kit/skills/` that is not one of the three domain directories | It has no domain, so no prefix and no place in the output. |
| A non-directory entry directly under a domain | Only skill folders belong there. |
| A skill folder with no `SKILL.md` | There is nothing to install. |
| A `SKILL.md` below a skill folder's top level | The one-level layout is the guarantee that the folder name is the skill name; a nested skill would have no name of its own. |
| A folder name that is not `hc-`/`hb-`/`hf-` followed by 1–61 characters of `[a-z0-9-]` | The name is joined onto `dist/skills/` as a path segment, so a value containing `/` or `..` would put the folder somewhere other than directly under `dist/skills/`. 64 characters is the limit an installed skill name has to stay within, which the 3-character prefix leaves 61 of. |
| A prefix that does not match the folder's domain (`hb-` under `frontend/`) | The prefix is the domain, so a mismatch makes the name lie about where the skill lives. |
| A `SKILL.md` with no parsable `name:` | Nothing declares what the installed skill is called. |
| A `name:` that differs from its folder name | This is the check the whole scheme rests on. The two are one string by convention; only an enforced comparison keeps them one string in fact. |

Restricting names to a single case is what lets the folder-name comparison be exact, and what keeps two names from folding onto one folder on a case-insensitive filesystem (macOS, Windows default).

## Naming a new skill

Choose the name for the reader who sees a flat list of skills and never sees this repository — then create the folder under the domain it belongs to, and declare the same string as `name:`.

The existing names came from the source tree as it was before this layout: a nested, topic-subdivided tree flattened one time by an algorithm that took the domain and the last two path segments, dropped the classifying words in between, and shortened a few of them. The conventions that fell out of it are worth keeping for new names:

| Convention | Examples |
|---|---|
| Drop structural words that only place a skill within its domain (`declarations`, `shared`, `members`, `renchan`) | `hc-async`, `hc-accessors`, `hb-agent-loop` |
| Keep a classifying word when it is what a reader would search for | `hc-classes-constructor`, `hc-modules-exports`, `hf-css-units` |
| Prefer a short marker over a spelled-out grouping word | `hf-cp-table` (component), `hf-css-props-naming` (CSS custom properties) |
| Two or more words read better as a command name than one | `hc-code-review` over `hc-review` |
