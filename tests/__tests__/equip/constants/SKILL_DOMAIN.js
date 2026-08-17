import SKILL_DOMAIN from '../../../../lib/equip/constants/SKILL_DOMAIN.js'

describe('SKILL_DOMAIN', () => {
  describe('when referenced as is', () => {
    test('should be fixed value', () => {
      const expected = {
        CORE: 'core',
        BACKEND: 'backend',
        FRONTEND: 'frontend',
      }

      const received = SKILL_DOMAIN

      expect(received)
        .toEqual(expected)
    })
  })
})

describe('SKILL_DOMAIN', () => {
  describe('should name a domain directory of kit/skills/', () => {
    const cases = [
      {
        input: {
          domain: SKILL_DOMAIN.CORE,
        },
        expected: 'core',
      },
      {
        input: {
          domain: SKILL_DOMAIN.BACKEND,
        },
        expected: 'backend',
      },
      {
        input: {
          domain: SKILL_DOMAIN.FRONTEND,
        },
        expected: 'frontend',
      },
    ]

    test.each(cases)('domain: $expected', ({ input, expected }) => {
      const received = input.domain

      expect(received)
        .toBe(expected)
    })
  })
})
