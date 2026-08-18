# Branches

Conventions for the branches a repository carries. Referenced from `SKILL.md`.

## The trunk branch

A **trunk branch** is one that other branches are cut from and merged back into.

Four are trunks by name, in every repository.

| branch | what it carries |
| :-- | :-- |
| `main` | the mainline every other branch descends from |
| `release/x.x.x` | one version's work, until it merges into `main` |
| `dev` | long-lived integration |
| `env` | the initial environment setup |

**Every other branch is a general branch, and takes the role rather than holding it.** A
general branch behaves as a trunk for as long as work is split off it. The four above behave as
trunks whether anything is outstanding against them or not.

The shape of the name settles nothing. `release/x.x.x` is a trunk and
`retake/save-of-UserRepository` is not, and the two are the same shape.

- **Trunks nest.** A general branch cut from `main` that then has work split off it is both: a
  sub-branch of `main`, and the trunk of what it carries. The role is held against a particular
  branch, never held outright.
- **A sub-branch merges back into its trunk, and a trunk never merges into what it carries.**
  That is the whole of what the role decides, and it decides it the same way at every level of
  the nesting.
