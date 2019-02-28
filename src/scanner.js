const fs = require('fs');
const armlet = require('armlet');

module.exports.Scanner = class Scanner {
  constructor(mythxAddress, mythxpassword) {
    this.client = new armlet.Client({
      password: mythxpassword,
      ethAddress: mythxAddress,
    })
  }

  async fakeRun() {
    return {}
  }

  async run(compiled, contractFile, contractName, timeout) {
    let contractData = compiled.contracts[contractFile][contractName];

    const contractSource = fs.readFileSync(contractFile, { encoding: 'utf-8' })

    const data = {
      clientToolName: "mythos",
      contractName: contractName,
      abi: contractData['abi'],
      //
      bytecode: contractData['evm']['bytecode']['object'],
      sourceMap: contractData['evm']['bytecode']['sourceMap'],
      //
      deployedBytecode: contractData['evm']['deployedBytecode']['object'],
      deployedSourceMap: contractData['evm']['deployedBytecode']['sourceMap'],
      sourceList: [
        contractFile
      ],
      sources: {
        [contractFile]: {
          source: contractSource,
        }
      },
      analysisMode: 'full',
    };

    return new Promise((resolve, reject) => {
      this.client.analyze({
        data,
        timeout,
      }).then(issues => {
        fs.writeFileSync('./issues.json', JSON.stringify(issues, null, 4), 'utf-8');
        resolve(issues);
      }).catch(err => {
        reject(err);
      })
    });
  }
}
