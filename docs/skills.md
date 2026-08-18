# Skills

A catalog of every skill in this repository — 108 in total — with a one- or two-line summary each.

Each skill lives at `kit/skills/<domain>/<name>/`, one level under its domain directory, and that folder name is both the skill's `name:` and the folder name it is installed under. **Skill** below is therefore all you need: it is what you invoke as `/name`, what appears under `.claude/skills/` once installed, and where the source sits. The two-character prefix is the domain — see [the flatten build convention](https://github.com/openreachtech/hora-skills/blob/main/.claude/skills/flatten/SKILL.md) for the layout and the naming rules. Full guidance for any skill is in its own `SKILL.md`.

## `core` — `hc-*`

34 skills. Conventions and procedures that apply to any project, regardless of stack.

| Skill (= Command) | Summary |
| :-- | :-- |
| `hc-accessors` | Getter/setter conventions — setters prohibited for immutability, `#get:Ctor` reserved for `this.constructor`, and dependency references extracted into getters. |
| `hc-async` | Asynchronous code conventions. When writing Promises, use `async`/`await` whenever possible. |
| `hc-charters-coding` | The ORT coding charter: write readable, unified code; avoid modification; let the code explain everything. |
| `hc-classes-constructor` | Class constructor conventions. Constructor parameters must not have default values. |
| `hc-classes-inflators` | The inflator (binding) method pattern — bind the class passed as an argument and return a derived subclass memoized via `BoundCtorRegistry` — plus its naming and arguments. |
| `hc-classes-notations` | The order members are written in a class body: the eight-block placement order, plus ordering within getters and within methods. |
| `hc-classes-principles` | Class design principles — no classes without properties, and the system underpinning it (deep immutability, constructor-only, references-as-contract). |
| `hc-classes-prohibits` | Prohibitions in class definitions: static-only classes and classes without state are not allowed, and why. |
| `hc-code-review` | Read-only, code-level review of a change, producing a findings report on specification compliance, correctness and convention conformance. Never fixes anything. |
| `hc-coding-styles` | Coding style — where to chop down expressions, method/property chains, call arguments, template literals and regular-expression flags. |
| `hc-comments` | Comments within actual code are written in English unless there is a reason otherwise. |
| `hc-constants` | Constant conventions — uppercase `SNAKE_CASE` naming, chopping down, and the file organization and placement of object-type constants. |
| `hc-contracts` | Type contracts for function and method arguments and return values, and how contract types are defined. |
| `hc-dependency-defect` | Work around a bug in code this project uses but does not own — a subclass that overrides only the broken member, called by its own name, with a comment saying when it can be deleted. |
| `hc-documentation` | Documentation writing conventions, including the `#instanceMember` / `.staticMember` notation used when referring to class members. |
| `hc-errors` | Error handling — return `null` on failure from value-generating methods, and the throw-message format for abstract members. |
| `hc-functions` | Function conventions. Parameters follow method parameters: named arguments as a principle. |
| `hc-git-commit` | Commit conventions — what belongs in a single commit, and the message format (imperative or Conventional Commits, chosen per project). |
| `hc-implementation-progress` | Track an in-flight implementation in a progress document anchored to requirement ids, advancing a status only against recorded evidence. |
| `hc-jest` | Write Jest unit tests for JavaScript classes. |
| `hc-jsdoc` | JSDoc writing conventions shared by backend and frontend — type annotations, `@returns`, `@typedef` and type-only imports, with the Vue/Nuxt-specific conventions in its references. |
| `hc-license` | Write and update a project's LICENSE file. |
| `hc-methods` | Method definition conventions — named arguments, passing properties into private methods, and factory methods. |
| `hc-modules-exports` | Don't define files that merely named-export a function; define a class per responsibility. |
| `hc-modules-imports` | Group imports at the top of the file, ordered from farthest to nearest to application development. |
| `hc-naming` | Naming for classes, methods, properties and accessors — datetime suffixes (`At`/`On`, `From`/`To`), abbreviation criteria, American spelling, forbidden words, ASCII only. |
| `hc-properties` | Property conventions — set on `this` in the constructor, immutable (no reassignment, no `Map`), and no JavaScript native private. |
| `hc-readme` | Write and update a project's README. |
| `hc-requirement-definition` | Turn a rough request into a requirement definition document through conversation — requirements, acceptance criteria, out-of-scope list, open questions. |
| `hc-scope` | Scope references among class members — `this` between static members, and `#get:Ctor` when referring from an instance to a static member. |
| `hc-skill-updating` | Conventions for creating and updating skills — how to name one, placement rules, directory structure, and how to write a `SKILL.md`. |
| `hc-statements` | Statements and control flow — no literal `undefined` in production code, higher-order functions over sequential processing, and ternary/`if` policies. |
| `hc-test-execution` | Run a project's tests and drive them to green without weakening them — nothing skipped, deleted, loosened or waited out to make the suite pass. |
| `hc-workflows` | Development workflow rules — how to proceed with an implementation, and the steps always performed before committing and before completion. |

