---
name: hc-workflows
description: "Development workflow procedural rules. Defines how to proceed with implementation and the steps that must always be performed before committing / before completion."
---

# Workflows

Procedural rules related to the development workflow.

## How to proceed with implementation

- Before proceeding with an implementation, consult the skills it requires.
- Follow this order.

1. Design the class composition of the feature as a whole
2. Design the member composition of each class
3. Write the tests
4. Implement the class members
5. Commit the tests one class at a time
6. Commit per class

## Before committing

- Before committing, pass `npm run lint`. Every commit leaves the tree lint-clean.
- **`npm test` is not a gate on every commit.** Step 5 commits a class's tests before step 6
  commits its implementation, so that commit fails the suite when it is checked out on its own.
  That failure is the assertion the test commit makes. Staging the implementation alongside the
  tests to keep the suite green destroys both the assertion and the split.
- Run `npm test` on a test commit all the same, and **read the failure**: it must fail on the
  behavior the tests assert, not on a typo, a bad import or a missing fixture. A test commit
  that is red for the wrong reason is a defect; a test commit that is green asserts nothing.
- Follow the git commit convention before writing a commit message, and before deciding how to split working-tree changes into commits. It resolves which message format the project uses and defines what belongs in a single commit.
- Decide commit granularity **while working**, not once the tree is already dirty with several unrelated changes.

## Before completing implementation

- Pass `npm run lint` and `npm test` before completing the implementation. This is where the
  suite must be green — step 6 is the commit that turns the tests of step 5 green. Do not
  consider the implementation complete while either one is failing.
