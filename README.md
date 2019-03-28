mythos
======

A CLI client for MythX

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@cleanunicorn/mythos.svg)](https://www.npmjs.com/package/@cleanunicorn/mythos)
[![Downloads/week](https://img.shields.io/npm/dw/mythos.svg)](https://www.npmjs.com/package/@cleanunicorn/mythos)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1c13f68494414f5fb60b10cc30a6acbc)](https://www.codacy.com/app/lucadanielcostin/mythos)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/cleanunicorn/mythos/tree/master.svg?style=shield)](https://circleci.com/gh/cleanunicorn/mythos)
[![Build status](https://ci.appveyor.com/api/projects/status/nverbd397m2w9qlp/branch/master?svg=true)](https://ci.appveyor.com/project/cleanunicorn/mythos/branch/master)

<!-- toc -->
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
* [Changelog](#changelog)
<!-- tocstop -->


# Installation

Install globally using:
```sh-session
$ npm -g install @cleanunicorn/mythos
```


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

Example:
```sh-session
$ mythos analyze a.sol A --timeout=180
Reading contract a.sol... done
Downloading Solidity version v0.5.3+commit.10d17f24... done
Analyzing contract A... done
Report found 1 issues
Title: Unprotected SELFDESTRUCT Instruction
Head: The contract can be killed by anyone.
Description: Arbitrary senders can kill this contract and withdraw its balance to their own account.
Source code:

a.sol 7:8
--------------------------------------------------
selfdestruct(msg.sender)
--------------------------------------------------

==================================================
```

## Basic usage

<!-- usage -->
```sh-session
$ npm install -g @cleanunicorn/mythos
$ mythos COMMAND
running command...
$ mythos (-v|--version|version)
@cleanunicorn/mythos/0.5.1 linux-x64 node-v11.12.0
$ mythos --help [COMMAND]
USAGE
  $ mythos COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mythos analyze CONTRACTFILE CONTRACTNAME`](#mythos-analyze-contractfile-contractname)
* [`mythos get-analysis UUID`](#mythos-get-analysis-uuid)
* [`mythos help [COMMAND]`](#mythos-help-command)

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

  --analysisMode=analysisMode        [default: quick] Define the analysis mode when requesting a scan. Choose one from:
                                     quick, full.

  --mythxEthAddress=mythxEthAddress  (required)

  --mythxPassword=mythxPassword      (required)

  --solcVersion=solcVersion          Solidity version to use when compiling (example: 0.4.21). If none is specified it
                                     will try to identify the version from the source code.

  --timeout=timeout                  [default: 180] How many seconds to wait for the result
```

_See code: [src/commands/analyze.ts](https://github.com/cleanunicorn/mythos/blob/v0.5.1/src/commands/analyze.ts)_

## `mythos get-analysis UUID`

Retrieve analysis results scanned with MythX API

```
USAGE
  $ mythos get-analysis UUID

ARGUMENTS
  UUID  uuid to retrive analysis results

OPTIONS
  -h, --help                         show CLI help
  --mythxEthAddress=mythxEthAddress  (required)
  --mythxPassword=mythxPassword      (required)
```

_See code: [src/commands/get-analysis.ts](https://github.com/cleanunicorn/mythos/blob/v0.5.1/src/commands/get-analysis.ts)_

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

# Changelog

* [0.5.1](https://github.com/cleanunicorn/mythos/releases/tag/v0.5.0)
  * Fix dynamic linking issue (thanks to [@eswarasai](https://github.com/eswarasai)).

* [0.5.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.5.0)
  * Automatically import other files (thanks to [@eswarasai](https://github.com/eswarasai)).
  * Fix minor issue when picking Solidty version (thanks to [@eswarasai](https://github.com/eswarasai)).
  * Fix issue count (thanks to [@tagomaru](https://github.com/tagomaru)).

* [0.4.1](https://github.com/cleanunicorn/mythos/releases/tag/v0.4.1)
  * Update npm dependencies

* [0.4.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.4.0)
  * Correctly pick solidity version when an interval is set (thanks to [@nanspro](https://github.com/nanspro)).
  * Add `get-analysis` command to retrieve a scanned result (thanks to [@tagomaru](https://github.com/tagomaru)).
  * Fix displaying severity in output list.

* [0.3.2](https://github.com/cleanunicorn/mythos/releases/tag/v0.3.2)
  * Display message on syntax error.

* [0.3.1](https://github.com/cleanunicorn/mythos/releases/tag/v0.3.1)
  * Add `Severity` to output.

* [0.3.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.3.0)
  * Request different depths of analyses with `--analysisMode` can be `full` or `quick`.
  * Add changelog.

* [0.2.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.2.0) 
  * Stable version, first release.
