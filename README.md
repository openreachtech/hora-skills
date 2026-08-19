# @openreachtech/hora-skills

A distribution package of Claude Code skills for developing with Hora Kit.

## Concept

This package ships **skills only** — there is no library to `import`, and the one executable it carries exists to install those skills. A skill is a directory holding a `SKILL.md`, plus optional `references/` and `scripts/`, that Claude Code loads and invokes as `/<name>`. Installing this package into a repository puts the conventions and procedures Open Reach Tech develops with in front of the agent working on that repository.

110 skills are distributed across three domains. The two-character prefix on every name is the domain, so a reader looking at one flat list of skills can tell at a glance which came from this package and where each belongs:

| Prefix | Domain | Skills | What it holds |
| :-- | :-- | --: | :-- |
| `hc-` | `core` | 34 | Conventions and procedures that apply to any project, regardless of stack |
| `hb-` | `backend` | 30 | renchan-based Node backends |
| `hf-` | `frontend` | 46 | Furo/Nuxt apps |

[**Skill catalog**](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.md) ([日本語](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.ja.md)) — every skill in this package with a one- or two-line summary, listed by the command name it is invoked by.

The source is organized by domain at `kit/skills/<domain>/<name>/`, and `dist/` is the published build output: the same skill folders with the domain level dropped, which is the flat shape Claude Code expects. A skill folder's name is its `name:` and the folder name it installs as — one string throughout, so the name you see in the catalog is the command you type.

## Installation

Requires Node.js LTS (the version the CI builds against).

```sh
npm install -D @openreachtech/hora-skills
```

Installing this package is the request to equip the repository with its skills, so its `postinstall` places them into `.claude/skills/` for you.

npm turns install scripts off by default from v12 on, and warns about them before that, so the hook only runs where you have allowed it. Add this package to the whitelist in your package.json:

```json
{
  "allowScripts": {
    "@openreachtech/hora-skills": true
  }
}
```

`npm install-scripts approve @openreachtech/hora-skills` writes the same entry, and `npm install-scripts ls` lists what is still waiting for a decision.

Where you would rather not allow the hook, run the command yourself instead — it does exactly what the hook does:

```sh
npx hora-skills install
```

## Usage

The skills land in your repository's `.claude/skills/`. Claude Code discovers them from there, and each becomes invocable by its own name — `/hc-naming`, `/hb-query-resolver`, `/hf-cp-table`. Installed skills sit side by side with your repository's own, in one flat list, which is what the `hc-`/`hb-`/`hf-` prefix is for.

### Selecting domains

Every domain installs by default. A repository with only a backend then pays for the 46 frontend skills on every turn, because Claude Code keeps the name and description of each installed skill in context. Narrow the selection by domain:

```sh
npx hora-skills install --domains core,backend
```

Or declare it once in your package.json, so a plain `hora-skills install` obeys it:

```json
{
  "horaSkills": {
    "domains": ["core", "backend"]
  }
}
```

The command line wins over package.json, and both fall back to every domain.

### Keeping the installation current

The installed skills are this package's build output rather than source of your repository, so ignore them:

```gitignore
.claude/skills/hc-*/
.claude/skills/hb-*/
.claude/skills/hf-*/
.hora/
```

Updating this package re-runs the hook, so the skills follow along. Without the hook, run the command again yourself:

```sh
npx hora-skills install
```

`install` is repeatable: it removes what the previous run installed — recorded in `.hora/equip-skills.json` — along with any folder named after a skill this package distributes, before copying the current selection. A renamed or deselected skill therefore leaves nothing behind, and a repository that had copied `dist/skills/` by hand is tidied up on its first run.

A skill your own repository authored is left alone, as long as its name is not one this package distributes. Carrying the `hc-`/`hb-`/`hf-` prefix is not enough to put it at risk — `hc-own-skill` is untouched — but naming it exactly after a distributed skill hands that name over to this package.

### Commands

| Command | What it does |
| :-- | :-- |
| `hora-skills install` | Install the selected skills, replacing the previously installed ones |
| `hora-skills list` | Print the skills the current selection installs, installing nothing |
| `hora-skills uninstall` | Remove every skill this package installed, along with the manifest |
| `hora-skills help` | Print the usage text |

`--dir <path>` installs into a directory other than `.claude/skills`.

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
