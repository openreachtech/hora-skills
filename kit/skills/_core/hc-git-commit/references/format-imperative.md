# Format: Imperative (No Type Prefix)

The message format used when a project resolves to `imperative`. Referenced from `SKILL.md`.

## Shape

```
<Capitalized imperative verb> <what changed>
```

- **Capitalized** first word.
- **Imperative mood** — the verb reads as an instruction to the codebase, not as a report of
  what was done. The test: the subject completes the sentence *"Applying this commit will
  \_\_\_ ."*
- **No type prefix**, no scope, no bracketed tag.
- **No trailing period.**

```
Export FormElementInspector via main-export
Add correctness checks reference for code-review skill
Rename VariablesValidator variable name to ValueHashValidator in BaseFormElementClerk
Fix JSDoc of BaseRestfulApiLauncher.get:ResponseBodyParser
Don't disable action button when competition is completed
Tell git to ignore `.furo-env.development`
```

## Mood

Past tense and gerunds are the most common slip.

```
Bad:  Added validator for employee sign-in
Bad:  Adding validator for employee sign-in
Bad:  Adds validator for employee sign-in
Good: Add validator for employee sign-in
```

## Verbs

Choose the verb that names what actually happened. A precise verb often removes the need for
a body.

| verb | use for |
| :-- | :-- |
| `Add` | a new file, member, case, or capability that did not exist |
| `Remove` | deletion, with nothing replacing it |
| `Update` | an existing thing changed, without a change in contract |
| `Fix` | incorrect behavior corrected |
| `Rename` | identifier changed, behavior untouched |
| `Move` | relocation between files or directories, content untouched |
| `Extract` | logic pulled out into its own member or module |
| `Use` | switching to a different existing mechanism |
| `Allow` / `Prevent` | a constraint loosened or tightened |
| `Export` | public surface changed |
| `Start` | **empty** branch-opening marker only — see `SKILL.md` |

- Prefer the specific verb over `Update`. `Update BaseFormElementClerk` says almost nothing;
  `Rename VariablesValidator to ValueHashValidator in BaseFormElementClerk` says all of it.
- `Change` and `Modify` are almost always the wrong verb — some more precise verb applies.

## Naming the target

Name the concrete thing that changed, using the class-member notation given in `SKILL.md`.

```
Bad:  Fix the launcher
Good: Fix JSDoc of BaseRestfulApiLauncher.get:ResponseBodyParser

Bad:  Update tests
Good: Update test for BaseRestfulApiLauncher#extendRequestHooks()

Bad:  Improve card layout
Good: Use grid layout to make sure children doesn't overflow
```

Backtick literal file names, flags, and values when they appear in a subject
(`` `.furo-env.example` ``, `` `.directory-keeper` ``).

## Negative subjects

A subject may state what the code now refrains from doing. Keep it imperative.

```
Don't disable action button when competition is completed
Kick out trailing ',' from JSDoc in test for BaseRestfulApiLauncher.createResponseBodyParser()
```

## Bodies

Most commits in this format carry no body. Add one only when the *why* cannot be worked out
from the subject and the diff together.

```
Use late registration date unless it doesn't exist

The competition schedule may omit the late registration window entirely, in
which case the regular registration end date is authoritative. Falling back
the other way showed a closed competition as still open.
```
