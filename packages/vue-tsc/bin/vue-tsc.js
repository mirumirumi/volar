#!/usr/bin/env node
const fs = require('fs');

const readFileSync = fs.readFileSync;
const tscPath = require.resolve('typescript/lib/tsc');
const proxyPath = require.resolve('../out/proxy');

fs.readFileSync = (...args) => {
    if (args[0] === tscPath) {
        let tsc = readFileSync(...args);
        tsc = tsc.replace(
            `function createIncrementalProgram(_a) {`,
            `function createIncrementalProgram(_a) { console.error('incremental mode is not yet supported'); throw 'incremental mode is not yet supported';`,
        );
        tsc = tsc.replace(
            `function createWatchProgram(host) {`,
            `function createWatchProgram(host) { console.error('watch mode is not yet supported'); throw 'watch mode is not yet supported';`,
        );
        tsc = tsc.replace(
            `function createProgram(rootNamesOrOptions, _options, _host, _oldProgram, _configFileParsingDiagnostics) {`,
            `function createProgram(rootNamesOrOptions, _options, _host, _oldProgram, _configFileParsingDiagnostics) { return require(${JSON.stringify(proxyPath)}).createProgramProxy(...arguments);`,
        );
        return tsc;
    }
    return readFileSync(...args);
};

require(tscPath);
