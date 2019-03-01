mythos
======

A CLI client for MythX

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@cleanunicorn/mythos.svg)](https://npmjs.org/package/mythos)
[![Downloads/week](https://img.shields.io/npm/dw/mythos.svg)](https://npmjs.org/package/mythos)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1c13f68494414f5fb60b10cc30a6acbc)](https://www.codacy.com/app/lucadanielcostin/mythos)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/cleanunicorn/mythos/tree/master.svg?style=shield)](https://circleci.com/gh/cleanunicorn/mythos)
[![Build status](https://ci.appveyor.com/api/projects/status/nverbd397m2w9qlp/branch/master?svg=true)](https://ci.appveyor.com/project/cleanunicorn/mythos/branch/master)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage

Use this to scan Solidity source code.

You need to provide your MythX address and password.

As an env variable:
```sh-session
$ export MYTHX_ETH_ADDRESS='mythxEthAddress' 
$ export MYTHX_PASSWORD='mythxPassword' 
$ mythos analyze ./contract.sol Contract
```

Or as flags:
```sh-session
$ mythos analyze ./contract.sol Contract \
  --mythxEthAddress=mythxEthAddress \
  --mythxPassword=mythxPassword
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