## `backend` — `hb-*`

29 skills, all for renchan-based Node backends.

| Skill (= Command) | Summary |
| :-- | :-- |
| `hb-agent-loop` | Build an LLM agent loop with the three `@openreachtech/mentsu-agent-loop` packages — the core iteration engine, a BullMQ job runner, and a GraphQL mutation plus progress subscription. |
| `hb-ai-agent-structure` | Structure an app-side AI agent on `mentsu-agent-loop-core`: a `ProceduralAgentLoop` subclass plus per-step `BaseAgentAction` subclasses under `app/agents/<name>/`. |
| `hb-ai-prompt-document-store` | Hold agent config, instructions, documents and tool schemas in the database rather than in code, assembling the runtime prompt at request time and versioning through backup tables. |
| `hb-backend-testing` | Where a test file goes (`tests/__tests__` vs `tests/_orders`), how run order among DB-writing tests is guaranteed, how to run the suite, and the purity rules for tests and doubles. |
| `hb-build-e2e-test-environment` | Build, run and debug the hand-operated local E2E stack under `e2e/docker/` — its containers, its seed set, and the `up`/`start`/`seed`/`clean`/`down` scripts. |
| `hb-constant-definition` | Define an application constant as two files: a CommonJS master under `constants/` (the source of truth) plus an ESM bridge under `app/constants/` that re-exports it. |
| `hb-database-design` | The logical schema decisions made before writing a migration or model — normalization, status/category representation, column types, time storage, read scaling, versioning, history. |
| `hb-execution-placement-pattern` | Decide where processing belongs: a synchronous GraphQL/REST operation, or a background worker triggered from a handler, from a post-worker, or on a schedule. |
| `hb-external-api-client` | Implement an external HTTP/REST API client with `@openreachtech/mentsu-rocket-client` — the Launcher / Payload / Capsule trio under `app/<serviceName>Client/`. |
| `hb-graphql-schema` | Author GraphQL SDL files for a renchan server — per-audience schemas, numbered per-domain files, custom scalars, and naming, nullability, enum and pagination conventions. |
| `hb-graphql-server-engine` | Implement a per-endpoint `*GraphqlServerEngine`: its URL, schema path, resolver directories, Share/Context DI, auth filter, middleware, scalars and error codes. |
| `hb-light-rag` | Add lightweight RAG for agent documents without a vector database — a vector-first / LLM-fallback ranker over stored `Document` rows, plus a MySQL n-gram fulltext keyword index. |
| `hb-multi-llm-provider` | Support Claude / OpenAI / Gemini behind one abstraction — an abstract model processor, a base per vendor, a concrete class per model, and a loader that picks one by model name. |
| `hb-mutation-resolver` | Implement GraphQL Mutation resolvers extending `BaseMutationResolver` — state-changing operations and the single transaction each runs in. |
| `hb-post-worker` | Implement a post-worker: a hook firing after a resolver has resolved and the response has been sent, for side effects outside the API's main processing. |
| `hb-query-resolver` | Write GraphQL Query resolvers extending `BaseQueryResolver` — pagination, association includes, domain-error throwing, and the actual-vs-stub pair. |
| `hb-renchan-job-bullmq` | Write and wire background jobs with `@openreachtech/renchan-job-bullmq` — the Manifest / Worker / Dispatcher triple, repeatable jobs, enqueuing, progress publishing, concurrency and retries. |
| `hb-resolver-share` | Implement the Share class — the per-process container of shared singletons handed to every resolver as `context.share` — and decide what belongs in Share versus Context. |
| `hb-resolver-validator` | Implement `*InputValidator` classes for resolvers, extending `BaseInputValidator` and delegating value checks to `mentsu-value-inspector`. |
| `hb-restfulapi-architecture` | The REST layer of a renchan backend — the renderer architecture under `server/restfulapi/`, routes and versions, `render()`, response/error hashes, the auth filter, and flushers. |
| `hb-security-audit` | Read-only, repo-wide security audit of a Node project, producing a findings list — injection, auth gaps, exposure, secrets, dependencies, CORS, rate limiting, PII, uploads. |
| `hb-sequelize-migration` | Write renchan/Sequelize migrations — `createTable`, `addColumn`/`removeColumn`, `addIndex`, index naming, and whether to add a foreign-key column. |
| `hb-sequelize-model` | Write renchan/Sequelize model definitions — attributes, `createOptions`, associations, scopes, hooks, and how to wire a `MixinModel`. |
| `hb-sequelize-seeder` | Write renchan/Sequelize seeders — the master / dev-master / development split, the file skeleton, filename numbering, and per-file seed-id blocks. |
| `hb-sequelize-subquery` | Define named subqueries with `this.addSubquery` and consume them via `Model.subquery(name, params)`; filtering by a related table is a subquery, not a JOIN. |
| `hb-strategy-pattern` | Replace an else-if/switch dispatch chain with a base processor, one subclass per variant, and a bulk loader that auto-discovers subclasses and picks one by a dispatch getter. |
| `hb-stub-api` | Implement a stub resolver returning hardcoded, schema-accurate data with no DB access, so the frontend can develop against the API contract before the real backend exists. |
| `hb-subscription-resolver` | Implement a GraphQL subscription resolver — declare the operation, scope its channel per subscriber, gate who may subscribe, and wire the publish side. |
| `hb-type-interface` | Define `.d.ts` type interfaces — model interfaces under `types/models/` (global `model`) and resolver Input/Result types under `types/resolvers/<category>/`. |

