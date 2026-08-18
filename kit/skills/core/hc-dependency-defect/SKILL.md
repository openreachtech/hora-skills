---
name: hc-dependency-defect
description: "How a defect in code this project depends on and does not own — a framework, an in-house package, anything under `node_modules/` — is worked around from this project's own code, and where that workaround is placed, named and marked. Use when a package behaves wrongly and the correction has to live here. A defect in code this project writes is fixed in place instead. Choosing what to depend on, upgrading it and reporting the defect are decided outside the code."
---

# Dependency Defect

**Code this project depends on and does not own is worked around, never edited.**

A framework, an in-house package, anything resolved under `node_modules/`. What follows is how the
workaround is written and where it lives. **It says nothing about who decides, which branch it lands
on, or what gets recorded outside the code** — those belong to whatever process runs the work.

**Code this project does write is not this.** A defect there is fixed in place.

## The default

```
0. Is it already fixed upstream?
     read the package's own history at the version in use, and above it
     it is  -> the answer is a version bump. Nothing below applies
1. Extend the class at fault — a new class in this project, deriving from it
2. Override only the member that is broken
3. Swap the reference at the point of use
4. Mark it, so it can be found and removed when upstream fixes it
```

**Step 0 is the one that gets skipped**, and skipping it produces a subclass that exists to reproduce
a fix somebody already published. It costs one read.

## Why extension, and not any of the others

| What is done instead | What happens |
| :-- | :-- |
| Editing the package under `node_modules/` | The next install erases it. Nothing records that it was ever there, so the bug returns as a mystery. |
| Forking the package | Every later upgrade becomes a merge, forever, for one defect. |
| Reimplementing what it does | A fork without the history. It also stops receiving the fixes that were never the defect. |
| Reassigning the class's prototype at runtime | The behaviour has no site a reader can reach from the call. Two of these in one process, and the order they load in decides the result. |
| Shipping a copy of the class with the fix applied | The same as a fork, one file smaller. |

**The size of the defect decides none of this.** What decides it is that the code belongs to somebody
else and will move again.

## Step 1 — a class of this project's own, deriving from the one at fault

The subclass is ordinary code of this project's, and being a workaround changes nothing about how it
is placed or named.

- **It lives where this project keeps its own classes of that kind**, decided by the placement
  convention of the surface it belongs to — never in a directory named after the package, and never
  beside the package's own files.
- **It is named for the behaviour it corrects**, a singular UpperCamelCase noun in this project's own
  vocabulary, like any other class. Not `PatchedXxxx`, `FixedXxxx` or `XxxxWorkaround`: those name the
  file's history rather than what it does, and they read as false the day the class survives for
  another reason. The reason it exists belongs in the marker of step 4.
- **The original is imported as the package publishes it** (default or named export), grouped with the
  other third-party imports at the top of the file per the import convention.
- **A subclass that only overrides may hold no property.** The prohibition on classes without
  properties does not reach a class that has `extends` — the state is the base class's
  responsibility, and so is the argument list its constructor already declares.

## Step 2 — override the member, not the class

**A subclass that overrides one member keeps receiving everything the package does afterwards.** One
that restates the class stops receiving it the moment it is written, and nothing announces that it
has.

- Override the one method whose behaviour is wrong, and call `super` for everything else.
- Override a getter to correct a value the parent computes wrongly.
- Do not copy the parent's body into the child and edit two lines.
- Do not override a member that is fine, to keep the class "consistent".
- Annotate every override with `/** @override */`.

**Where the correct behaviour needs part of the parent's, call the parent and correct its result**
rather than restating what it does.

```javascript
// NG: the parent's body is restated, so its later fixes never arrive here
export default class SingleDayDateRangeFormatter extends DateRangeFormatter {
  /** @override */
  formatRange ({
    startedOn,
    endedOn,
  }) {
    if (startedOn === endedOn) {
      return startedOn
    }

    return `${startedOn} - ${endedOn}` // copied out of the package, minus the defect
  }
}

// OK: the defect is corrected, everything else stays the parent's
export default class SingleDayDateRangeFormatter extends DateRangeFormatter {
  /** @override */
  formatRange ({
    startedOn,
    endedOn,
  }) {
    if (startedOn === endedOn) {
      return startedOn
    }

    return super.formatRange({
      startedOn,
      endedOn,
    })
  }
}
```

**An identifier whose name begins with `Base` is already an extension point.** Deriving from one of
those is ordinary use of the library, not a workaround: nothing in this convention applies to it, and
it carries no marker and no removal condition.

## Step 3 — swap the reference, do not shadow the name

**The call site names the new class.** A reader who follows the import arrives at the class that
actually runs.

- Import this project's own class, by its own name, at each call site.
- Do not re-export the subclass under the original's name.
- Do not alias the import so the original's name resolves to the subclass.
- Do not assign over the original's prototype or its export.

```javascript
// NG: re-exported under the original's name — the import reads as the package's class, and it is not
export {
  default as DateRangeFormatter,
} from './SingleDayDateRangeFormatter.js'

// NG: aliased at the call site, with the same result
import {
  default as DateRangeFormatter,
} from '../modules/SingleDayDateRangeFormatter.js'

// OK: the call site imports this project's class, by its own name
import SingleDayDateRangeFormatter from '../modules/SingleDayDateRangeFormatter.js'
```

Each of the rejected forms leaves the next person debugging the package's source for behaviour that is
no longer the package's.

**Where the call sites are many, that is not a reason to shadow.** It is a reason to say so to whoever
is running the work, because a change reaching files this piece of work does not own is not this piece
of work's to make.

## When the fault is not in a class

**Wrap it.** A class of this project's that calls the exported function and corrects its result, with
the call sites using the wrapper. Everything above holds: correct the result, do not restate the
function. The wrapper is a class rather than a re-exported function, for the same reason every other
single responsibility here is a class.

## When the member cannot be reached from a subclass

Private, module-scoped, or decided before the class is constructed. **Stop and report it.** Do not
fall back to a row from the table above because extension did not reach.

What to state: the package and its version, the class or function, what it does, what it should do,
and what specifically blocks the extension.

## Step 4 — mark it so it can be removed

**A workaround with nothing marking it becomes permanent.** Nobody deletes a class whose reason nobody
wrote down.

Put the reason where a reader of the code will hit it — immediately above the class, in English like
any other comment — naming the member in the `#instanceMember` / `.staticMember` notation of the
documentation convention, and make it say what would let the file be deleted:

```javascript
/*
 * Works around <package>@<version>: <class>#<member> <what it does wrong>.
 * Remove this class and go back to <original> once <the condition> holds.
 * Reported upstream: <link>, or "not reported yet".
 */
```

**"Remove once upstream fixes it" is not a condition.** A version number, an issue link, or "not
reported yet" is. The last one is honest and still useful; the first is a note that reads like a plan.

## Rules

- The package is never edited, forked, copied, reimplemented or patched at runtime
- Before anything is written, the package's own history is read at the version in use and above it
- The correction is a class of this project's, deriving from the class at fault, overriding only the
  member that is broken and calling the parent for the rest
- A fault in an exported function is corrected by a wrapping class of this project's
- The call sites name this project's class; the original's name is never made to resolve to it
- A member that cannot be reached from a subclass is reported, not worked around another way
- Every workaround carries a marker stating the package, the version, the defect, and the condition
  under which the file is deleted
