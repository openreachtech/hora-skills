import {
  readFileSync,
} from 'node:fs'
import {
  join,
} from 'node:path'
import {
  fileURLToPath,
} from 'node:url'

import SKILL_DOMAIN_PREFIX from '../../../lib/equip/constants/SKILL_DOMAIN_PREFIX.js'

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url))

/*
 * Which prefix belongs to which domain is written out in both maintenance scripts and
 * in the installer's own constant, on purpose, so that neither the scripts nor the
 * published library has to import from the other. This pins the three copies to one
 * another: changing the table in one place alone fails here.
 */
describe('Skill domain prefix table', () => {
  describe('is declared identically by every script that enforces it', () => {
    const cases = [
      { scriptPath: '.claude/skills/audit/scripts/audit.js' },
      { scriptPath: '.claude/skills/flatten/scripts/build.js' },
    ]

    test.each(cases)('$scriptPath', ({ scriptPath }) => {
      const content = readFileSync(join(repoRoot, scriptPath), 'utf8')

      expect(content)
        .toContain("const DOMAIN_PREFIX = {\n  core: 'hc',\n  backend: 'hb',\n  frontend: 'hf',\n}")
    })
  })
})

describe('Skill domain prefix table', () => {
  describe('is the table the installer resolves at runtime', () => {
    test('SKILL_DOMAIN_PREFIX', () => {
      const expected = {
        core: 'hc',
        backend: 'hb',
        frontend: 'hf',
      }

      const received = SKILL_DOMAIN_PREFIX

      expect(received)
        .toEqual(expected)
    })
  })
})
