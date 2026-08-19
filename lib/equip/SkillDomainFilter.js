import SKILL_DOMAIN_PREFIX from './constants/SKILL_DOMAIN_PREFIX.js'

/**
 * Filter of skill folder names by the domain they belong to.
 *
 * The distributed skills are flat, and the two-character prefix of a folder name
 * (`hc-` / `hb-` / `hf-`) is the only trace of its domain left in the build output.
 */
export default class SkillDomainFilter {
  /**
   * Constructor.
   *
   * @param {{
   *   domains: Array<string>
   * }} params - Parameters.
   */
  constructor ({
    domains,
  }) {
    this.domains = domains
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof SkillDomainFilter ? X : never} T, X
   * @param {{
   *   domains?: Array<string> | null
   * }} [params] - Parameters for the factory method.
   * @returns {InstanceType<T>} Instance of this class.
   * @this {T}
   * @public
   */
  static create ({
    domains = null,
  } = {}) {
    return new this({
      domains: domains
        ?? this.buildDefaultDomains(),
    })
  }

  /**
   * Hash of domain name to the folder-name prefix of its skills.
   *
   * @returns {Record<string, string>} Domain name to prefix.
   */
  static get domainPrefixHash () {
    return SKILL_DOMAIN_PREFIX
  }

  /**
   * Build the domain list used when no domain is specified.
   *
   * @returns {Array<string>} Every domain this package distributes.
   */
  static buildDefaultDomains () {
    return Object.keys(this.domainPrefixHash)
  }

  /**
   * Constructor of this instance.
   *
   * @returns {typeof SkillDomainFilter} Constructor of this instance.
   */
  get Ctor () {
    return /** @type {typeof SkillDomainFilter} */ (this.constructor)
  }

  /**
   * Extract the specified domains that this package does not distribute.
   *
   * @returns {Array<string>} Domain names with no matching domain directory.
   * @public
   */
  extractUnknownDomains () {
    const knownDomains = this.Ctor.buildDefaultDomains()

    return this.domains
      .filter(it => !knownDomains.includes(it.trim()))
  }

  /**
   * Filter skill folder names down to the selected domains.
   *
   * @param {{
   *   skillNames: Array<string>
   * }} params - Parameters.
   * @returns {Array<string>} Skill folder names belonging to the selected domains.
   * @public
   */
  filterSkillNames ({
    skillNames,
  }) {
    const prefixes = this.buildPrefixes()

    return skillNames
      .filter(it => prefixes.some(prefix => it.startsWith(`${prefix}-`)))
  }

  /**
   * Build the folder-name prefixes of the selected domains.
   *
   * @returns {Array<string>} Prefixes such as `hc` / `hb` / `hf`.
   */
  buildPrefixes () {
    const specifiedDomains = this.domains
      .map(it => it.trim())

    return Object.entries(this.Ctor.domainPrefixHash)
      .filter(([domain]) => specifiedDomains.includes(domain))
      .map(([, prefix]) => prefix)
  }
}
