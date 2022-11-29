import chalk from 'chalk';
import * as fs from 'fs/promises';

import { getConfig } from '.';

export const initConfig = async () => {
    try {
        const config = getConfig();

        await fs.writeFile(
            config,
            `module.exports = {
    delay: 500,
    baseUrl: "https://www.npmjs.com/package",
    urlHanlder: (baseUrl, item) => {
        return \`\${baseUrl}/\${item}\`;
    },
    resultHandler: (response, item) => {
        return {
            status: response.status,
        };
    },
    items: ['foo', 'bar'],
}`
        );

        console.log(chalk.green(`Config file was created:\n> ${config}`));
    } catch (e) {
        console.error(e);
    }
};
