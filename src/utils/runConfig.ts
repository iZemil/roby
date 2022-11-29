import axios, { AxiosError, AxiosResponse } from 'axios';
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

export const runConfig = async (options: Config = require(getConfig())): Promise<void> => {
    try {
        const { baseUrl, items, urlHanlder, resultHandler } = options;
        const result: Result[] = [];

        // Validate configuration:
        if (items.length === 0) {
            console.log(`Specify config items, eg: items: ["foo", "bar"]`);
            return;
        }

        if (!baseUrl) {
            console.log(`Specify config baseUrl`);
            return;
        }

        if (!resultHandler) {
            console.log(`Specify config resultHandler`);
            return;
        }

        console.log('Roby is running...');
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

            console.log(`${status}: ${url}`);
            result.push(resultHandler(response, item));

            await delay(options.delay);
        }

        try {
            await fs.writeFile(RESULT_FILENAME, JSON.stringify(result));
        } catch (e) {
            console.error(e);
        }

        console.log(`Finished, see: ${path.resolve(RESULT_FILENAME)}`);
        return;
    } catch (e) {
        console.error(e);
    }
};
