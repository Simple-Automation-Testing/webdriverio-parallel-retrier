import * as fs from 'fs';
import {buildRunner, IBuildOpts} from 'process-rerun';
import {getSpecFilesList} from './testlist';
import {buildCommand} from './command';
import {mochaJasminePatternDoubleQuote, mochaJasminePatternSingleQuote, mochaJasminePatternApostrophe} from './mocha.jasmine.grepper';

function getPattern(content: string) {
  const itPattern = /(?<=it\()./ig
  const matched = content.match(itPattern);
  if (matched) {
    const char = matched[0];
    switch (char) {
      case "'":
        return mochaJasminePatternSingleQuote;
      case '"':
        return mochaJasminePatternDoubleQuote;
      case '`':
        return mochaJasminePatternApostrophe;
      default:
        return mochaJasminePatternDoubleQuote;
    }
  }
}

function getGrepArgument(framework) {
  switch (framework) {
    case 'jasmine':
      return '--jasmineNodeOpts.grep';
    case 'mocha':
      return '--mochaOpts.grep';
    default:
      return '--jasmineNodeOpts.grep'
  }
}

interface IOpts {
  pattern?: RegExp;
  queue?: string[];
  by?: 'it' | 'queue';
  grepArgument?: '--mochaOpts.grep' | '--jasmineNodeOpts.grep';
}

function next(configPath, specsDirPath, opts: IOpts = {}) {
  if (!Array.isArray(specsDirPath) && !fs.existsSync(specsDirPath)) {
    throw new Error(`${specsDirPath} path to specs`);
  }

  const files = Array.isArray(specsDirPath) ? specsDirPath : getSpecFilesList(specsDirPath);

  return {
    command: function(runArgs: {[k: string]: string} | null = {}, envVars: {[k: string]: string} = {}) {
      if (runArgs === null) {
        runArgs = {};
      }
      if (!envVars) {
        envVars = {};
      }
      let commands = [];
      if (opts.by === 'queue') {
        for (const queued of opts.queue) {
          files.forEach((specFilePath) => {
            const content = fs.readFileSync(specFilePath, {encoding: 'utf8'});
            opts.pattern = opts.pattern || getPattern(content);
            const grepOpts = content.match(opts.pattern as RegExp);
            if (grepOpts) {
              const itName = grepOpts.find((itName) => itName === queued);
              if (itName) {
                runArgs[opts.grepArgument] = `'${itName}'`;
                const cmd = buildCommand(configPath, specFilePath, runArgs, envVars);
                commands.push(cmd);
              }
            }
          })
        }
      } else if (opts.by === 'it') {
        files.forEach((specFilePath) => {
          const content = fs.readFileSync(specFilePath, {encoding: 'utf8'});
          opts.pattern = opts.pattern || getPattern(content);
          const grepOpts = content.match(opts.pattern as RegExp);
          if (grepOpts) {
            grepOpts.forEach((itName) => {
              runArgs[opts.grepArgument] = `'${itName}'`;
              const cmd = buildCommand(configPath, specFilePath, runArgs, envVars);
              commands.push(cmd);
            });
          }
        });
      } else {
        commands.push(...files.map((specFilePath) => {
          return buildCommand(configPath, specFilePath, runArgs, envVars);
        }));
      }
      return {
        executor: function(runnerOpts: IBuildOpts): {execute: () => Promise<{notRetriable: string[], retriable: string[]}>} {
          const runner = buildRunner(runnerOpts);
          return {
            execute: () => runner(commands)
          }
        }
      }
    }
  }
}

function buildExecutor(pathToConfig: string, configPath: string | string[]) {
  const supportedFrameworks = ['jasmine', 'mocha', 'jasmine2']
  if (!fs.existsSync(pathToConfig)) {
    throw new Error(`${pathToConfig} path to config`);
  }

  let framework = null;
  const confgiModule = require(pathToConfig);
  if (confgiModule.config && confgiModule.config.framework) {
    framework = confgiModule.config.framework;
  } else if (confgiModule.framework) {
    framework = confgiModule.framework;
  } else if (confgiModule.conf && confgiModule.conf.framework) {
    framework = confgiModule.conf.framework;
  }

  if (!supportedFrameworks.includes(framework)) {
    throw new Error(`
      Not supported framework,
      supported frameworks are: ${supportedFrameworks.join(', ')},
      Development in process, will be implemented in future
    `);
  }
  return {
    byIt: function(pattern?: RegExp) {
      return next(pathToConfig, configPath, {
        pattern,
        grepArgument: getGrepArgument(framework),
        by: 'it',
      });
    },
    byFile: function() {
      return next(pathToConfig, configPath);
    },
    asQueue: function(patternOrQueue?: RegExp | string[], queue?: string[]) {
      if (arguments.length === 1) {
        queue = patternOrQueue as string[];
        patternOrQueue = null;
      }
      if (!Array.isArray(queue)) {
        throw new Error(`queue should be string[]`);
      }
      return next(pathToConfig, configPath, {
        pattern: patternOrQueue as any,
        grepArgument: getGrepArgument(framework),
        queue,
        by: 'queue',
      });
    }
  }
}

export {
  buildExecutor,
  mochaJasminePatternDoubleQuote,
  mochaJasminePatternSingleQuote
}