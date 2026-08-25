import SkillDomainFilter from '../../../lib/equip/SkillDomainFilter.js'

import SKILL_DOMAIN_PREFIX from '../../../lib/equip/constants/SKILL_DOMAIN_PREFIX.js'

describe('SkillDomainFilter', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#domains', () => {
        const cases = [
          {
            input: {
              domains: [
                'core',
              ],
            },
            expected: [
              'core',
            ],
          },
          {
            input: {
              domains: [
                'backend',
                'frontend',
              ],
            },
            expected: [
              'backend',
              'frontend',
            ],
          },
          {
            input: {
              domains: [],
            },
            expected: [],
          },
        ]

        test.each(cases)('domains: $input.domains', ({ input, expected }) => {
          const filter = new SkillDomainFilter(input)

          expect(filter)
            .toHaveProperty('domains', expected)
        })
      })
    })
  })
})

describe('SkillDomainFilter', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            domains: [
              'backend',
            ],
          },
        },
        {
          input: {
            domains: null,
          },
        },
      ]

      test.each(cases)('domains: $input.domains', ({ input }) => {
        const received = SkillDomainFilter.create(input)

        expect(received)
          .toBeInstanceOf(SkillDomainFilter)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          tally: {
            domains: [
              'backend',
            ],
          },
        },
        {
          tally: {
            domains: [
              'core',
              'frontend',
            ],
          },
        },
      ]

      test.each(cases)('domains: $tally.domains', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(SkillDomainFilter)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })

    describe('should fill default domains', () => {
      const cases = [
        {
          override: {
            defaultDomains: [
              'alpha',
              'beta',
            ],
          },
          expected: {
            domains: [
              'alpha',
              'beta',
            ],
          },
        },
        {
          override: {
            defaultDomains: [
              'gamma',
            ],
          },
          expected: {
            domains: [
              'gamma',
            ],
          },
        },
      ]

      test.each(cases)('defaultDomains: $override.defaultDomains', ({ override, expected }) => {
        jest.spyOn(SkillDomainFilter, 'buildDefaultDomains')
          .mockReturnValue(override.defaultDomains)

        const SpyClass = constructorSpy.spyOn(SkillDomainFilter)

        SpyClass.create()

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(expected)
      })
    })
  })
})

describe('SkillDomainFilter', () => {
  describe('.get:domainPrefixHash', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = SkillDomainFilter.domainPrefixHash

        expect(received)
          .toBe(SKILL_DOMAIN_PREFIX) // same reference
      })
    })
  })
})

describe('SkillDomainFilter', () => {
  describe('.buildDefaultDomains()', () => {
    describe('should be the domains of the prefix hash', () => {
      const cases = [
        {
          override: {
            domainPrefixHash: {
              alpha: 'ha',
              beta: 'hb',
            },
          },
          expected: [
            'alpha',
            'beta',
          ],
        },
        {
          override: {
            domainPrefixHash: {
              gamma: 'hg',
            },
          },
          expected: [
            'gamma',
          ],
        },
      ]

      test.each(cases)('domainPrefixHash: $override.domainPrefixHash', ({ override, expected }) => {
        jest.spyOn(SkillDomainFilter, 'domainPrefixHash', 'get')
          .mockReturnValue(override.domainPrefixHash)

        const received = SkillDomainFilter.buildDefaultDomains()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('SkillDomainFilter', () => {
  describe('#get:Ctor', () => {
    describe('should be the constructor of the instance', () => {
      test('when instantiated as is', () => {
        const filter = SkillDomainFilter.create()

        const received = filter.Ctor

        expect(received)
          .toBe(SkillDomainFilter) // same reference
      })

      test('when instantiated as a derived class', () => {
        class DerivedSkillDomainFilter extends SkillDomainFilter {}

        const filter = DerivedSkillDomainFilter.create()

        const received = filter.Ctor

        expect(received)
          .toBe(DerivedSkillDomainFilter) // same reference
      })
    })
  })
})

describe('SkillDomainFilter', () => {
  describe('#extractUnknownDomains()', () => {
    describe('should extract the domains this package does not distribute', () => {
      const cases = [
        {
          input: {
            domains: [
              'core',
              'backend',
              'frontend',
              'support',
            ],
          },
          expected: [],
        },
        {
          input: {
            domains: [
              '_core',
            ],
          },
          expected: [
            '_core',
          ],
        },
        {
          input: {
            domains: [
              'bogus',
            ],
          },
          expected: [
            'bogus',
          ],
        },
        {
          input: {
            domains: [
              'backend',
              'bogus',
              'typo',
            ],
          },
          expected: [
            'bogus',
            'typo',
          ],
        },
      ]

      test.each(cases)('domains: $input.domains', ({ input, expected }) => {
        const filter = SkillDomainFilter.create(input)

        const received = filter.extractUnknownDomains()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('SkillDomainFilter', () => {
  describe('#filterSkillNames()', () => {
    describe('should keep only the skills of the selected domains', () => {
      const cases = [
        {
          input: {
            domains: [
              'core',
            ],
          },
          expected: [
            'hc-naming',
          ],
        },
        {
          input: {
            domains: [
              '_core',
            ],
          },
          expected: [],
        },
        {
          input: {
            domains: [
              'backend',
            ],
          },
          expected: [
            'hb-query-resolver',
          ],
        },
        {
          input: {
            domains: [
              'core',
              'frontend',
            ],
          },
          expected: [
            'hc-naming',
            'hf-cp-table',
          ],
        },
        {
          input: {
            domains: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('domains: $input.domains', ({ input, expected }) => {
        const filter = SkillDomainFilter.create(input)
        const args = {
          skillNames: [
            'hc-naming',
            'hb-query-resolver',
            'hf-cp-table',
            'my-own-skill',
          ],
        }

        const received = filter.filterSkillNames(args)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should not match a name that merely starts with the prefix letters', () => {
      const cases = [
        {
          input: {
            skillNames: [
              'hcnaming',
            ],
          },
        },
        {
          input: {
            skillNames: [
              'hcore-thing',
            ],
          },
        },
        {
          input: {
            skillNames: [
              'chc-naming',
            ],
          },
        },
      ]

      test.each(cases)('skillNames: $input.skillNames', ({ input }) => {
        const filter = SkillDomainFilter.create({
          domains: [
            'core',
          ],
        })

        const received = filter.filterSkillNames(input)

        expect(received)
          .toEqual([])
      })
    })
  })
})

describe('SkillDomainFilter', () => {
  describe('#buildPrefixes()', () => {
    describe('should be the prefixes of the selected domains', () => {
      const cases = [
        {
          input: {
            domains: [
              'core',
            ],
          },
          expected: [
            'hc',
          ],
        },
        {
          input: {
            domains: [
              'backend',
              'frontend',
            ],
          },
          expected: [
            'hb',
            'hf',
          ],
        },
        {
          input: {
            domains: [
              'core',
              'bogus',
            ],
          },
          expected: [
            'hc',
          ],
        },
        {
          input: {
            domains: [],
          },
          expected: [],
        },
      ]

      test.each(cases)('domains: $input.domains', ({ input, expected }) => {
        const filter = SkillDomainFilter.create(input)

        const received = filter.buildPrefixes()

        expect(received)
          .toEqual(expected)
      })
    })
  })
})
