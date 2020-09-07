# wdio-parallel-retrier

🛠 Development in progress, beta version

![npm downloads](https://img.shields.io/npm/dm/wdio-parallel-retrier.svg?style=flat-square)

## This library is a wrapper around ```process-rerun```

### The purpose of this library is - build simple and flexible interface for wdio framework parallel execution with rerun (on fail) possibility

[Usage and Example](#usage)

<br>

[Documentation](#documentation)
* [buildExecutor](#buildexecutor)
* [byIt](#byit)
* [byFile](#byit)
* [asQueue](#asqueue)
* [executor](#executor)
* [execute](#execute)

### usage

```js
const {buildExecutor} = require('wdio-parallel-retrier');

executeAsQueue();
async function executeAsQueue() {

  const testCaseRegPattern = /(?<=it\(').+(?=')/ig;
  const cwd = process.cwd();

  const result = await buildExecutor(resolve(cwd, './wdio.conf.js'), resolve(cwd, './built/specs'))
    .asQueue(testCaseRegPattern, ['test case it name 1', 'test case it name 2', 'test case it name 3'])
    .command({'--process-argument': 'process-argument-value'}, {ENV_VARIABLE: 'en-varialbe-value'})
    .executor({attemptsCount: 2, maxThreads: 1, logLevel: 'VERBOSE', longestProcessTime: 60 * 1000, pollTime: 100})
    .execute();

  console.log(result);
  if(result.retriable.length || result.notRetriable.length) {
    process.exit(1);
  }
}

executeOnlyRequiredCases();
async function executeAsQueue() {

  const testCaseRegPattern = /(?<=it\(').+(?=')/ig;
  const cwd = process.cwd();

  const result = await buildExecutor(resolve(cwd, './wdio.conf.js'), resolve(cwd, './built/specs'))
    .asQueue(testCaseRegPattern, ['test case it name 1', 'test case it name 2', 'test case it name 3'])
    .command({'--process-argument': 'process-argument-value'}, {ENV_VARIABLE: 'en-varialbe-value'})
    .executor({attemptsCount: 2, maxThreads: 10, logLevel: 'VERBOSE', longestProcessTime: 60 * 1000, pollTime: 100})
    .execute();

  console.log(result);
  if(result.retriable.length || result.notRetriable.length) {
    process.exit(1);
  }
}

executeByFile();
async function executeByFile() {
  const cwd = process.cwd();
  const result = await buildExecutor(resolve(cwd, './wdio.conf.js'), resolve(cwd, './built/specs'))
    .byFile()
    .command({'--process-argument': 'process-argument-value'}, {ENV_VARIABLE: 'en-varialbe-value'})
    .executor({attemptsCount: 2, maxThreads: 5, logLevel: 'VERBOSE', longestProcessTime: 60 * 1000, pollTime: 100})
    .execute();

  console.log(result);
  if(result.retriable.length || result.notRetriable.length) {
    process.exit(1);
  }
}


executeByIt();
async function executeByIt() {
  const cwd = process.cwd();
  const testCaseRegPattern = /(?<=it\(').+(?=')/ig;
  const result = await buildExecutor(resolve(cwd, './wdio.conf.js'), resolve(cwd, './built/specs'))
    .byIt(testCaseRegPattern)
    .command({'--process-argument': 'process-argument-value'}, {ENV_VARIABLE: 'en-varialbe-value'})
    .executor({attemptsCount: 2, maxThreads: 2, logLevel: 'VERBOSE', longestProcessTime: 60 * 1000, pollTime: 100})
    .execute();

  console.log(result);
  if(result.retriable.length || result.notRetriable.length) {
    process.exit(1);
  }
}
```

## Documentation

<br>
<br>

## buildExecutor

**`buildExecutor('./path/to/wdio.conf.js', './path/to/specs/folder')`**

arguments | description
--- | ---
**`pathTowdioConfigFile`** | Type: `string` <br> Path to wdio config file
**`pathToSpecFolderOrSpecsFilesList`** | Type: `string` or `string[]` <br> Path to specs folder, or list (array) with specs files path;

**`returns {byIt: function; byFile: function; asQueue: function}`**

## byIt

**`buildExecutor(...args).byIt(/(?<=it\(').+(?=')/ig) or .byIt()`**

arguments | description
--- | ---
**`itPattern`** | Type: OPTIONAL `RegEx` <br> RegEx for it title. example it('test item'); -> itRegEx = /(?<=it\(').+(?=')/ig; <br> in case of undefined library will define ***itPattern*** based on first symbol in it title;
**`pathToSpecFolderOrSpecsFilesList`** | Type: `string` or `string[]` <br> Path to specs folder, or list (array) with specs files path;

**`returns {command: function}`**

<br>
<br>

## byFile

**`buildExecutor(...args).byFile()`**

#### no arguments here

**`returns {command: function}`**

<br>
<br>

## asQueue

**`buildExecutor(...args).asQueue(/(?<=it\(').+(?=')/ig, ['test1', 'test2', 'test 10']) or buildExecutor(...args).asQueue(['test1', 'test2', 'test 10'])`**

arguments | description
--- | ---
**`itPattern`** | Type: OPTIONAL `RegEx` <br> RegEx for it title. example it('test item'); -> itRegEx = /(?<=it\(').+(?=')/ig; <br> in case of undefined library will define ***itPattern*** based on first symbol in it title;
**`casesList`** | Type: `string[]` <br> List with tests what should be executed one by on `can be first argument, because itPattern is an optional`

**`returns {command: function}`**

<br>
<br>

## command

**`buildExecutor(...args).asQueue(...args1).command({'--test': 'test'}, {ENV: 'test'}) or buildExecutor(...args).asQueue(...args1).command()`**

arguments | description
--- | ---
**`processArgs`** | Type: `undefined` | `null` | `{[prop: string]: string}` <br> Object with required process argumentss, use format prop name with - or --, example '--prop' or '-p'
**`processEnvVars`** | Type: `undefined` | `null` | `{[prop: string]: string}` <br> Object with required process env variables, use format prop name upper snake_case, LOG_LEVEL

**`returns {executor: function}`**

<br>
<br>

## executor

**`buildExecutor(...args).asQueue(...args1).command().executor({maxThreads: 1, attemptsCount: 2, logLevel: 'ERROR'})`**

arguments | description
--- | ---
**`buildOpts`** | Type: `object` <br> Options for executor
**`buildOpts.maxThreads`** | Type: `number`,  <br> How many threads can be executed in same time <br> **Default threads count is 5**
**`buildOpts.attemptsCount`** | Type: `number`,  <br> How many times can we try to execute command for success result **in next cycle will be executed only faild command, success commands will not be reexecuted** <br> **Default attempts count is 2**
**`buildOpts.pollTime`** | Type: `number` ,  <br> Period for recheck about free thread <br> **Default is 1 second**
**`buildOpts.logLevel`** | Type: `string`, one of 'ERROR', 'WARN', 'INFO', 'VERBOSE', <br> ERROR - only errors, WARN -  errors and warnings, INFO - errors, warnings and information, VERBOSE - full logging <br> **Default is 'ERROR'**
**`buildOpts.currentExecutionVariable`** | Type: `string`, will be execution variable with execution index for every cycle will be ++ <br>
**`buildOpts.everyCycleCallback`** | Type: `function`,  <br> Optional. everyCycleCallback will be executed after cycle, before next execution cycle.<br> **Default is false**
**`buildOpts.processResultAnalyzer`** | Type: `function`,  <br> Optional. processResultAnalyzer is a function where arguments are original command, execution stack trace and notRetriable array processResultAnalyzer should return a new command what will be executed in next cycle or **null** - if satisfactory result <br>
**`buildOpts.longestProcessTime`** | Type: `number`,  <br> In case if command execution time is longer than longest Process Time - executor will kill it automatically and will try to execute this command again. <br> **Default time is 45 seconds**

**`returns {execute: async function}`**

<br>
<br>

## execute

**`buildExecutor(...args).asQueue(...args1).command().executor(...args2).execute()`**

#### no arguments here

**`returns {retriable: string[]; notRetriable: string[]}`**
