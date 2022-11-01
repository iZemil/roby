import axios, { AxiosError, AxiosResponse } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

import { delay } from './utils';

const CONFIG_FILENAME = `roby.config.js`;
const RESULT_FILENAME = `roby.result.json`;
interface Config<T = unknown> {
    baseUrl: string;
    items: T[];
    delay: number;
    urlHanlder: (baseUrl: string, item: T) => string;
    resultHandler: (response: AxiosResponse | null, item: T) => any;
}

interface Result {
    name: string;
    url: string;
    status?: number;
}

const DEFAULT_CONFIG: Config = {
    delay: 500,
    baseUrl: `https://www.npmjs.com/package`,
    urlHanlder: (baseUrl, item) => `${baseUrl}/${item}`,
    resultHandler: (response, item) => {
        return;
    },
    items: ['foo', 'bar'],
};

export interface Options {
    init?: boolean;
    run?: boolean;
}

function isAxiosError(error: any): error is AxiosError {
    if ('response' in error) {
        return true;
    }

    return false;
}

export const roby = async (options: Options): Promise<void> => {
    const { init, run } = options;

    if (init) {
        try {
            await fs.writeFile(
                CONFIG_FILENAME,
                `module.exports = ${JSON.stringify(DEFAULT_CONFIG, function (key, val) {
                    if (typeof val === 'function') {
                        return val + ''; // implicitly `toString` it
                    }
                    return val;
                })}`
            );

            console.log(`Config file was created.`);
        } catch (e) {
            console.error(e);
        }
        return;
    }

    if (run) {
        try {
            // eslint-disable-next-line
            const configData: Config = require(path.resolve(`./${CONFIG_FILENAME}`));
            const { baseUrl, items, urlHanlder, resultHandler } = configData;
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
            for (const item of configData.items) {
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

                await delay(configData.delay);
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
        return;
    }

    console.log(`No options. Run: roby --help`);
};
