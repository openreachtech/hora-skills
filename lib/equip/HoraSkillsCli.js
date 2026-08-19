import fs from 'node:fs'
import path from 'node:path'

import CommandLineArguments from './CommandLineArguments.js'
import ConsumerPackageConfig from './ConsumerPackageConfig.js'
import SkillDomainFilter from './SkillDomainFilter.js'
import SkillsInstaller from './SkillsInstaller.js'

import CLI_COMMAND from './constants/CLI_COMMAND.js'

/**
 * The `hora-skills` command.
 *
 * It resolves which domains to install from the command line, then from the consuming
 * repository's package.json, and finally falls back to every domain.
 */
export default class HoraSkillsCli {
  /**
   * Constructor.
   *
   * @param {{
   *   commandLineArguments: CommandLineArguments
   *   packageConfig: ConsumerPackageConfig
   *   workingDirectoryPath: string
   *   logger: Console
   * }} params - Parameters.
   */
  constructor ({
    commandLineArguments,
    packageConfig,
    workingDirectoryPath,
    logger,
  }) {
    this.commandLineArguments = commandLineArguments
    this.packageConfig = packageConfig
    this.workingDirectoryPath = workingDirectoryPath
    this.logger = logger
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof HoraSkillsCli ? X : never} T, X
   * @param {{
   *   args: Array<string>
   *   workingDirectoryPath?: string
   *   logger?: Console
   * }} params - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    args,
    workingDirectoryPath = process.cwd(),
    logger = console,
  }) {
    const commandLineArguments = this.createCommandLineArguments({
      args,
    })
    const packageConfig = this.createConsumerPackageConfig({
      directoryPath: workingDirectoryPath,
    })

    return new this({
      commandLineArguments,
      packageConfig,
      workingDirectoryPath,
      logger,
    })
  }

  /**
   * Equip the repository that installed this package.
   *
   * Installing this package is the request to equip a repository with its skills, so the
   * `postinstall` performs it. A failure leaves the repository without the skills, but the
   * package itself is installed either way, so this never reports one — it says so and
   * ends successfully, rather than failing the whole `npm install`.
   *
   * @param {{
   *   env?: Record<string, string | undefined>
   *   logger?: Console
   * }} [params] - Parameters.
   * @returns {number} Exit code, always zero.
   * @public
   */
  static runPostinstall ({
    env = process.env,
    logger = console,
  } = {}) {
    if (this.isOwnRepository({ env })) {
      return 0
    }

    const exitCode = this.createForPostinstall({
      env,
      logger,
    })
      .run()

    if (exitCode !== 0) {
      logger.error('The skills were not installed. Run `npx hora-skills install` once the above is settled.')
    }

    return 0
  }

  /**
   * Factory method for the `postinstall` of this package.
   *
   * @template {X extends typeof HoraSkillsCli ? X : never} T, X
   * @param {{
   *   env?: Record<string, string | undefined>
   *   logger?: Console
   * }} [params] - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static createForPostinstall ({
    env = process.env,
    logger = console,
  } = {}) {
    return this.create({
      args: [
        CLI_COMMAND.INSTALL,
      ],
      workingDirectoryPath: this.extractConsumerDirectoryPath({
        env,
      }),
      logger,
    })
  }

  /**
   * Extract the directory of the repository that installed this package.
   *
   * A `postinstall` runs with this package's own directory as the working directory, so
   * the repository has to be read from what npm exports instead.
   *
   * @param {{
   *   env: Record<string, string | undefined>
   * }} params - Parameters.
   * @returns {string} Directory of the consuming repository.
   */
  static extractConsumerDirectoryPath ({
    env,
  }) {
    return env.npm_config_local_prefix
      || env.INIT_CWD
      || process.cwd()
  }

  /**
   * Name of this package.
   *
   * @returns {string} Name of this package.
   */
  static get ownPackageName () {
    return '@openreachtech/hora-skills'
  }

  /**
   * Tell whether the repository that installed this package is this package itself.
   *
   * Running `npm install` in this repository fires its own `postinstall`, which would
   * copy the build output over the skills this repository develops. The source lives in
   * `kit/skills/`, so there is nothing to equip here.
   *
   * @param {{
   *   env?: Record<string, string | undefined>
   * }} [params] - Parameters.
   * @returns {boolean} Whether the consuming repository is this package.
   * @public
   */
  static isOwnRepository ({
    env = process.env,
  } = {}) {
    const packageConfig = this.createConsumerPackageConfig({
      directoryPath: this.extractConsumerDirectoryPath({ env }),
    })

    return packageConfig.extractName() === this.ownPackageName
  }

  /**
   * Constructor of the command line arguments.
   *
   * @returns {typeof CommandLineArguments} Constructor of the command line arguments.
   */
  static get CommandLineArgumentsCtor () {
    return CommandLineArguments
  }

  /**
   * Constructor of the consuming repository's configuration.
   *
   * @returns {typeof ConsumerPackageConfig} Constructor of the configuration.
   */
  static get ConsumerPackageConfigCtor () {
    return ConsumerPackageConfig
  }

  /**
   * Constructor of the domain filter.
   *
   * @returns {typeof SkillDomainFilter} Constructor of the domain filter.
   */
  static get SkillDomainFilterCtor () {
    return SkillDomainFilter
  }

  /**
   * Constructor of the installer.
   *
   * @returns {typeof SkillsInstaller} Constructor of the installer.
   */
  static get SkillsInstallerCtor () {
    return SkillsInstaller
  }

  /**
   * Directory the skills are installed into, relative to the consuming repository.
   *
   * @returns {Array<string>} Path segments of the default target directory.
   */
  static get defaultTargetDirectorySegments () {
    return [
      '.claude',
      'skills',
    ]
  }

  /**
   * Build the path of every step from a base directory down to a path below it.
   *
   * The steps are what a path is reached through, so verifying a path means verifying
   * each of them — a link at any one of them redirects everything below it.
   *
   * @param {{
   *   basePath: string
   *   targetPath: string
   * }} params - Parameters.
   * @returns {Array<string>} Path of every step, the target path last.
   */
  static buildPathSteps ({
    basePath,
    targetPath,
  }) {
    return path.relative(basePath, targetPath)
      .split(path.sep)
      .filter(it => it !== '')
      .reduce(
        (steps, segment) => [
          ...steps,
          path.join(
            steps.at(-1) ?? basePath,
            segment
          ),
        ],
        /** @type {Array<string>} */ ([])
      )
  }

  /**
   * Usage text.
   *
   * @returns {string} Usage text.
   */
  static get usageText () {
    return [
      'Usage: hora-skills <command> [options]',
      '',
      'Commands:',
      '  install    Install the selected skills, replacing the previously installed ones',
      '  list       Print the skills the current selection installs, installing nothing',
      '  uninstall  Remove every skill this package installed',
      '  help       Print this text',
      '',
      'Options:',
      '  --domains <names>  Comma separated domains to install (core, backend, frontend)',
      '  --dir <path>       Directory to install into (default: .claude/skills)',
      '',
      'The domains fall back to the `horaSkills.domains` of the package.json in the',
      'working directory, and then to every domain.',
    ]
      .join('\n')
  }

  /**
   * Create the command line arguments.
   *
   * @param {{
   *   args: Array<string>
   * }} params - Parameters.
   * @returns {CommandLineArguments} Command line arguments.
   */
  static createCommandLineArguments ({
    args,
  }) {
    return this.CommandLineArgumentsCtor.create({
      args,
    })
  }

  /**
   * Create the consuming repository's configuration.
   *
   * @param {{
   *   directoryPath: string
   * }} params - Parameters.
   * @returns {ConsumerPackageConfig} Configuration of the consuming repository.
   */
  static createConsumerPackageConfig ({
    directoryPath,
  }) {
    return this.ConsumerPackageConfigCtor.create({
      directoryPath,
    })
  }

  /**
   * Create the domain filter.
   *
   * @param {{
   *   domains: Array<string> | null
   * }} params - Parameters.
   * @returns {SkillDomainFilter} Domain filter.
   */
  static createSkillDomainFilter ({
    domains,
  }) {
    return this.SkillDomainFilterCtor.create({
      domains,
    })
  }

  /**
   * Create the installer.
   *
   * @param {{
   *   workingDirectoryPath: string
   *   targetDirectoryPath: string
   *   domainFilter: SkillDomainFilter
   * }} params - Parameters.
   * @returns {SkillsInstaller} Installer.
   */
  static createSkillsInstaller ({
    workingDirectoryPath,
    targetDirectoryPath,
    domainFilter,
  }) {
    return this.SkillsInstallerCtor.create({
      workingDirectoryPath,
      targetDirectoryPath,
      domainFilter,
    })
  }

  /**
   * Constructor of this instance.
   *
   * @returns {typeof HoraSkillsCli} Constructor of this instance.
   */
  get Ctor () {
    return /** @type {typeof HoraSkillsCli} */ (this.constructor)
  }

  /**
   * Node file system module.
   *
   * @returns {typeof fs} Node file system module.
   */
  get fs () {
    return fs
  }

  /**
   * Node path module.
   *
   * @returns {typeof path} Node path module.
   */
  get path () {
    return path
  }

  /**
   * Run the command.
   *
   * @returns {number} Exit code.
   * @public
   */
  run () {
    const command = this.commandLineArguments.extractCommand()
      ?? CLI_COMMAND.HELP

    if (command === CLI_COMMAND.INSTALL) {
      return this.runInstall()
    }

    if (command === CLI_COMMAND.LIST) {
      return this.runSelection()
    }

    if (command === CLI_COMMAND.UNINSTALL) {
      return this.runUninstall()
    }

    if (command === CLI_COMMAND.HELP) {
      return this.runHelp()
    }

    return this.reportUnknownCommand({
      command,
    })
  }

  /**
   * Install the selected skills.
   *
   * @returns {number} Exit code.
   */
  runInstall () {
    const verifiedExitCode = this.verifyTargetDirectoryPaths()

    if (verifiedExitCode !== 0) {
      return verifiedExitCode
    }

    const domainFilter = this.buildDomainFilter()
    const unknownDomains = domainFilter.extractUnknownDomains()

    if (unknownDomains.length > 0) {
      return this.reportUnknownDomains({
        unknownDomains,
      })
    }

    const installer = this.buildSkillsInstaller({
      domainFilter,
    })
    const {
      installedSkillNames,
      removedSkillNames,
    } = installer.install()

    this.logger.log(`Removed ${removedSkillNames.length} skills from ${this.buildTargetDirectoryPath()}`)
    this.logger.log(`Installed ${installedSkillNames.length} skills into ${this.buildTargetDirectoryPath()}`)
    this.logger.log(`Domains: ${domainFilter.domains.join(', ')}`)

    return 0
  }

  /**
   * Build the domain filter of the resolved domains.
   *
   * @returns {SkillDomainFilter} Domain filter.
   */
  buildDomainFilter () {
    return this.Ctor.createSkillDomainFilter({
      domains: this.resolveDomains(),
    })
  }

  /**
   * Resolve the domains to install.
   *
   * @returns {Array<string> | null} Domain names, or null when nothing selects them.
   */
  resolveDomains () {
    return this.commandLineArguments.extractDomains()
      ?? this.packageConfig.extractDomains()
      ?? null
  }

  /**
   * Report domains this package does not distribute.
   *
   * @param {{
   *   unknownDomains: Array<string>
   * }} params - Parameters.
   * @returns {number} Exit code.
   */
  reportUnknownDomains ({
    unknownDomains,
  }) {
    this.logger.error(`Unknown domain: ${unknownDomains.join(', ')}`)
    this.logger.error('Available domains: core, backend, frontend')

    return 1
  }

  /**
   * Build the installer against the target directory.
   *
   * @param {{
   *   domainFilter: SkillDomainFilter
   * }} params - Parameters.
   * @returns {SkillsInstaller} Installer.
   */
  buildSkillsInstaller ({
    domainFilter,
  }) {
    return this.Ctor.createSkillsInstaller({
      workingDirectoryPath: this.workingDirectoryPath,
      targetDirectoryPath: this.buildTargetDirectoryPath(),
      domainFilter,
    })
  }

  /**
   * Build the directory the skills are installed into.
   *
   * @returns {string} Target directory path.
   */
  buildTargetDirectoryPath () {
    const specifiedPath = this.commandLineArguments.extractTargetDirectoryPath()

    if (specifiedPath) {
      return this.path.resolve(
        this.workingDirectoryPath,
        specifiedPath
      )
    }

    return this.path.join(
      this.workingDirectoryPath,
      ...this.Ctor.defaultTargetDirectorySegments
    )
  }

  /**
   * Build the directory an installation is verified from.
   *
   * A `--dir` is named by whoever runs the command, so it is taken as given and only what
   * lies below it is verified — and it is the installation directory itself, so nothing
   * lies below it. Without one the installation is placed inside the consuming repository,
   * and every step below that repository is verified.
   *
   * @returns {string} Directory the verification starts from.
   */
  buildVerifiedBaseDirectoryPath () {
    const specifiedPath = this.commandLineArguments.extractTargetDirectoryPath()

    if (specifiedPath) {
      return this.buildTargetDirectoryPath()
    }

    return this.workingDirectoryPath
  }

  /**
   * Tell whether a path is a symbolic link.
   *
   * A path that does not exist is not one — an installation directory is commonly absent
   * until the first run creates it.
   *
   * @param {{
   *   filePath: string
   * }} params - Parameters.
   * @returns {boolean} Whether the path is a symbolic link.
   */
  isSymbolicLink ({
    filePath,
  }) {
    try {
      return this.fs.lstatSync(filePath)
        .isSymbolicLink()
    } catch {
      return false
    }
  }

  /**
   * Tell whether an installation directory is reached through a symbolic link.
   *
   * @param {{
   *   targetDirectoryPath: string
   * }} params - Parameters.
   * @returns {boolean} Whether the directory is reached through a symbolic link.
   */
  isReachedThroughSymbolicLink ({
    targetDirectoryPath,
  }) {
    return this.Ctor.buildPathSteps({
      basePath: this.buildVerifiedBaseDirectoryPath(),
      targetPath: targetDirectoryPath,
    })
      .some(it => this.isSymbolicLink({ filePath: it }))
  }

  /**
   * Collect the installation directories reached through a symbolic link.
   *
   * @returns {Array<string>} Installation directories reached through a symbolic link.
   */
  collectLinkedTargetDirectoryPaths () {
    return [
      this.buildTargetDirectoryPath(),
    ]
      .filter(it => this.isReachedThroughSymbolicLink({ targetDirectoryPath: it }))
  }

  /**
   * Verify that no installation directory is reached through a symbolic link.
   *
   * A link is content of the repository rather than an instruction of whoever runs the
   * command, so following one would let the repository decide where skills are written
   * and, worse, where they are removed. Nothing is carried through one, and the whole
   * command ends rather than half of it running.
   *
   * @returns {number} Exit code, zero when every installation directory is a directory.
   */
  verifyTargetDirectoryPaths () {
    const targetDirectoryPaths = this.collectLinkedTargetDirectoryPaths()

    if (targetDirectoryPaths.length === 0) {
      return 0
    }

    targetDirectoryPaths.forEach(it => {
      this.logger.error(`${it} is reached through a symbolic link.`)
    })

    this.logger.error('Nothing was changed. Give --dir the directory it resolves to, or replace the link with a directory of its own.')

    return 1
  }

  /**
   * Print the skills the current selection installs.
   *
   * @returns {number} Exit code.
   */
  runSelection () {
    const domainFilter = this.buildDomainFilter()
    const unknownDomains = domainFilter.extractUnknownDomains()

    if (unknownDomains.length > 0) {
      return this.reportUnknownDomains({
        unknownDomains,
      })
    }

    const skillNames = this.buildSkillsInstaller({ domainFilter })
      .selectSkillNames()

    skillNames.forEach(it => {
      this.logger.log(it)
    })

    this.logger.log(`${skillNames.length} skills selected (${domainFilter.domains.join(', ')})`)

    return 0
  }

  /**
   * Remove every skill this package installed.
   *
   * @returns {number} Exit code.
   */
  runUninstall () {
    const verifiedExitCode = this.verifyTargetDirectoryPaths()

    if (verifiedExitCode !== 0) {
      return verifiedExitCode
    }

    const { removedSkillNames } = this.buildSkillsInstaller({
      domainFilter: this.buildDomainFilter(),
    })
      .uninstall()

    this.logger.log(`Removed ${removedSkillNames.length} skills from ${this.buildTargetDirectoryPath()}`)

    return 0
  }

  /**
   * Print the usage text.
   *
   * @returns {number} Exit code.
   */
  runHelp () {
    this.logger.log(this.Ctor.usageText)

    return 0
  }

  /**
   * Report a command this CLI does not have.
   *
   * @param {{
   *   command: string
   * }} params - Parameters.
   * @returns {number} Exit code.
   */
  reportUnknownCommand ({
    command,
  }) {
    this.logger.error(`Unknown command: ${command}`)
    this.logger.error(this.Ctor.usageText)

    return 1
  }
}
