import * as fs from 'fs';
import {getFilesList} from 'process-rerun';
import {isRegExp, isString} from './utils';

function getSpecFilesList(specsFolderPath: string, pattern?: string | RegExp) {
  if (!fs.existsSync(specsFolderPath)) {
    throw new Error(`${specsFolderPath} folder does not exists`);
  }

  if (pattern && !isRegExp(pattern) && !isString(pattern)) {
    throw new Error(`pattern should be string or RegExp`);
  }
  if (isString(pattern)) {
    pattern = new RegExp(pattern, 'ig');
  }

  const specList = getFilesList(specsFolderPath) as string[];

  if (pattern) {
    return specList.filter((specPath) => specPath.match(pattern));
  }
  return specList;
}

export {
  getSpecFilesList
}