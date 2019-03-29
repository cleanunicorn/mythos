import * as fs from 'fs'

import {Compiler} from '../src/compiler'

let chai = require('chai')
chai.config.truncateThreshold = 0
let assert = chai.assert

let generateGoldenFiles = (process.env.GENERATE_GOLDEN === 'true')
if (generateGoldenFiles) {
  // tslint:disable-next-line: no-console
  console.log('Generating golden files')
}

describe('compiler', () => {
  it('successfully compiles Solidity contracts', async () => {
    let testData = [
      {
        name: 'Version Interval',
        contractFile: 'test/contracts/version-interval.sol',
        contractName: 'VersionInterval',
      }
    ]

    const c = new Compiler()

    for (let t of testData) {
      const contractFileContent = fs.readFileSync(t.contractFile, {encoding: 'utf-8'})
      let compiled = await c.solidity(t.contractFile, contractFileContent, undefined)
      let compiledJSON = JSON.stringify(compiled, undefined, 2)
      if (generateGoldenFiles) {
        fs.writeFileSync(`test/golden/${t.name}.golden.json`, compiledJSON, {encoding: 'utf-8'})
      }
      let expected = fs.readFileSync(`test/golden/${t.name}.golden.json`, {encoding: 'utf-8'})
      assert.equal(expected, compiledJSON)
    }

  })
})
