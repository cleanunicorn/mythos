const fs = require('fs');
const armlet = require('armlet');

/* Dynamic linking is not supported. */

const regex = new RegExp(/__.*__/, 'g');
const address = '0000000000000000000000000000000000000000';
const replaceLinkedLibs = byteCode => byteCode.replace(regex, address);

module.exports.Scanner = class Scanner {
  constructor(mythxAddress, mythxPassword) {
    this.client = new armlet.Client({
      password: mythxPassword,
      ethAddress: mythxAddress,
    })
  }

  async run({compiled, contractFile, contractName, importedFiles, timeout, analysisMode}) {
    let contractData = compiled.contracts[contractFile][contractName];
    timeout = timeout * 1000;

    const contractSource = fs.readFileSync(contractFile, { encoding: 'utf-8' });

    const data = {
      contractName: contractName,
      abi: contractData['abi'],
      //
      bytecode: replaceLinkedLibs(contractData['evm']['bytecode']['object']),
      sourceMap: contractData['evm']['bytecode']['sourceMap'],
      //
      deployedBytecode: replaceLinkedLibs(contractData['evm']['deployedBytecode']['object']),
      deployedSourceMap: contractData['evm']['deployedBytecode']['sourceMap'],
      sourceList: importedFiles,
      sources: {
        [contractFile]: {
          source: contractSource,
        }
      },
      analysisMode,
    };

    return new Promise((resolve, reject) => {
      this.client.analyzeWithStatus({
        data,
        timeout,
        clientToolName: "mythos",
      }).then(issues => {
        fs.writeFileSync(`./issues-${issues.status.uuid}.json`, JSON.stringify(issues, null, 4), 'utf-8');
        resolve(issues);
      }).catch(err => {
        reject(err);
      })
    });
  }
};
