import * as fs from 'fs';
import * as path from 'path';

export function isDir(path: string): boolean {
    try {
        const stat = fs.lstatSync(path);

        return stat.isDirectory();
    } catch {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

export const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getConfig = () => path.resolve('roby.config.js');
export const RESULT_FILENAME = `roby.result.json`;
