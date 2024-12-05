export declare const pbkdf2Encrypt: (password: string) => {
    salt: string;
    result: string;
};
export declare const pbkdf2Decrypt: (password: string, salt: string) => string;
export declare const generateRSAKey: () => void;
export declare const getRSAPublicKey: () => Promise<string>;
export declare const getRSAPrivateKey: () => Promise<string>;
