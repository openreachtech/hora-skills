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

## Merging back into a trunk

- **Always `--no-ff`, never fast-forward.** A fast-forward leaves no commit a human can point
  at: the branch's commits are strung onto the trunk's line, and the fact that they arrived
  together, as one piece of work, stops being visible at all.
- **Delete the branch once it is merged.** Its name was written for whoever watched the work in
  flight, and that reader is gone. This includes a trunk that merges into another trunk —
  `dev` and `env` are deleted once they land on `main`.
  - **A trunk kept alive after it merged sits at the past of the trunk it merged into**, and
    everything cut from it afterwards inherits that. Merging `origin/main` back in would
    settle it, but re-cutting the branch settles the same thing without leaving a merge commit
    that carries no work of its own:

    ```bash
    git branch -d dev
    git switch -C dev origin/main
    ```
- **When two branches were cut from the same commit on a trunk, whichever merges second rebases
  onto the trunk's new tip first.** The second branch then merges into the trunk as it now
  stands, rather than reopening a line that was already closed.
- **Every rebase in this scheme uses `-r` (`--rebase-merges`).**

  ```bash
  git rebase -r --onto <trunk's new tip> <the commit this branch was cut from> <branch>
  ```

  Without `-r`, `git rebase` drops every merge commit it replays. A branch that carried its own
  sub-branches then arrives flattened, and the `--no-ff` merges inside it are gone — the exact
  thing `--no-ff` was used to keep.
