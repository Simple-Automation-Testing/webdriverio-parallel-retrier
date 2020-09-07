import {buildExecutor} from '../src';
import {resolve} from 'path';


describe('test', function() {
  it('test', async function() {
    const cwd = process.cwd();
    const testCaseRegPattern = /(?<=it\(').+(?=')/ig;
    const result = await buildExecutor(resolve(cwd, './wdio-noop/wdio.conf.js'), resolve(cwd, './wdio-noop/specs'))
      .byFile()
      .command({'--mochaOpts.timeout': '100000', '--procTime': '1000', '--mochaOpts.reporter': 'mocha-allure2-reporter'}, {'TESTS': 'test_example'})
      .executor({attemptsCount: 2, maxThreads: 1, debugProcess: true})
      .execute()
  })
})