#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { Options, roby } from '.';

export const runCli = async () => {
    const argv = yargs(hideBin(process.argv))
        .usage('Usage:\n1. Init config: roby --init\n2. Set up config file\n3. Run config: roby --run')
        .option('init', {
            type: 'boolean',
            description: `Init config file`,
        })
        .option('run', {
            type: 'boolean',
            description: `Run config file`,
        })
        .alias('h', 'help')
        .alias('v', 'version').argv as Options;

    roby(argv);
};

runCli();
