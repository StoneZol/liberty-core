import CryptoJS from 'crypto-js'
import { libertyEmojis, chars } from '../lib.js'

/**
 * Get visual fingerprint
 * @param {string} hashstr 
 * @param {number} count 
 * @returns {string}
 */
const getVisualFingerprint =(hashstr, count=4)=>{
    const hexChank = hashstr.slice(0, count*2)
    let emojis = ''
    for (let i = 0; i < count; i++) {
        const index = parseInt(hexChank.slice(i*2, (i+1)*2), 16)
        emojis += libertyEmojis[index % libertyEmojis.length]
    }
    return emojis
}


/**
 * Get char fingerprint
 * @param {string} hashstr 
 * @param {number} count 
 * @returns {string}
 */
const getCharFingerprint =(hashstr, count=16)=>{
    const charsSet = chars.split('')
    const hexChank = hashstr.slice(0, count*2)
    let charsStr = ''
    for (let i = 0; i < count; i++) {
        const index = parseInt(hexChank.slice(i*2, (i+1)*2), 16)
        charsStr += charsSet[index % charsSet.length]
    }
    return charsStr
}
/**
 * 
 * SHA512 hash
 * @param {string} str 
 * @param {number} iterations 
 * @returns {string}
 */
const hash = (str, iterations = 1)=> {
    let hash = str
    for (let i = 0; i < iterations; i++) {
        hash = CryptoJS.SHA512(hash).toString()
    }
    return hash
}

/**
 * PBKDF2 derive key
 * @param {string} str
 * @param {string} salt 
 * @param {number} iterations 
 * @returns {string}
 */
const deriveKey = (str, salt, iterations = 10000)=> {
    return CryptoJS.PBKDF2(str, salt, {
        keySize: 512 / 16,  
        iterations: iterations
    }).toString()
}

/**
 * AES encrypt
 * @param {string} message 
 * @param {string} key 
 * @returns {string}
 */
const encrypt = (message, key) => {
    const iv = CryptoJS.lib.WordArray.random(128 / 8); 
    const encrypted = CryptoJS.AES.encrypt(message, key, { 
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return iv.toString() + encrypted.toString();
}

/**
 * AES decrypt
 * @param {string} message 
 * @param {string} key 
 * @returns {string}
 */
const decrypt = (ciphertextWithIv, key) => {
    const iv = CryptoJS.enc.Hex.parse(ciphertextWithIv.slice(0, 32));
    const actualCiphertext = ciphertextWithIv.slice(32);
    const bytes = CryptoJS.AES.decrypt(actualCiphertext, key, { 
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Generate noise
 * @param {string} charset 
 * @param {number} length 
 * @returns {string}
 */
const generateNoise =(length=1, charset=chars)=> {
    return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('')
}

/**
 * Generate salt
 * @returns {string}
*/
export const generateSalt = ()=>{
    return CryptoJS.lib.WordArray.random(512/16).toString()
}

/**
 * HMAC
 * @param {string} message 
 * @param {string} key 
 * @returns {string}
*/
const hmac = (message, key)=> {
    return CryptoJS.HmacSHA512(message, key).toString()
}


export const crypto = {
    hash: hash,
    deriveKey: deriveKey,
    encrypt: encrypt,
    decrypt: decrypt,
    generateNoise: generateNoise,
    generateSalt: generateSalt,
    hmac: hmac,
    getVisualFingerprint: getVisualFingerprint,
    fingerprint:{
        visual: getVisualFingerprint,
        char: getCharFingerprint,
    }
}
