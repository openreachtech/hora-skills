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
Allow the action button when the competition is completed
Add `dist/` to .gitignore
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

The verb comes from the shared table in `SKILL.md`. Choose the one that names what actually
happened — a precise verb often removes the need for a body.

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

## Bodies

Most commits in this format carry no body. Add one only when the *why* cannot be worked out
from the subject and the diff together.

```
Use late registration date unless it doesn't exist

The competition schedule may omit the late registration window entirely, in
which case the regular registration end date is authoritative. Falling back
the other way showed a closed competition as still open.
```
