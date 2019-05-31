import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'

import {Compiler} from '../compiler'
import {Sourcemap} from '../sourcemap'

const {Scanner} = require('../scanner')

export default class Analyze extends Command {
  static description = 'Scan a smart contract with MythX API'

  static flags = {
    help: flags.help({char: 'h'}),
    mythxEthAddress: flags.string({
      env: 'MYTHX_ETH_ADDRESS',
      required: true,
      hidden: false,
    }),
    mythxPassword: flags.string({
      env: 'MYTHX_PASSWORD',
      required: true,
    }),
    timeout: flags.integer({
      default: 180,
      description: 'How many seconds to wait for the result',
    }),
    solcVersion: flags.string({
      description: 'Solidity version to use when compiling (example: 0.4.21). If none is specified it will try to identify the version from the source code.',
    }),
    analysisMode: flags.string({
      default: 'quick',
      description: 'Define the analysis mode when requesting a scan. Choose one from: quick, full.'
    }),
  }

  static args = [
    {
      name: 'contractFile',
      required: true,
      description: 'Contract file to scan',
    },
    {
      name: 'contractName',
      required: true,
      description: 'Contract name',
    }
  ]

  async run() {
    // Parse args and flags
    const {args, flags} = this.parse(Analyze)
    const contractFile = args.contractFile
    const contractName = args.contractName
    const mythxAddress = flags.mythxEthAddress
    const mythxPassword = flags.mythxPassword
    let timeout = flags.timeout
    const solcVersion = flags.solcVersion
    const analysisMode = flags.analysisMode

    // Read contract source code
    cli.action.start(`Reading contract ${contractFile}`)
    const contractFileContent = fs.readFileSync(contractFile, {encoding: 'utf-8'})
    cli.action.stop('done')

    // Compile contract source code
    cli.action.start(`Compiling contract ${contractFile}`)
    const c = new Compiler()
    let compiled
    let importedFiles
    try {
      ({compiled, importedFiles} = await c.solidity(contractFile, contractFileContent, solcVersion))

      // Check if the contract exists
      if (!(contractName in compiled.contracts[contractFile])) {
        cli.error(`Contract ${contractName} not found.`)
        cli.action.stop('failed')
        return
      }
    } catch (error) {
      if (error.message !== undefined) {
        cli.error(error.message, {exit: false})
      }
      if (error.errors !== undefined) {
        for (let err of error.errors) {
          cli.error(err.formattedMessage, {exit: false})
        }
      }
      cli.action.stop('failed')
      return
    }

    if (compiled.errors !== undefined) {
      for (let warning of compiled.errors) {
        cli.warn(warning.formattedMessage)
      }
    }

    cli.action.stop('done')

    // Analyze the contract code
    cli.action.start(`Analyzing contract ${contractName}`)
    let issues
    const scanner = new Scanner(mythxAddress, mythxPassword)
    try {
      issues = await scanner.run({compiled, contractFile, importedFiles, contractName, timeout, analysisMode})
      cli.action.stop('done')
    } catch (error) {
      cli.error(error, {exit: false})
      cli.action.stop('failed')
      return
    }

    // Display report
    const s = new Sourcemap(contractFile, contractFileContent, issues)
    this.log(s.output().join('\n'))

    this.log('Done')
  }
}
