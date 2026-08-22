import {
  existsSync,
  readdirSync,
  readFileSync,
} from 'node:fs'
import {
  join,
  resolve,
} from 'node:path'
import {
  fileURLToPath,
} from 'node:url'

const kitRoot = fileURLToPath(new URL('../../../kit/', import.meta.url))

/*
 * Markdown links inside kit/ are checked here because nothing else does: lint
 * never opens a .md file, and the name audit only compares directory names.
 * A section renamed without its links repointed therefore ships silently, and
 * has done — the change that added this test repaired 32 links already broken.
 *
 * dist/ is a verbatim copy made by the flatten build, so checking kit/ covers
 * what is published.
 */

/**
 * Drop fenced code blocks, so links shown as examples are not resolved.
 *
 * @param {string} markdown - Whole document.
 * @returns {string} Document without fenced blocks.
 */
function stripFencedCode (markdown) {
  return markdown.replace(/^```[\s\S]*?^```/gmu, '')
}

/**
 * Build the anchor slug GitHub gives a heading.
 *
 * Runs of spaces are **not** collapsed and the result is **not** trimmed:
 * `## 1. Placement & execution order` slugs to `1-placement--execution-order`,
 * and `` ## Write any as `*` `` to `write-any-as-`. Collapsing or trimming
 * reports links that are in fact correct.
 *
 * @param {string} heading - Heading text without its leading hashes.
 * @returns {string} Slug used as the anchor.
 */
function toSlug (heading) {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, '')
    .replace(/ /gu, '-')
}

/**
 * Collect the anchor slug of every heading in a document.
 *
 * @param {string} markdown - Whole document.
 * @returns {Set<string>} Slugs the document offers.
 */
function collectSlugs (markdown) {
  const headings = stripFencedCode(markdown)
    .matchAll(/^#{1,6}\s+(.+?)\s*$/gmu)

  return new Set(
    [...headings].map(([, heading]) => toSlug(heading))
  )
}

/**
 * Collect every link target that must resolve inside this repository.
 *
 * @param {string} markdown - Whole document.
 * @returns {Array<string>} Targets, external URLs excluded.
 */
function collectInternalTargets (markdown) {
  const links = stripFencedCode(markdown)
    .matchAll(/\[[^\]]*\]\(([^)\s]+)\)/gu)

  return [...links]
    .map(([, target]) => target)
    .filter(target => !/^(?:https?|mailto):/u.test(target))
}

/**
 * Tell whether one link target resolves to a file and a heading that exist.
 *
 * @param {object} params - Parameters.
 * @param {string} params.target - Link target as written.
 * @param {string} params.filePath - Absolute path of the linking document.
 * @param {Set<string>} params.ownSlugs - Slugs the linking document offers.
 * @returns {boolean} Whether the target resolves.
 */
function isResolvable ({
  target,
  filePath,
  ownSlugs,
}) {
  const [path, anchor] = target.split('#')

  if (!path) {
    return ownSlugs.has(anchor)
  }

  const targetPath = resolve(filePath, '..', path)

  if (!existsSync(targetPath)) {
    return false
  }

  if (!anchor || !targetPath.endsWith('.md')) {
    return true
  }

  return collectSlugs(readFileSync(targetPath, 'utf8'))
    .has(anchor)
}

/**
 * Report every target of one document that resolves to nothing.
 *
 * @param {object} params - Parameters.
 * @param {string} params.filePath - Absolute path of the document.
 * @returns {Array<string>} Targets that resolve to nothing.
 */
function collectBrokenTargets ({
  filePath,
}) {
  const markdown = readFileSync(filePath, 'utf8')
  const ownSlugs = collectSlugs(markdown)

  return collectInternalTargets(markdown)
    .filter(target => !isResolvable({
      target,
      filePath,
      ownSlugs,
    }))
}

const cases = readdirSync(kitRoot, { recursive: true })
  .filter(entry => entry.endsWith('.md'))
  .map(entry => ({
    documentPath: `kit/${entry.replaceAll('\\', '/')}`,
    filePath: join(kitRoot, entry),
  }))
  .filter(({ filePath }) =>
    collectInternalTargets(readFileSync(filePath, 'utf8')).length > 0
  )

describe('Document links', () => {
  describe('resolve to a file and a heading that exist', () => {
    test.each(cases)('$documentPath', ({ filePath }) => {
      expect(collectBrokenTargets({ filePath }))
        .toEqual([])
    })
  })
})
