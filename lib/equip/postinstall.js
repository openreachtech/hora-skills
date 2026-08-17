#!/usr/bin/env node

import HoraSkillsCli from './HoraSkillsCli.js'

process.exitCode = HoraSkillsCli.runPostinstall()
