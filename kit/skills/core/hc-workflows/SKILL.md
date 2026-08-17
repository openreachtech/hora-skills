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

- Before committing, pass `npm run lint`, then pass `npm test`.
- Follow the git commit convention before writing a commit message, and before deciding how to split working-tree changes into commits. It resolves which message format the project uses and defines what belongs in a single commit.
- Decide commit granularity **while working**, not once the tree is already dirty with several unrelated changes.

## Before completing implementation

- Run `npm run lint` before completing the implementation. Do not consider the implementation complete while lint is failing.
