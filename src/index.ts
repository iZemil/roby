import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

import { delay } from './utils';

const CONFIG_FILENAME = `roby.config.json`;
const RESULT_FILENAME = `roby.result.json`;
interface Config {
    baseUrl: string;
    names: string[];
    delay: number;
}

interface Result {
    name: string;
    url: string;
    status?: number;
}

const $NAME = '$NAME';
const DEFAULT_CONFIG: Config = {
    baseUrl: `https://www.npmjs.com/package/${$NAME}`,
    delay: 500,
    names: [],
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
            await fs.writeFile(CONFIG_FILENAME, JSON.stringify(DEFAULT_CONFIG));

            console.log(`Config file was created.`);
        } catch (e) {
            console.error(e);
        }
        return;
    }

    if (run) {
        try {
            const config = await fs.readFile(CONFIG_FILENAME, 'utf8');
            const configData: Config = JSON.parse(config);
            const result: Result[] = [];

            // Validate configuration:
            if (configData.names.length === 0) {
                console.log(`Specify config names, eg: names: ["foo", "bar"]`);
                return;
            }

            if (!configData.baseUrl || !configData.baseUrl.includes($NAME)) {
                console.log(`Specify config baseUrl with $NAME pattern, eg: https://example.com/users/$NAME`);
                return;
            }

            console.log('Roby is running...');
            for (const name of configData.names) {
                const url = configData.baseUrl.replace($NAME, name);

                let status = undefined;
                try {
                    const response = await axios.get(url);

                    status = response.status;
                } catch (e) {
                    if (isAxiosError(e) && e.response) {
                        status = e.response.status;
                    }
                }

                console.log(`${name} => ${status}`);
                result.push({
                    name,
                    status,
                    url,
                });

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
