import path from 'node:path'

import HoraSkillsCli from '../../../lib/equip/HoraSkillsCli.js'

import CommandLineArguments from '../../../lib/equip/CommandLineArguments.js'
import ConsumerPackageConfig from '../../../lib/equip/ConsumerPackageConfig.js'
import SkillDomainFilter from '../../../lib/equip/SkillDomainFilter.js'
import SkillsInstaller from '../../../lib/equip/SkillsInstaller.js'

describe('HoraSkillsCli', () => {
  describe('constructor', () => {
    describe('should keep property', () => {
      describe('#commandLineArguments', () => {
        const cases = [
          {
            input: {
              commandLineArguments: CommandLineArguments.create({
                args: [
                  'install',
                ],
              }),
            },
          },
          {
            input: {
              commandLineArguments: CommandLineArguments.create({
                args: [],
              }),
            },
          },
        ]

        test.each(cases)('args: $input.commandLineArguments.args', ({ input }) => {
          const args = {
            commandLineArguments: input.commandLineArguments,
            packageConfig: null,
            workingDirectoryPath: '',
            logger: null,
          }

          const cli = new HoraSkillsCli(args)

          expect(cli)
            .toHaveProperty('commandLineArguments', input.commandLineArguments)
        })
      })

      describe('#packageConfig', () => {
        const cases = [
          {
            input: {
              packageConfig: ConsumerPackageConfig.create({
                directoryPath: '/consumer',
              }),
            },
          },
          {
            input: {
              packageConfig: ConsumerPackageConfig.create({
                directoryPath: '/tmp',
              }),
            },
          },
        ]

        test.each(cases)('filePath: $input.packageConfig.filePath', ({ input }) => {
          const args = {
            commandLineArguments: null,
            packageConfig: input.packageConfig,
            workingDirectoryPath: '',
            logger: null,
          }

          const cli = new HoraSkillsCli(args)

          expect(cli)
            .toHaveProperty('packageConfig', input.packageConfig)
        })
      })

      describe('#workingDirectoryPath', () => {
        const cases = [
          {
            input: {
              workingDirectoryPath: '/consumer',
            },
            expected: '/consumer',
          },
          {
            input: {
              workingDirectoryPath: '/tmp/consumer',
            },
            expected: '/tmp/consumer',
          },
        ]

        test.each(cases)('workingDirectoryPath: $input.workingDirectoryPath', ({ input, expected }) => {
          const args = {
            commandLineArguments: null,
            packageConfig: null,
            workingDirectoryPath: input.workingDirectoryPath,
            logger: null,
          }

          const cli = new HoraSkillsCli(args)

          expect(cli)
            .toHaveProperty('workingDirectoryPath', expected)
        })
      })

      describe('#logger', () => {
        const cases = [
          {
            input: {
              logger: console,
            },
          },
          {
            input: {
              logger: {
                log: () => {},
                error: () => {},
              },
            },
          },
        ]

        test.each(cases)('logger: $input.logger', ({ input }) => {
          const args = {
            commandLineArguments: null,
            packageConfig: null,
            workingDirectoryPath: '',
            logger: input.logger,
          }

          const cli = new HoraSkillsCli(args)

          expect(cli)
            .toHaveProperty('logger', input.logger)
        })
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.create()', () => {
    describe('should be an instance of own class', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
            workingDirectoryPath: '/consumer',
          },
        },
        {
          input: {
            args: [],
            workingDirectoryPath: '/tmp',
          },
        },
      ]

      test.each(cases)('args: $input.args', ({ input }) => {
        const received = HoraSkillsCli.create(input)

        expect(received)
          .toBeInstanceOf(HoraSkillsCli)
      })
    })

    describe('should hand the working directory to the package config', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
          },
          expected: '/consumer/package.json',
        },
        {
          input: {
            workingDirectoryPath: '/tmp/consumer',
          },
          expected: '/tmp/consumer/package.json',
        },
      ]

      test.each(cases)('workingDirectoryPath: $input.workingDirectoryPath', ({ input, expected }) => {
        const args = {
          args: [],
          workingDirectoryPath: input.workingDirectoryPath,
        }

        const cli = HoraSkillsCli.create(args)
        const received = cli.packageConfig.filePath

        expect(received)
          .toBe(expected)
      })
    })

    describe('should fill default workingDirectoryPath', () => {
      test('when omitted', () => {
        const args = {
          args: [],
        }

        const cli = HoraSkillsCli.create(args)

        expect(cli)
          .toHaveProperty('workingDirectoryPath', process.cwd())
      })
    })

    describe('should fill default logger', () => {
      test('when omitted', () => {
        const args = {
          args: [],
        }

        const cli = HoraSkillsCli.create(args)

        expect(cli)
          .toHaveProperty('logger', console)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.runPostinstall()', () => {
    describe('should equip a consuming repository', () => {
      test('when the repository is not this package', () => {
        jest.spyOn(HoraSkillsCli, 'isOwnRepository')
          .mockReturnValue(false)

        const runSpy = jest.spyOn(HoraSkillsCli.prototype, 'run')
          .mockReturnValue(0)

        const received = HoraSkillsCli.runPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        expect(runSpy)
          .toHaveBeenCalledWith()
        expect(received)
          .toBe(0)
      })
    })

    describe('should equip nothing in this package itself', () => {
      test('when the repository is this package', () => {
        jest.spyOn(HoraSkillsCli, 'isOwnRepository')
          .mockReturnValue(true)

        const runSpy = jest.spyOn(HoraSkillsCli.prototype, 'run')
          .mockReturnValue(0)

        const received = HoraSkillsCli.runPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        expect(runSpy)
          .not
          .toHaveBeenCalled()
        expect(received)
          .toBe(0)
      })
    })

    describe('should end successfully on a failed install', () => {
      const cases = [
        {
          override: {
            exitCode: 1,
          },
        },
      ]

      test.each(cases)('exitCode: $override.exitCode', ({ override }) => {
        jest.spyOn(HoraSkillsCli, 'isOwnRepository')
          .mockReturnValue(false)
        jest.spyOn(HoraSkillsCli.prototype, 'run')
          .mockReturnValue(override.exitCode)

        const errorSpy = jest.fn()

        const received = HoraSkillsCli.runPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: errorSpy,
          },
        })

        expect(received)
          .toBe(0)
        expect(errorSpy)
          .toHaveBeenCalledWith('The skills were not installed. Run `npx hora-skills install` once the above is settled.')
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.createForPostinstall()', () => {
    describe('should install into the repository npm exports', () => {
      const cases = [
        {
          input: {
            env: {
              npm_config_local_prefix: '/consumer',
            },
          },
          expected: '/consumer',
        },
        {
          input: {
            env: {
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/elsewhere',
        },
      ]

      test.each(cases)('env: $input.env', ({ input, expected }) => {
        const cli = HoraSkillsCli.createForPostinstall({
          env: input.env,
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        expect(cli)
          .toHaveProperty('workingDirectoryPath', expected)
      })
    })

    describe('should run the install command', () => {
      test('when created as is', () => {
        const cli = HoraSkillsCli.createForPostinstall({
          env: {
            npm_config_local_prefix: '/consumer',
          },
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const received = cli.commandLineArguments.extractCommand()

        expect(received)
          .toBe('install')
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.extractConsumerDirectoryPath()', () => {
    describe('should prefer the local prefix over the initial directory', () => {
      const cases = [
        {
          input: {
            env: {
              npm_config_local_prefix: '/consumer',
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/consumer',
        },
        {
          input: {
            env: {
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/elsewhere',
        },
        {
          input: {
            env: {
              npm_config_local_prefix: '',
              INIT_CWD: '/elsewhere',
            },
          },
          expected: '/elsewhere',
        },
      ]

      test.each(cases)('env: $input.env', ({ input, expected }) => {
        const received = HoraSkillsCli.extractConsumerDirectoryPath(input)

        expect(received)
          .toBe(expected)
      })
    })

    describe('should fall back to the working directory', () => {
      test('when npm exported neither', () => {
        const received = HoraSkillsCli.extractConsumerDirectoryPath({
          env: {},
        })

        expect(received)
          .toBe(process.cwd())
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.get:ownPackageName', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraSkillsCli.ownPackageName

        expect(received)
          .toBe('@openreachtech/hora-skills')
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.isOwnRepository()', () => {
    describe('should tell this package apart from a consuming repository', () => {
      const cases = [
        {
          override: {
            name: '@openreachtech/hora-skills',
          },
          expected: true,
        },
        {
          override: {
            name: 'alpha-app',
          },
          expected: false,
        },
        {
          override: {
            name: null,
          },
          expected: false,
        },
      ]

      test.each(cases)('name: $override.name', ({ override, expected }) => {
        jest.spyOn(ConsumerPackageConfig.prototype, 'extractName')
          .mockReturnValue(override.name)

        const received = HoraSkillsCli.isOwnRepository({
          env: {
            npm_config_local_prefix: '/consumer',
          },
        })

        expect(received)
          .toBe(expected)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.get:CommandLineArgumentsCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraSkillsCli.CommandLineArgumentsCtor

        expect(received)
          .toBe(CommandLineArguments) // same reference
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.get:ConsumerPackageConfigCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraSkillsCli.ConsumerPackageConfigCtor

        expect(received)
          .toBe(ConsumerPackageConfig) // same reference
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.get:SkillDomainFilterCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraSkillsCli.SkillDomainFilterCtor

        expect(received)
          .toBe(SkillDomainFilter) // same reference
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.get:SkillsInstallerCtor', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = HoraSkillsCli.SkillsInstallerCtor

        expect(received)
          .toBe(SkillsInstaller) // same reference
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('.get:defaultTargetDirectorySegments', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const expected = [
          '.claude',
          'skills',
        ]

        const received = HoraSkillsCli.defaultTargetDirectorySegments

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#run()', () => {
    describe('should dispatch to the command', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
          },
          expected: 'runInstall',
        },
        {
          input: {
            args: [
              'list',
            ],
          },
          expected: 'runSelection',
        },
        {
          input: {
            args: [
              'uninstall',
            ],
          },
          expected: 'runUninstall',
        },
        {
          input: {
            args: [
              'help',
            ],
          },
          expected: 'runHelp',
        },
        {
          input: {
            args: [],
          },
          expected: 'runHelp',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraSkillsCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const commandSpy = jest.spyOn(cli, expected)
          .mockReturnValue(0)

        cli.run()

        expect(commandSpy)
          .toHaveBeenCalledWith()
      })
    })

    describe('should report a command it does not have', () => {
      const cases = [
        {
          input: {
            args: [
              'bogus',
            ],
          },
          expected: 'Unknown command: bogus',
        },
        {
          input: {
            args: [
              'installl',
            ],
          },
          expected: 'Unknown command: installl',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraSkillsCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger,
        })

        const received = cli.run()

        expect(logger.error)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(1)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#runInstall()', () => {
    describe('should refuse a domain this package does not distribute', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--domains',
              'bogus',
            ],
          },
          expected: 'Unknown domain: bogus',
        },
        {
          input: {
            args: [
              'install',
              '--domains',
              'backend,typo',
            ],
          },
          expected: 'Unknown domain: typo',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraSkillsCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger,
        })

        const received = cli.runInstall()

        expect(logger.error)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(1)
      })
    })

    describe('should install the selected skills', () => {
      const cases = [
        {
          override: {
            installResult: {
              installedSkillNames: [
                'hb-query-resolver',
              ],
              removedSkillNames: [],
            },
          },
          expected: 'Installed 1 skills into /consumer/.claude/skills',
        },
        {
          override: {
            installResult: {
              installedSkillNames: [
                'hc-naming',
                'hc-jsdoc',
              ],
              removedSkillNames: [
                'hf-css',
              ],
            },
          },
          expected: 'Installed 2 skills into /consumer/.claude/skills',
        },
      ]

      test.each(cases)('installedSkillNames: $override.installResult.installedSkillNames', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraSkillsCli.create({
          args: [
            'install',
            '--domains',
            'backend',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(SkillsInstaller.prototype, 'install')
          .mockReturnValue(override.installResult)

        const received = cli.runInstall()

        expect(logger.log)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(0)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#resolveDomains()', () => {
    describe('should prefer the command line over the package config', () => {
      const cases = [
        {
          override: {
            declaredDomains: [
              'frontend',
            ],
          },
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
          override: {
            declaredDomains: null,
          },
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
      ]

      test.each(cases)('args: $input.args', ({ override, input, expected }) => {
        const cli = HoraSkillsCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(cli.packageConfig, 'extractDomains')
          .mockReturnValue(override.declaredDomains)

        const received = cli.resolveDomains()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should fall back to the package config', () => {
      const cases = [
        {
          override: {
            declaredDomains: [
              'frontend',
            ],
          },
          expected: [
            'frontend',
          ],
        },
        {
          override: {
            declaredDomains: [
              'core',
            ],
          },
          expected: [
            'core',
          ],
        },
      ]

      test.each(cases)('declaredDomains: $override.declaredDomains', ({ override, expected }) => {
        const cli = HoraSkillsCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(cli.packageConfig, 'extractDomains')
          .mockReturnValue(override.declaredDomains)

        const received = cli.resolveDomains()

        expect(received)
          .toEqual(expected)
      })
    })

    describe('should be null when nothing selects a domain', () => {
      test('when neither the command line nor the package config declares one', () => {
        const cli = HoraSkillsCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(cli.packageConfig, 'extractDomains')
          .mockReturnValue(null)

        const received = cli.resolveDomains()

        expect(received)
          .toBeNull()
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#buildDomainFilter()', () => {
    describe('should fall back to every domain', () => {
      test('when nothing selects a domain', () => {
        const expected = [
          'core',
          'backend',
          'frontend',
        ]

        const cli = HoraSkillsCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        jest.spyOn(cli.packageConfig, 'extractDomains')
          .mockReturnValue(null)

        const domainFilter = cli.buildDomainFilter()
        const received = domainFilter.domains

        expect(received)
          .toEqual(expected)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#buildSkillsInstaller()', () => {
    describe('should build the installer with the working and the target directory', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
            ],
            workingDirectoryPath: '/consumer',
          },
          expected: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/.claude/skills',
          },
        },
        {
          input: {
            args: [
              'install',
              '--dir',
              'tools/skills',
            ],
            workingDirectoryPath: '/consumer',
          },
          expected: {
            workingDirectoryPath: '/consumer',
            targetDirectoryPath: '/consumer/tools/skills',
          },
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraSkillsCli.create({
          args: input.args,
          workingDirectoryPath: input.workingDirectoryPath,
          logger: {
            log: () => {},
            error: () => {},
          },
        })
        const domainFilter = SkillDomainFilter.create()

        const createSkillsInstallerSpy = jest.spyOn(HoraSkillsCli, 'createSkillsInstaller')
          .mockReturnValue(null)

        cli.buildSkillsInstaller({
          domainFilter,
        })

        expect(createSkillsInstallerSpy)
          .toHaveBeenCalledWith({
            workingDirectoryPath: expected.workingDirectoryPath,
            targetDirectoryPath: expected.targetDirectoryPath,
            domainFilter,
          })
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#buildTargetDirectoryPath()', () => {
    describe('should be the .claude/skills of the working directory', () => {
      const cases = [
        {
          input: {
            workingDirectoryPath: '/consumer',
          },
          expected: '/consumer/.claude/skills',
        },
        {
          input: {
            workingDirectoryPath: '/tmp/consumer',
          },
          expected: '/tmp/consumer/.claude/skills',
        },
      ]

      test.each(cases)('workingDirectoryPath: $input.workingDirectoryPath', ({ input, expected }) => {
        const cli = HoraSkillsCli.create({
          args: [
            'install',
          ],
          workingDirectoryPath: input.workingDirectoryPath,
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const received = cli.buildTargetDirectoryPath()

        expect(received)
          .toBe(expected)
      })
    })

    describe('should resolve the given directory against the working directory', () => {
      const cases = [
        {
          input: {
            args: [
              'install',
              '--dir',
              'skills',
            ],
          },
          expected: '/consumer/skills',
        },
        {
          input: {
            args: [
              'install',
              '--dir',
              '/tmp/skills',
            ],
          },
          expected: '/tmp/skills',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const cli = HoraSkillsCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger: {
            log: () => {},
            error: () => {},
          },
        })

        const received = cli.buildTargetDirectoryPath()

        expect(received)
          .toBe(path.normalize(expected))
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#runSelection()', () => {
    describe('should print each selected skill', () => {
      const cases = [
        {
          override: {
            selectedSkillNames: [
              'hb-query-resolver',
            ],
          },
          expected: '1 skills selected (backend)',
        },
        {
          override: {
            selectedSkillNames: [
              'hb-query-resolver',
              'hb-stub-api',
            ],
          },
          expected: '2 skills selected (backend)',
        },
      ]

      test.each(cases)('selectedSkillNames: $override.selectedSkillNames', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraSkillsCli.create({
          args: [
            'list',
            '--domains',
            'backend',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(SkillsInstaller.prototype, 'selectSkillNames')
          .mockReturnValue(override.selectedSkillNames)

        const received = cli.runSelection()

        expect(logger.log)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(0)
      })
    })

    describe('should refuse a domain this package does not distribute', () => {
      const cases = [
        {
          input: {
            args: [
              'list',
              '--domains',
              'bogus',
            ],
          },
          expected: 'Unknown domain: bogus',
        },
        {
          input: {
            args: [
              'list',
              '--domains',
              'typo',
            ],
          },
          expected: 'Unknown domain: typo',
        },
      ]

      test.each(cases)('args: $input.args', ({ input, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraSkillsCli.create({
          args: input.args,
          workingDirectoryPath: '/consumer',
          logger,
        })

        const received = cli.runSelection()

        expect(logger.error)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(1)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#runUninstall()', () => {
    describe('should report the removed skills', () => {
      const cases = [
        {
          override: {
            uninstallResult: {
              removedSkillNames: [
                'hb-query-resolver',
              ],
            },
          },
          expected: 'Removed 1 skills from /consumer/.claude/skills',
        },
        {
          override: {
            uninstallResult: {
              removedSkillNames: [],
            },
          },
          expected: 'Removed 0 skills from /consumer/.claude/skills',
        },
      ]

      test.each(cases)('removedSkillNames: $override.uninstallResult.removedSkillNames', ({ override, expected }) => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraSkillsCli.create({
          args: [
            'uninstall',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        jest.spyOn(SkillsInstaller.prototype, 'uninstall')
          .mockReturnValue(override.uninstallResult)

        const received = cli.runUninstall()

        expect(logger.log)
          .toHaveBeenCalledWith(expected)
        expect(received)
          .toBe(0)
      })
    })
  })
})

describe('HoraSkillsCli', () => {
  describe('#runHelp()', () => {
    describe('when called as is', () => {
      test('should print the usage text', () => {
        const logger = {
          log: jest.fn(),
          error: jest.fn(),
        }
        const cli = HoraSkillsCli.create({
          args: [
            'help',
          ],
          workingDirectoryPath: '/consumer',
          logger,
        })

        const received = cli.runHelp()

        expect(logger.log)
          .toHaveBeenCalledWith(HoraSkillsCli.usageText)
        expect(received)
          .toBe(0)
      })
    })
  })
})
