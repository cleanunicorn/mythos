import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'

import {Sourcemap} from '../sourcemap'

const armlet = require('armlet')

export default class GetResults extends Command {
  static description = 'Retrieve analysis results scanned with MythX API'

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
  }

  static args = [
    {
      name: 'uuid',
      required: true,
      description: 'uuid to retrive analysis results',
    },
  ]

  async run() {
    // Parse args and flags
    const {args, flags} = this.parse(GetResults)
    const mythxAddress = flags.mythxEthAddress
    const mythxPassword = flags.mythxPassword

    const uuid = args.uuid

    // Get armlet instance
    const client = new armlet.Client({
      password: mythxPassword,
      ethAddress: mythxAddress,
    })

    // Check analysis status with UUID
    cli.action.start(`Check analysis status: ${uuid}`)
    try {
      const result = await client.getStatus(uuid)
      if (result.status !== 'Finished') {
        cli.action.stop('done')
        this.log(`The job status is still '${result.status}'.`)
        this.log('Please retry later.')
        return
      }
    } catch (error) {
      cli.action.stop('failed')
      this.log(error)
      return
    }
    cli.action.stop('done')

    // Retrieve analysis results with UUID
    let results: any = {issues : []}
    cli.action.start(`Retrieving analysis results: ${uuid}`)
    try {
      results.issues = await client.getIssues(uuid)
    } catch (error) {
      cli.action.stop('failed')
      this.error(error)
      return
    }
    cli.action.stop('done')

    // Write report
    fs.writeFileSync(`./issues_${uuid}.json`, JSON.stringify(results, null, 4), 'utf-8')

    // Display report
    this.log(`Report found ${results.issues[0].issues.length} issues`)
    const contractFile = results.issues[0].sourceList[0]
    const contractFileContent = fs.readFileSync(contractFile, {encoding: 'utf-8'})
    const s = new Sourcemap(contractFile, contractFileContent, results)
    this.log(s.output().join('\n'))

    this.log('Done')
  }
}
