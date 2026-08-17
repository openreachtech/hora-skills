import SKILL_DOMAIN_PREFIX from '../../../../lib/equip/constants/SKILL_DOMAIN_PREFIX.js'

import SKILL_DOMAIN from '../../../../lib/equip/constants/SKILL_DOMAIN.js'

describe('SKILL_DOMAIN_PREFIX', () => {
  describe('when referenced as is', () => {
    test('should be fixed value', () => {
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

describe('SKILL_DOMAIN_PREFIX', () => {
  describe('should be keyed by a domain name', () => {
    const cases = [
      {
        input: {
          domain: SKILL_DOMAIN.CORE,
        },
        expected: 'hc',
      },
      {
        input: {
          domain: SKILL_DOMAIN.BACKEND,
        },
        expected: 'hb',
      },
      {
        input: {
          domain: SKILL_DOMAIN.FRONTEND,
        },
        expected: 'hf',
      },
    ]

    test.each(cases)('domain: $input.domain', ({ input, expected }) => {
      const received = SKILL_DOMAIN_PREFIX[input.domain]

      expect(received)
        .toBe(expected)
    })
  })
})
