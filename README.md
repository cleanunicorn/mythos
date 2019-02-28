mythos
======

A CLI client for MythX

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@cleanunicorn/mythos.svg)](https://npmjs.org/package/mythos)
[![Downloads/week](https://img.shields.io/npm/dw/mythos.svg)](https://npmjs.org/package/mythos)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4388201afa8745d2a70b77a3a2b5b03a)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cleanunicorn/mythos&amp;utm_campaign=Badge_Grade)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage

Use this to scan Solidity source code.

You need to provide your MythX address and password.

As an env variable:
```sh-session
$ MYTHX_ETH_ADDRESS=mythxEthAddress MYTHX_PASSWORD=mythxPassword mythos analyze ./contract.sol Contract
```

Or as flags:
```sh-session
$ mythos analyze ./contract.sol Contract --mythxEthAddress=mythxEthAddress --mythxPassword=mythxPassword
```

## Basic usage

<!-- usage -->
```sh-session
$ npm install -g @cleanunicorn/mythos
$ mythos COMMAND
running command...
$ mythos (-v|--version|version)
@cleanunicorn/mythos/0.0.4 linux-x64 node-v11.10.0
$ mythos --help [COMMAND]
USAGE
  $ mythos COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [mythos](#mythos)
- [Usage](#usage)
  - [Basic usage](#basic-usage)
- [Commands](#commands)
  - [`mythos analyze CONTRACTFILE CONTRACTNAME`](#mythos-analyze-contractfile-contractname)
  - [`mythos hello [FILE]`](#mythos-hello-file)
  - [`mythos help [COMMAND]`](#mythos-help-command)

## `mythos analyze CONTRACTFILE CONTRACTNAME`

Scan a smart contract with MythX API

```
USAGE
  $ mythos analyze CONTRACTFILE CONTRACTNAME

ARGUMENTS
  CONTRACTFILE  Contract file to scan
  CONTRACTNAME  Contract name

OPTIONS
  -h, --help                         show CLI help
  --mythxEthAddress=mythxEthAddress  (required)
  --mythxPassword=mythxPassword      (required)

  --solcVersion=solcVersion          [default: latest] Solidity version to use when compiling (example:
                                     v0.4.21+commit.dfe3193c). Get available compilers from
                                     https://ethereum.github.io/solc-bin/bin/list.txt

  --timeout=timeout                  [default: 60000] How many miliseconds to wait for the result
```

_See code: [src/commands/analyze.ts](https://github.com/cleanunicorn/mythos/blob/v0.0.4/src/commands/analyze.ts)_

## `mythos hello [FILE]`

describe the command here

```
USAGE
  $ mythos hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ mythos hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/cleanunicorn/mythos/blob/v0.0.4/src/commands/hello.ts)_

## `mythos help [COMMAND]`

display help for mythos

```
USAGE
  $ mythos help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
