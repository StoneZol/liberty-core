import { crypto } from './crypto.js'
const { encrypt, decrypt, hmac, generateNoise } = crypto

/**
 * Encrypt object
 * @param {{obj: object, key: string, noiseLength: number}} obj 
 * @returns {string}
 */
const encryptObj = ({obj, key, noiseLength=15})=> {
    const noise = generateNoise(noiseLength)
    const cryptedObj = encrypt(JSON.stringify(obj), key)
    const payload = `${noise}${cryptedObj}`
    const hmacObj = hmac(payload, key)
    return `${payload}:${hmacObj}`
}

/**
 * Decrypt object
 * @param {{str: string, key: string, noiseLength: number}} obj 
 * @returns {object}
 */
const decryptObj = ({str, key, noiseLength=15})=> {
    const [cryptedObj, hmacObj] = str.split(':')
    const checkValidateMac = hmac(cryptedObj, key)
    if (checkValidateMac !== hmacObj) {
        throw new Error('HMAC verification failed')
    }
    const cleanObj = cryptedObj.slice(noiseLength)
    const result = JSON.parse(decrypt(cleanObj, key))
    return result
}

export const obj = {
    encrypt: encryptObj,
    decrypt: decryptObj,
}
