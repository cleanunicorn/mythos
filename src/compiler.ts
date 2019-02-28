/// <reference path="solc.d.ts">
import cli from 'cli-ux'
import {writeFileSync} from 'fs'
import * as solc from 'solc'

export class Compiler {
  async solidity(fileName: string, fileContents: string, version = 'latest') {
    let input = {
      language: 'Solidity',
      sources: {
        [fileName]: {
          content: fileContents,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    }

    return new Promise((resolve, reject) => {
      cli.action.start(`Downloading Solidity version ${version}`)
      solc.loadRemoteVersion(version, (err, solcSnapshot) => {
        if (err) {
          cli.action.stop('failed')
          reject(err)
        } else {
          cli.action.stop('done')
          let output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)))
          writeFileSync('./compiled.json', JSON.stringify(output, null, 2))
          resolve(output)
        }
      })
    })
  }
}
