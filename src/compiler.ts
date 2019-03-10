/// <reference path="solc.d.ts">
import cli from 'cli-ux'
import * as request from 'request-promise'
import * as solc from 'solc'
import * as parser from 'solidity-parser-antlr'

export class Compiler {
  async solidity(fileName: string, fileContents: string, version: string | undefined) {
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

    // Get the solc string from https://ethereum.github.io/solc-bin/bin/list.txt
    let solcVersion: string

    if (version === undefined) {
      let sv = this.solidityVersion(fileContents)
      if (sv !== undefined) {
        solcVersion = await this.solcVersion(sv)
      }
    } else if (version === 'latest') {
      solcVersion = 'latest'
    } else {
      solcVersion = await this.solcVersion(version)
    }

    return new Promise((resolve, reject) => {
      cli.info(`Downloading Solidity version ${solcVersion}`)
      solc.loadRemoteVersion(solcVersion, (err, solcSnapshot) => {
        if (err) {
          reject(err)
        } else {
          let output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)))

          // Reject if there are errors
          if (output.errors !== undefined) {
            for (let e of output.errors) {
              if (e.severity === 'error') {
                reject(output)
              }
            }
          }

          resolve(output)
        }
      })
    })
  }

  solidityVersion(fileContents: string): string | undefined {
    let ast
    try {
      ast = parser.parse(fileContents, {})
      // @ts-ignore
      for (let n of ast.children) {
        if ((n.name === 'solidity') && (n.type === 'PragmaDirective')) {
          return n.value
        }
      }
    } catch (e) {
      cli.error(e.errors)
    }
  }

  async solcVersion(solidityVersion: string): Promise<string> {
    solidityVersion = solidityVersion.replace('^', '')
    solidityVersion = solidityVersion.replace('v', '')

    let solcVersion = 'latest'

    await request.get('https://ethereum.github.io/solc-bin/bin/list.txt')
      .then(body => {
        let lines = body.split('\n')
        for (let v of lines) {
          if (v.indexOf(solidityVersion) !== -1) {
            solcVersion = v.replace('soljson-', '').replace('.js', '')
            return
          }
        }
      })
      .catch(err => {
        cli.error(err)
      })

    return solcVersion
  }
}
