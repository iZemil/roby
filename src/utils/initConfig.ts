import * as fs from 'fs/promises';

import { getConfig } from '.';

export const initConfig = async () => {
    try {
        await fs.writeFile(
            getConfig(),
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

        console.log(`Config file was created.`);
    } catch (e) {
        console.error(e);
    }
};
