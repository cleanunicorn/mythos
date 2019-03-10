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

    // Read contract source code
    cli.action.start(`Reading contract ${contractFile}`)
    const contractFileContent = fs.readFileSync(contractFile, {encoding: 'utf-8'})
    cli.action.stop('done')

    // Compile contract source code
    cli.action.start(`Compiling contract ${contractFile}`)
    const c = new Compiler()
    let compiled
    try {
      compiled = await c.solidity(contractFile, contractFileContent, solcVersion)
    } catch (error) {
      for (let err of error.errors) {
        cli.info(err.formattedMessage)
      }
      cli.action.stop('failed')
      return
    }
    cli.action.stop('done')

    // Analyze the contract code
    cli.action.start(`Analyzing contract ${contractName}`)
    let issues
    const scanner = new Scanner(mythxAddress, mythxPassword)
    try {
      issues = await scanner.run(compiled, contractFile, contractName, timeout)
      cli.action.stop('done')
    } catch (error) {
      this.error(error)
      cli.action.stop('failed')
      return
    }

    // Display report
    this.log(`Report found ${issues.issues.length} issues`)
    const s = new Sourcemap(contractFile, contractFileContent, issues)
    this.log(...s.output())

    this.log('Done')
  }
}
