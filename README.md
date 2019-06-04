mythos
======

A CLI client for MythX

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@cleanunicorn/mythos.svg)](https://www.npmjs.com/package/@cleanunicorn/mythos)
[![Downloads](https://img.shields.io/npm/dt/mythos.svg)](https://www.npmjs.com/package/@cleanunicorn/mythos)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1c13f68494414f5fb60b10cc30a6acbc)](https://www.codacy.com/app/lucadanielcostin/mythos)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/cleanunicorn/mythos/tree/master.svg?style=shield)](https://circleci.com/gh/cleanunicorn/mythos)
[![Discord](https://img.shields.io/discord/481002907366588416.svg)](https://discord.gg/TwazmUU)
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
$ mythos analyze no-pragma.sol NoPragma

Reading contract no-pragma.sol... done
Compiling with Solidity version: latest
 ›   Warning: no-pragma.sol:1:1: Warning: Source file does not specify required compiler version! Consider adding "pragma solidity ^0.5.7;"
 ›   contract NoPragma {
 ›   ^ (Relevant source part starts here and spans across multiple lines).
 ›
Compiling contract no-pragma.sol... done
Analyzing contract NoPragma... done

UUID: 9350d5c4-b89f-43ef-b1f7-48840fee8a02
API Version: v1.4.12
Harvey Version: 0.0.16
Maestro Version: 1.2.6
Maru Version: 0.4.2
Mythril Version: 0.20.3

Report found 2 issues
Meta:
Covered instructions: 40
Covered paths: 4
Selected compiler version: v0.4.25

Title: (SWC-106) Unprotected SELFDESTRUCT Instruction
Severity: High
Head: The contract can be killed by anyone.
Description: Anyone can kill this contract and withdraw its balance to an arbitrary address.
Source code:

no-pragma.sol 3:8
--------------------------------------------------
selfdestruct(msg.sender)
--------------------------------------------------

==================================================

Title: (SWC-103) Floating Pragma
Severity: Medium
Head: No pragma is set.
Description: It is recommended to make a conscious choice on what version of Solidity is used for compilation. Currently no version is set in the Solidity file.
Source code:

no-pragma.sol 1:0
--------------------------------------------------

--------------------------------------------------

==================================================

Done
```

## Basic usage

<!-- usage -->
```sh-session
$ npm install -g @cleanunicorn/mythos
$ mythos COMMAND
running command...
$ mythos (-v|--version|version)
@cleanunicorn/mythos/0.10.2 linux-x64 node-v11.15.0
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

_See code: [src/commands/analyze.ts](https://github.com/cleanunicorn/mythos/blob/v0.10.2/src/commands/analyze.ts)_

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

_See code: [src/commands/get-analysis.ts](https://github.com/cleanunicorn/mythos/blob/v0.10.2/src/commands/get-analysis.ts)_

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

* [0.10.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.10.0)
  * Add newly added required parameter in request: `mainSource`.
  * Display errors in a more consistent way.

* [0.9.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.9.0)
  * Update to new armlet version and to new API changes

* [0.8.1](https://github.com/cleanunicorn/mythos/releases/tag/v0.8.1)
  * Fix off by one source mapping

* [0.8.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.8.0)
  * Fix file name when running `get-analysis` to save response as `issues-${uuid}.json`
  * Make compilation errors more obvious
  * Display more information from report: compiler version used, API versions, SWC-ID, report's UUID
  * Display clear error when incorrect contract name is specified
  * Display compilation warnings

* [0.7.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.7.0)
  * Send the AST when requesting an analysis

* [0.6.0](https://github.com/cleanunicorn/mythos/releases/tag/v0.6.0)
  * Fix external lib import, it sends the library information to MythX
  * Dump issues in a file as *issues-[uuid].json* for easy manual inspection

* [0.5.2](https://github.com/cleanunicorn/mythos/releases/tag/v0.5.2)
  * Setup automatic tests

* [0.5.1](https://github.com/cleanunicorn/mythos/releases/tag/v0.5.1)
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
