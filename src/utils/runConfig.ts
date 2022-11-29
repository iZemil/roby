import axios, { AxiosError, AxiosResponse } from 'axios';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

import { Config, RESULT_FILENAME, delay, getConfig } from './';

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

export const runConfig = async (options: Config = require(getConfig())): Promise<void> => {
    try {
        const { baseUrl, items, urlHanlder, resultHandler } = options;
        const result: Result[] = [];

        // TODO: Validate configuration utility
        if (items.length === 0) {
            log(`Specify config items, eg: items: ["foo", "bar"]`);
            return;
        }
        if (!baseUrl) {
            log(`Specify config baseUrl`);
            return;
        }
        if (!resultHandler) {
            log(`Specify config resultHandler`);
            return;
        }

        log(chalk.blue('Roby is running...'));
        for (const item of options.items) {
            const url = urlHanlder(baseUrl, item);

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
            result.push(resultHandler(response, item));

            await delay(options.delay);
        }

        try {
            await fs.writeFile(RESULT_FILENAME, JSON.stringify(result));
        } catch (e) {
            console.error(e);
        }

        log(chalk.green(`\nFinished, see: ${path.resolve(RESULT_FILENAME)}`));
    } catch (e) {
        console.error(e);
    }
};
