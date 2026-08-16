---
name: hc-documentation
description: "Documentation writing conventions. Referenced when updating or writing READMEs, design documents, comments, etc. Defines the notation used when referring to class members within documentation, among other things."
---

# Documentation

This gathers the conventions for writing documentation (READMEs, design documents, comments, etc.).

- When writing or updating documentation, follow the conventions in this skill.
- Follow this skill when writing or updating `SKILL.md` as well (referenced from the skill-updating convention).

## Notation of Class Members

- When referring to a class member within documentation, use the following notation.
- Instance members are prefixed with `#`, static members with `.`.
- **This skill is the governing source for this notation.** When another skill restates the same table, it aligns with the content here.

| notation | members |
| :-- | :-- |
| `#instanceProperty` | instance property |
| `#instanceMethod()` | instance method |
| `#get:instanceGetter` | instance getter |
| `#set:instanceSetter` | instance setter |
| `.staticProperty` | static property |
| `.staticMethod()` | static method |
| `.get:staticGetter` | static getter |
| `.set:staticSetter` | static setter |

- When attaching the class name, write it as in `SampleClass#extractValue()`.

| notation | member |
| :-- | :-- |
| `SampleClass#extractValue()` | instance method of `SampleClass` |
| `SampleClass.createValue()` | static method of `SampleClass` |

## Scope of application (applies beyond prose)

- This notation applies not only to Markdown prose, but to **any text within implementation code that refers to a class member**. Specifically, this includes the following.
  - **Error messages** (message strings in `throw new Error(...)`, etc.)
  - **JSDoc / comments** (places within a member's description that refer to a member)
- When dynamically embedding a class name, use the same notation. Prefix instance members with `#` and static members with `.`.

```javascript
// OK: instance method (the class name is resolved via this.constructor.name)
throw new Error(`${this.constructor.name}#normalize() must be inherited`)

// OK: static getter / static method (the class name is resolved via this.name)
throw new Error(`${this.name}.get:rawSchema must be inherited`)
throw new Error(`${this.name}.generateCredential() must be inherited`)
```
