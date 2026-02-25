export interface LibertyCryptoFingerprint {
    visual(hashstr: string, count?: number): string;
    char(hashstr: string, count?: number): string;
}

export interface LibertyCrypto {
    hash(str: string, iterations?: number): string;
    deriveKey(str: string, salt: string, iterations?: number): string;
    encrypt(message: string, key: string): string;
    decrypt(ciphertextWithIv: string, key: string): string;
    generateNoise(length?: number, charset?: string): string;
    generateSalt(): string;
    hmac(message: string, key: string): string;
    getVisualFingerprint(hashstr: string, count?: number): string;
    fingerprint: LibertyCryptoFingerprint;
}

export interface LibertyMessageCreateArgs {
    message: string;
    key: string;
    noiseLength?: number;
    clanPoint?: string;
}

export interface LibertyMessageRestoreArgs {
    message: string;
    key: string;
    noiseLength?: number;
}

export interface LibertyMessage {
    encrypt(args: LibertyMessageCreateArgs): string;
    decrypt(args: LibertyMessageRestoreArgs): string;
}

export interface LibertyObjEncryptArgs<T = any> {
    obj: T;
    key: string;
    noiseLength?: number;
}

export interface LibertyObjDecryptArgs {
    str: string;
    key: string;
    noiseLength?: number;
}

export interface LibertyObj {
    /**
     * Encrypts an object via JSON.stringify + AES + HMAC.
     * Returns an opaque string.
     */
    encrypt<T = any>(args: LibertyObjEncryptArgs<T>): string;

    /**
     * Decrypts back to plain object (JSON.parse is handled internally).
     */
    decrypt<T = any>(args: LibertyObjDecryptArgs): T;
}

export interface LibertyCore {
    message: LibertyMessage;
    crypto: LibertyCrypto;
    obj: LibertyObj;
}

export interface AsyncCallSuccess<T = any> {
    success: true;
    result: T;
}

export interface AsyncCallFailure {
    success: false;
    message: string;
}

export type AsyncCallResult<T = any> = AsyncCallSuccess<T> | AsyncCallFailure;

export interface LibertyHelpers {
    /**
     * Wraps sync/async function into a Promise that never throws,
     * but resolves to { success, result | message }.
     */
    asyncCall<T = any>(
        func: (...args: any[]) => T | Promise<T>,
        ...args: any[]
    ): Promise<AsyncCallResult<T>>;
}

export const libertyCore: LibertyCore;
export const libertyHelpers: LibertyHelpers;

