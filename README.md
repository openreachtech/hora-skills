# @openreachtech/hora-skills

A distribution package of Claude Code skills for developing with Hora Kit.

## Concept

This package ships **skills only** — there is no library to `import`, and the one executable it carries exists to install those skills. A skill is a directory holding a `SKILL.md`, plus optional `references/` and `scripts/`, that Claude Code loads and invokes as `/<name>`. Installing this package into a repository puts the conventions and procedures Open Reach Tech develops with in front of the agent working on that repository.

111 skills are distributed across three domains. The two-character prefix on every name is the domain, so a reader looking at one flat list of skills can tell at a glance which came from this package and where each belongs:

| Prefix | Domain | Skills | What it holds |
| :-- | :-- | --: | :-- |
| `hc-` | `core` | 35 | Conventions and procedures that apply to any project, regardless of stack |
| `hb-` | `backend` | 30 | renchan-based Node backends |
| `hf-` | `frontend` | 46 | Furo/Nuxt apps |

[**Skill catalog**](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.md) ([日本語](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.ja.md)) — every skill in this package with a one- or two-line summary, listed by the command name it is invoked by.

The source is organized by domain at `kit/skills/<domain>/<name>/`, and `dist/` is the published build output: the same skill folders with the domain level dropped, which is the flat shape Claude Code expects. A skill folder's name is its `name:` and the folder name it installs as — one string throughout, so the name you see in the catalog is the command you type.

## Installation

Requires Node.js 20.0.0 or newer, the floor `engines` declares. The CI builds against the current LTS.

```sh
npm install -D @openreachtech/hora-skills
```

This package ships no install script of its own, so adding it as a dependency installs the package and places nothing. Declare the command as your own project's `postinstall`, and `npm install` alone equips the repository:

```json
{
  "scripts": {
    "postinstall": "hora-skills install"
  }
}
```

Every domain installs by default, which is more than a repository of one stack needs. *Selecting domains* below narrows it, in the same package.json.

A project's own scripts are outside what npm holds back from v12 on, so this asks nothing of whoever clones the repository. `npx` is not needed here either: a lifecycle script runs with `node_modules/.bin` on its PATH.

The hook you just declared takes effect from the next `npm install` on, so run the command by hand for the first placement — and for a one-off, or a repository that is not yours to add a hook to:

```sh
npx --no hora-skills install
```

**`--no` stops npx before it downloads**: the name is still resolved against the registry, but nothing is fetched, so neither the install script nor the bin of a stranger's package ever runs. Without it, a bin that is not installed becomes a fetch of whatever has been published under `hora-skills`, an unscoped name this package does not hold.

Where the package is not a dependency at all — a one-off, or a repository that is not yours to add a hook to — name it in full instead: `npx --package=@openreachtech/hora-skills hora-skills install`. What is fetched is then a scoped name nobody else can publish under, which is the guarantee the unscoped bin name never carried.

## Usage

The skills land in your repository's `.claude/skills/`. Claude Code discovers them from there, and each becomes invocable by its own name — `/hc-naming`, `/hb-query-resolver`, `/hf-cp-table`. Installed skills sit side by side with your repository's own, in one flat list, which is what the `hc-`/`hb-`/`hf-` prefix is for.

### Selecting domains

Every domain installs by default. A repository with only a backend then pays for the 46 frontend skills on every turn, because Claude Code keeps the name and description of each installed skill in context. Narrow the selection by domain:

```sh
npx --no hora-skills install --domains core,backend
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

### Directories, not links

`.claude/`, and the `skills/` directory inside it, have to be directories of your repository rather than symbolic links. An installation verifies every step it is reached through, and finding a link at any of them it writes nothing and removes nothing. `.hora/equip-skills.json`, the record of what was installed, is verified the same way: a link there would send the write to whatever it stands for and overwrite it.

An installation that carries nothing says why and ends with a failing exit code. Where the command runs as your project's own `postinstall`, that is what `npm install` reports; run on its own, `npx --no hora-skills install` tells you the same.

A link is content of the repository rather than an instruction of whoever runs the command, so following one would let the repository decide where skills are written and, worse, where the skills of the previous run are removed from.

Where either points at a directory shared between repositories, name that directory instead — `npx --no hora-skills install --dir <the directory it resolves to>` reaches the same state, and the link still makes the skills visible at `.claude/skills/`. A `--dir` is named by whoever runs the command, so it is taken as given.

### Keeping the installation current

The installed skills are this package's build output rather than source of your repository, so ignore them:

```gitignore
.claude/skills/hc-*/
.claude/skills/hb-*/
.claude/skills/hf-*/
.hora/
```

An `npm install` with no arguments re-runs your project's `postinstall`, so the skills follow along. Naming the package on the command line — `npm install @openreachtech/hora-skills@latest` — does not, and neither does a repository without a hook. Run the command again yourself:

```sh
npx --no hora-skills install
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
