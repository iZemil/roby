import axios, { AxiosError, AxiosResponse } from 'axios';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

import { delay } from '../utils';

import { RESULT_FILENAME, getConfigPath } from './consts';
import { TConfig } from './types';
import { validateConfig } from './validateConfig';

interface Result {
    name: string;
    url: string;
    status?: number;
}

function isAxiosError(error: any): error is AxiosError {
    if ('response' in error) {
        return true;
    }

    return false;
}

const log = console.log;

export const runConfig = async (options: TConfig = require(getConfigPath())): Promise<void> => {
    try {
        validateConfig(options);

        log(chalk.blue('Roby is running...'));

        const { baseUrl, items, query, handler } = options;
        const result: Result[] = [];
        for (const item of items) {
            const url = query(baseUrl, item);

            let status = undefined;
            let response: AxiosResponse | null = null;
            try {
                response = (await axios.get(url)) as AxiosResponse;

                status = response.status;
            } catch (e) {
                if (isAxiosError(e) && e.response) {
                    status = e.response.status;
                }
            }

            log(`${status}: ${url}`);
            result.push(handler(response, item));

            await delay(options.delay);
        }

        try {
            await fs.writeFile(RESULT_FILENAME, JSON.stringify(result));
        } catch (e) {
            console.error(e);
        }

        log(chalk.green(`\nFinished:\n> ${path.resolve(RESULT_FILENAME)}`));
    } catch (e) {
        console.error(e);
    }
};
