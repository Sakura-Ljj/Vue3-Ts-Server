export declare const setValue: (key: string, value: any, time?: number) => void;
export declare const getValue: (key: string) => Promise<string | null>;
export declare const getHValue: (key: string) => Promise<{
    [x: string]: string;
}>;
export declare const delKey: (key: string) => void;
export declare const scanAndDel: (cursor: number, pattern: string) => void;
