import { crypto } from './crypto.js'

const { generateNoise, encrypt, decrypt, hmac } = crypto

/**
 * Create crypto message
 * @param {{message: string, key: string, noiseLength: number, clanPoint: string}} obj 
 * @returns {string}
*/
const createMessage = ({message, key, noiseLength=15, clanPoint=''})=> {
    const noise = generateNoise(noiseLength)
    const cryptedMessage = encrypt(message, key)
    const payload = `[${clanPoint}]:${noise}${cryptedMessage}`
    const hmacMessage = hmac(payload, key)
    return `${payload}:${hmacMessage}`
}

/**
 * Restore crypto message   
 * @param {{message: string, key: string, noiseLength: number}} obj 
 * @returns {string}
 */
const restoreMessage = ({message, key, noiseLength=15})=> {
    const [clanPoint, cryptedMessage, hmacMessage] = message.split(':')
    const payload = `${clanPoint}:${cryptedMessage}`
    const checkValidateMac = hmac(payload, key)
    if (checkValidateMac !== hmacMessage) {
        throw new Error('HMAC verification failed')
    }   
    const cleanMessage = cryptedMessage.slice(noiseLength)
    return decrypt(cleanMessage, key)
}

export const message = {
    encrypt: createMessage,
    decrypt: restoreMessage,
}
