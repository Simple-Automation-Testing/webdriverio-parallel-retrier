import * as path from 'path';

function buildCommand(configPath: string, specFilePath: string, runArgs: {[k: string]: string} = {}, envVars: {[k: string]: string} = {}) {
  const vars = Object.keys(envVars).reduce((acc, k) => {
    acc += `${k}=${envVars[k]} `;
    return acc;
  }, '');

  const args = Object.keys(runArgs).reduce((acc, k) => {
    const argPart = runArgs[k] === null ? `${k} ` : `${k}=${runArgs[k]} `;
    acc += argPart;
    return acc;
  }, '');

  const cmd = `${vars} ${path.resolve(process.cwd(), './node_modules/.bin/wdio')} ${configPath} --spec=${specFilePath} ${args}`;

  return cmd;
};

export {
  buildCommand
}
