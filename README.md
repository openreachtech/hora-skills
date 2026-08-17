# @openreachtech/hora-skills

A distribution package of Claude Code skills for developing with Hora Kit.

## Concept

This package ships **skills only** — it contains no runtime code to call. A skill is a directory holding a `SKILL.md`, plus optional `references/` and `scripts/`, that Claude Code loads and invokes as `/<name>`. Installing this package into a repository puts the conventions and procedures Open Reach Tech develops with in front of the agent working on that repository.

107 skills are distributed across three domains. The two-character prefix on every name is the domain, so a reader looking at one flat list of skills can tell at a glance which came from this package and where each belongs:

| Prefix | Domain | Skills | What it holds |
| :-- | :-- | --: | :-- |
| `hc-` | `core` | 33 | Conventions and procedures that apply to any project, regardless of stack |
| `hb-` | `backend` | 29 | renchan-based Node backends |
| `hf-` | `frontend` | 45 | Furo/Nuxt apps |

[**Skill catalog**](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.md) ([日本語](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.ja.md)) — every skill in this package with a one- or two-line summary, listed by the command name it is invoked by.

The source is organized by domain at `kit/skills/<domain>/<name>/`, and `dist/` is the published build output: the same skill folders with the domain level dropped, which is the flat shape Claude Code expects. A skill folder's name is its `name:` and the folder name it installs as — one string throughout, so the name you see in the catalog is the command you type.

## Installation

Requires Node.js LTS (the version the CI builds against).

```sh
npm install @openreachtech/hora-skills
```

This package has no JavaScript entry point. It ships static content under `dist/`, meant to be copied into your own repository (see Usage below), not `import`ed.

## Usage

Copy the skills into your repository's `.claude/skills/`. `dist/skills/` is already flat, so its contents transfer as they are, with no directory to strip:

```sh
cp -r node_modules/@openreachtech/hora-skills/dist/skills/* .claude/skills/
```

Claude Code discovers them from there, and each becomes invocable by its own name — `/hc-naming`, `/hb-query-resolver`, `/hf-cp-table`. Installed skills sit side by side with your repository's own, in one flat list, which is what the `hc-`/`hb-`/`hf-` prefix is for.

## Contribution

Bug reports, feature requests, and code contributions are welcome.

Feel free to contact us through GitHub Issues.

```sh
git clone https://github.com/openreachtech/hora-skills.git
cd hora-skills
npm install
npm run lint
npm test
```

## License

This project is released under the Apache License 2.0.

For more details, please see [in the LICENSE file](./LICENSE).

## Developer

[Open Reach Tech Inc.](https://openreach.tech)

## Copyright

© 2026 Open Reach Tech Inc.
