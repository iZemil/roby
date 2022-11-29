import { AxiosResponse } from 'axios';

export interface Config<T = unknown> {
    baseUrl: string;
    items: T[];
    delay: number;
    urlHanlder: (baseUrl: string, item: T) => string;
    resultHandler: (response: AxiosResponse | null, item: T) => any;
}