## `frontend` — `hf-*`

45 skills for Furo/Nuxt apps, plus the stack-agnostic CSS and UI/UX conventions. The `hf-cp-*` skills are component selection skills for repositories consuming `@openreachtech/furo-vue`: each one routes a plain-language UI need to the right `Furo*` component.

| Skill (= Command) | Summary |
| :-- | :-- |
| `hf-acceptance-review` | Post-implementation acceptance review of a whole app — is every backend operation reachable from the UI, is CRUD complete per entity, do affordances act, are failures and waits told truthfully. |
| `hf-animation` | UI animation conventions — whether and why an element animates, easing from the `--transition-timing-*` tokens, and the entry/popover/tooltip/blur techniques that keep motion responsive. |
| `hf-cp-button` | A clickable action trigger — submit, primary, icon or loading button. Routes to `FuroButton`. |
| `hf-cp-checkbox-toggle` | A boolean control — checkbox, on/off switch, toolbar toggle button. Routes to `FuroCheckbox`, `FuroToggle`. |
| `hf-cp-collapsible` | A show/hide region, or a stack of expandable sections such as an accordion or FAQ list. Routes to `FuroCollapsible`, `FuroAccordion`. |
| `hf-cp-control-block` | Wraps a form field with a label, hint, required marker or validation error message. Routes to `FuroControlBlock`. |
| `hf-cp-date-time` | A date and/or time selection control. Routes to `FuroDatePicker`, `FuroTimeField`, `FuroDateTimePicker`. |
| `hf-cp-dialog` | A modal, a confirm/destructive-action prompt, or a side panel. Routes to `FuroDialog`, `FuroAlertDialog`, `FuroDrawer`. |
| `hf-cp-dropdown-menu` | A menu of actions triggered from a button or icon — kebab, context or three-dot menu. Routes to `FuroDropdownMenu`. |
| `hf-cp-editable-field` | An inline click-to-edit value display. Routes to `FuroEditableField`. |
| `hf-cp-editor` | A rich-text editing area — WYSIWYG field, comment editor, chat composer with mentions. Routes to `FuroEditor`. |
| `hf-cp-empty-state` | A placeholder for a region with no records, or one that failed to load and can be retried. Routes to `FuroEmptyState`, `FuroErrorState`. |
| `hf-cp-popover` | A floating panel anchored to a trigger, or a hover/focus hint. Routes to `FuroPopover`, `FuroTooltip`. |
| `hf-cp-select` | Picking one or more values from a list — searchable dropdown, typeahead, multi-select. Routes to `FuroSelect`, `FuroAutocompleteField`. |
| `hf-cp-splitter` | Resizable side-by-side panes, a styled scrollable container, or a divider line. Routes to `FuroSplitter`, `FuroScrollArea`, `FuroSeparator`. |
| `hf-cp-stepper` | A multi-step flow indicator — wizard progress, multi-step form, checkout steps. Routes to `FuroStepper`. |
| `hf-cp-table` | Tabular data with row selection and sorting, plus its page-navigation companion. Routes to `FuroTable`, `FuroPagination`. |
| `hf-cp-tabs` | Tabbed regions and segmented-control navigation. Routes to `FuroTabs`. |
| `hf-cp-text-field` | A single-line text input — email, password, number or file upload field. Routes to `FuroTextField`, `FuroEmailField`, `FuroPasswordField`, `FuroNumberField`, `FuroFileField`. |
| `hf-cp-textarea` | A multi-line text input — comment box, description field. Routes to `FuroTextarea`. |
| `hf-cp-toast` | A transient notification — success/error snackbar shown after an action. Routes to `FuroToast`, `FuroToaster`. |
| `hf-cp-toggle-group` | A segmented toggle control, or a keyboard-navigable container grouping buttons, toggles and separators. Routes to `FuroToggleGroup`, `FuroToolBar`. |
| `hf-css` | CSS architecture and styling for a Furo/Nuxt app — unit-selector naming, design tokens, and global stylesheet layering. |
| `hf-css-coding-styles` | CSS coding style: formatting and notation. |
| `hf-css-layers` | The cascade layer (`@layer`) order and the role of each layer. |
| `hf-css-line-height` | Defaults to `--value-golden-ratio` (1.618), held unitless. Override only when an individual case needs a different value. |
| `hf-css-prohibits` | CSS notations that are prohibited (anti-patterns). |
| `hf-css-props-naming` | Custom property naming — the top-prefix rule denoting a value's kind, and the two-layer palette / color rule. |
| `hf-css-props-prohibits` | Prohibitions for custom properties — relative sizes limited to the five steps huge / large / medium / small / tiny, and no `x-` style labels. |
| `hf-css-units` | Entry point for CSS unit conventions — the base unit and value granularity, organized by topic. |
| `hf-css-z-index` | The three layer base values and the `calc()` notation. |
| `hf-e2e-test-specification` | Author and maintain the E2E test specification: the durable, flow-by-flow list of what must be true of the product, derived from the API surface. States what, never how to click it. |
| `hf-error-handling` | Map backend dotted error codes to user-facing messages via `app/constants-error.js` and i18n locale paths, and surface them with `errorMessageHashReactive` and `error.vue`. |
| `hf-furo-context-patterns` | How to use Furo Context classes — `BaseAppContext` generics, the `create()`/`setupComponent()` lifecycle, DI from setup, watchers, and the `*PageContext`/`*Context` taxonomy. |
| `hf-furo-env` | Configure Furo environment variables (`.furo-env` files) — adding or changing a variable, and wiring an endpoint or key. |
| `hf-graphql` | GraphQL in a Furo app — the generated schema types in `types/graphql-schema.d.ts` and the operation clients under `app/graphql/client`. |
| `hf-layout-margin` | Spacing in Flex/Grid is the container's responsibility; layout items carry no margin. Even spacing uses `gap`, exceptions are owned from the parent. |
| `hf-modules` | Reusable general logic lives in utility classes, not utility functions or composables — Furo follows an OOP structure. |
| `hf-nuxt` | Build a Nuxt/Furo frontend the OpenReach way — pages, components, composables, `useState` stores, the AppShare service (`$furo`), middleware, plugins, layouts and ambient types. |
| `hf-prohibits` | No JavaScript logic inside a `.vue` `<template>`; logic is moved onto members of the Context. |
| `hf-restful` | REST clients under `app/restfulapi/renchan/` — the Launcher/Payload/Capsule trio mirroring the GraphQL pattern, `BASE_URL`, the `/v1` prefix and access-token headers. |
| `hf-selector-props-sort` | Property ordering (Outer-to-Inner Order) — categorize by what the property applies to and order outer to inner, alphabetically within a group. |
| `hf-uiux-audit` | Audits existing frontend output — code, screenshots, mockups, live URLs or Figma — into a severity-ranked report of UX/UI, interaction, accessibility and legal/consent issues. Builds nothing. |
| `hf-uiux-context` | Creates and fills the shared `uiux-context.md` project context file that both `hf-uiux-forge` and `hf-uiux-audit` read — app type, users, scope, stack, tokens, accessibility target, brand. |
| `hf-uiux-forge` | Generates production-quality frontend UI (React/Tailwind by default) that is correct by construction — WCAG AA, design tokens, interaction states, responsive layout, consent rules. |
