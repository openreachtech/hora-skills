import CommandLineArguments from '../../../lib/equip/CommandLineArguments.js'

describe('CommandLineArguments', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#args', () => {
        const cases = [
          {
            input: {
              args: [],
            },
            expected: [],
          },
          {
            input: {
              args: [
                'install',
              ],
            },
            expected: [
              'install',
            ],
          },
          {
            input: {
              args: [
                'list',
                '--domains',
                'backend',
              ],
            },
            expected: [
              'list',
              '--domains',
              'backend',
            ],
          },
        ]

        test.each(cases)('args: $input.args', ({ input, expected }) => {
          const commandLineArguments = new CommandLineArguments(input)

          expect(commandLineArguments)
            .toHaveProperty('args', expected)
        })
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            args: [],
          },
        },
        {
          input: {
            args: [
              'install',
              '--domains',
              'core',
            ],
          },
        },
      ]

      test.each(cases)('args: $input.args', ({ input }) => {
        const received = CommandLineArguments.create(input)

        expect(received)
          .toBeInstanceOf(CommandLineArguments)
      })
    })

    describe('should call constructor', () => {
      const cases = [
        {
          tally: {
            args: [],
          },
        },
        {
          tally: {
            args: [
              'uninstall',
            ],
          },
        },
      ]

      test.each(cases)('args: $tally.args', ({ tally }) => {
        const SpyClass = constructorSpy.spyOn(CommandLineArguments)

        SpyClass.create(tally)

        expect(SpyClass.__spy__)
          .toHaveBeenCalledWith(tally)
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('.get:initialParsedHash', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const expected = {
          commandNames: [],
          optionHash: {},
          pendingName: null,
        }

        const received = CommandLineArguments.initialParsedHash

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('.foldToken()', () => {
    describe('should hold a command name', () => {
      const cases = [
        {
          input: {
            parsedHash: {
              commandNames: [],
              optionHash: {},
              pendingName: null,
            },
            token: 'install',
          },
          expected: {
            commandNames: [
              'install',
            ],
            optionHash: {},
            pendingName: null,
          },
        },
        {
          input: {
            parsedHash: {
              commandNames: [
                'install',
              ],
              optionHash: {},
              pendingName: null,
            },
            token: 'extra',
          },
          expected: {
            commandNames: [
              'install',
              'extra',
            ],
            optionHash: {},
            pendingName: null,
          },
        },
      ]

      test.each(cases)('token: $input.token', ({ input, expected }) => {
        const received = CommandLineArguments.foldToken(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should hold an option name until its value arrives', () => {
      const cases = [
        {
          input: {
            parsedHash: {
              commandNames: [],
              optionHash: {},
              pendingName: null,
            },
            token: '--domains',
          },
          expected: {
            commandNames: [],
            optionHash: {},
            pendingName: 'domains',
          },
        },
        {
          input: {
            parsedHash: {
              commandNames: [],
              optionHash: {},
              pendingName: null,
            },
            token: '--dry-run',
          },
          expected: {
            commandNames: [],
            optionHash: {},
            pendingName: 'dry-run',
          },
        },
      ]

      test.each(cases)('token: $input.token', ({ input, expected }) => {
        const received = CommandLineArguments.foldToken(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should consume the token following an option name', () => {
      const cases = [
        {
          input: {
            parsedHash: {
              commandNames: [],
              optionHash: {},
              pendingName: 'domains',
            },
            token: 'backend',
          },
          expected: {
            commandNames: [],
            optionHash: {
              domains: 'backend',
            },
            pendingName: null,
          },
        },
        {
          input: {
            parsedHash: {
              commandNames: [
                'install',
              ],
              optionHash: {
                dir: 'skills',
              },
              pendingName: 'domains',
            },
            token: 'core',
          },
          expected: {
            commandNames: [
              'install',
            ],
            optionHash: {
              dir: 'skills',
              domains: 'core',
            },
            pendingName: null,
          },
        },
      ]

      test.each(cases)('token: $input.token', ({ input, expected }) => {
        const received = CommandLineArguments.foldToken(input)

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should split an option joined by an equals sign', () => {
      const cases = [
        {
          input: {
            parsedHash: {
              commandNames: [],
              optionHash: {},
              pendingName: null,
            },
            token: '--domains=backend',
          },
          expected: {
            commandNames: [],
            optionHash: {
              domains: 'backend',
            },
            pendingName: null,
          },
        },
        {
          input: {
            parsedHash: {
              commandNames: [],
              optionHash: {},
              pendingName: null,
            },
            token: '--dir=',
          },
          expected: {
            commandNames: [],
            optionHash: {
              dir: '',
            },
            pendingName: null,
          },
        },
      ]

      test.each(cases)('token: $input.token', ({ input, expected }) => {
        const received = CommandLineArguments.foldToken(input)

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('#get:Ctor', () => {
    describe('should be the constructor of the instance', () => {
      test('when instantiated as is', () => {
        const commandLineArguments = CommandLineArguments.create({
          args: [],
        })

        const received = commandLineArguments.Ctor

        expect(received)
          .toBe(CommandLineArguments) // same reference
      })

      test('when instantiated as a derived class', () => {
        class DerivedCommandLineArguments extends CommandLineArguments {}

        const commandLineArguments = DerivedCommandLineArguments.create({
          args: [],
        })

        const received = commandLineArguments.Ctor

        expect(received)
          .toBe(DerivedCommandLineArguments) // same reference
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('#extractCommand()', () => {
    describe('should extract the leading non-option token', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
          },
          expected: 'install',
        },
        {
          input: {
            args: [
              '--domains',
              'backend',
              'list',
            ],
          },
          expected: 'list',
        },
        {
          input: {
            args: [
              'uninstall',
              'extra',
            ],
          },
          expected: 'uninstall',
        },
        {
          input: {
            args: [],
          },
          expected: null,
        },
        {
          input: {
            args: [
              '--domains',
              'backend',
            ],
          },
          expected: null,
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const commandLineArguments = CommandLineArguments.create(input)

        const received = commandLineArguments.extractCommand()

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('#extractDomains()', () => {
    describe('should split the value by comma', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--domains',
              'backend',
            ],
          },
          expected: [
            'backend',
          ],
        },
        {
          input: {
            args: [
              'install',
              '--domains',
              'core,backend',
            ],
          },
          expected: [
            'core',
            'backend',
          ],
        },
        {
          input: {
            args: [
              'install',
              '--domains=core, frontend',
            ],
          },
          expected: [
            'core',
            'frontend',
          ],
        },
        {
          input: {
            args: [
              'install',
              '--domains',
              'core,,backend,',
            ],
          },
          expected: [
            'core',
            'backend',
          ],
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const commandLineArguments = CommandLineArguments.create(input)

        const received = commandLineArguments.extractDomains()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be null when the option is absent', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
          },
        },
        {
          input: {
            args: [
              'install',
              '--dir',
              'skills',
            ],
          },
        },
      ]

      test.each(cases)('args: $input.args', ({ input }) => {
        const commandLineArguments = CommandLineArguments.create(input)

        const received = commandLineArguments.extractDomains()

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('#extractOptionValue()', () => {
    describe('should extract the value of the named option', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--dir',
              'skills',
            ],
            name: 'dir',
          },
          expected: 'skills',
        },
        {
          input: {
            args: [
              'install',
              '--dir=skills',
            ],
            name: 'dir',
          },
          expected: 'skills',
        },
        {
          input: {
            args: [
              'install',
              '--dir',
              'skills',
            ],
            name: 'domains',
          },
          expected: null,
        },
      ]

      test.each(cases)('name: $input.name', ({ input, expected }) => {
        const commandLineArguments = CommandLineArguments.create({
          args: input.args,
        })
        const args = {
          name: input.name,
        }

        const received = commandLineArguments.extractOptionValue(args)

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('CommandLineArguments', () => {
  describe('#extractTargetDirectoryPath()', () => {
    describe('should extract the value of the dir option', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--dir',
              '.claude/skills',
            ],
          },
          expected: '.claude/skills',
        },
        {
          input: {
            args: [
              'install',
              '--dir=/tmp/skills',
            ],
          },
          expected: '/tmp/skills',
        },
        {
          input: {
            args: [
              'install',
            ],
          },
          expected: null,
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const commandLineArguments = CommandLineArguments.create(input)

        const received = commandLineArguments.extractTargetDirectoryPath()

        expect(received)
          .toBe(expected)
      })
    })
  })
})
