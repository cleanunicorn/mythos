/// <reference path="solc.d.ts">
import cli from 'cli-ux'
import * as fs from 'fs'
import * as request from 'request-promise'
import * as solc from 'solc'
import * as parser from 'solidity-parser-antlr'

const getFileContent = (filepath: string) => {
  const stats = fs.statSync(filepath)

  if (stats.isFile()) {
    importedFiles.push(filepath)
    return fs.readFileSync(filepath).toString()
  } else {
    throw new Error(`File ${filepath} not found`)
  }
}

const findImports = (pathName: string) => {
  try {
    return {contents: getFileContent(pathName)}
  } catch (e) {
    return {error: e.message}
  }
}

let importedFiles: string[]

export class Compiler {
  async solidity(fileName: string, fileContents: string, version: string | undefined) {
    importedFiles = []

    let input: any = {
      language: 'Solidity',
      sources: {
        [fileName]: {
          content: fileContents,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
            '': ['ast'],
          }
        }
      }
    }

    // Get the solc string from https://ethereum.github.io/solc-bin/bin/list.txt
    let solcVersion = 'latest'

    try {
      if (version === undefined) {
        let sv = this.solidityVersion(fileContents)
        if (sv !== undefined) {
          solcVersion = await this.solcVersion(sv)
        }
      } else {
        solcVersion = await this.solcVersion(version)
      }
    } catch (error) {
      return new Promise((_, reject) => {
        reject(error)
      })
    }

    importedFiles.push(fileName)

    return new Promise<any>((resolve, reject) => {
      cli.info(`Compiling with Solidity version: ${solcVersion}`)
      solc.loadRemoteVersion(solcVersion, (err, solcSnapshot) => {
        if (err) {
          reject(err)
        } else {
          let compiled = JSON.parse(solcSnapshot.compile(JSON.stringify(input), findImports))

          // Reject if there are errors
          if (compiled.errors !== undefined) {
            for (let e of compiled.errors) {
              if (e.severity === 'error') {
                reject(compiled)
              }
            }
          }

          resolve({compiled, importedFiles})
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
    } catch (error) {
      for (let err of error.errors) {
        cli.error(err.message)
      }
    }
  }

  async solcVersion(solidityVersion: string): Promise<string> {
    solidityVersion = solidityVersion.replace(/[\^v]/g, '')

    let upperLimit = 'latest'
    let solcVersion = 'latest'
    for (let i = 0; i < solidityVersion.length; i++) {
      if (solidityVersion[i] === '<') {
        if (solidityVersion[i + 1] === '=') {
          solidityVersion = solidityVersion.substring(i + 2, solidityVersion.length)
          break
        }
        upperLimit = solidityVersion.substring(i + 1, solidityVersion.length)
        break
      }
    }
    if (upperLimit !== 'latest') {
      if (upperLimit === '0.7.0') {
        solidityVersion = '0.6.10'
      } else if (upperLimit === '0.6.0') {
        solidityVersion = '0.5.17'
      } else if (upperLimit === '0.5.0') {
        solidityVersion = '0.4.26'
      } else if (upperLimit === '0.4.0') {
        solidityVersion = '0.3.6'
      } else if (upperLimit === '0.3.0') {
        solidityVersion = '0.2.2'
      } else {
        let x = parseInt(upperLimit[upperLimit.length - 1], 10) - 1
        solidityVersion = ''
        for (let i = 0; i < upperLimit.length - 1; i++) {
          solidityVersion += upperLimit[i]
        }
        solidityVersion += x.toString()
      }
    }
    await request.get('https://ethereum.github.io/solc-bin/bin/list.txt')
      .then(body => {
        let lines = body.split('\n')
        for (let v of lines) {
          let versionName = v.replace('soljson-v', '')
          if (versionName.indexOf(`${solidityVersion}+`) === 0) {
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
