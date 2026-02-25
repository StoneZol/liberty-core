## liberty-core

**liberty-core** is a small crypto core built on top of `crypto-js`: AES-CBC + HMAC, “protected” string messages, object wrappers, and helper utilities (hashing, PBKDF2, fingerprints, etc.).

The library is an ES module (`type: module`) and exposes a single facade `libertyCore` plus helper utilities.

---

## Installation

```bash
npm install liberty-core
```

`crypto-js` is already included as a dependency, you don't need to install it separately.

---

## Quick start

### Encrypting and restoring a message (string)

```js
import { libertyCore } from 'liberty-core';

const key = 'my-secret-key';
const plainText = 'Hello, world!';

// Encrypt a message
const cryptoMessage = libertyCore.message.encrypt({
  message: plainText,
  key,
  noiseLength: 15,      // optional, defaults to 15
  clanPoint: 'myApp',   // optional marker inside the message
});

// Decrypt message
const restored = libertyCore.message.decrypt({
  message: cryptoMessage,
  key,
  noiseLength: 15,
});

console.log(restored); // "Hello, world!"
```

On restore, if HMAC does not match (corrupted message or wrong key), an exception `Error('HMAC verification failed')` is thrown.

---

## Async wrapper without try/catch

If you want to use the sync core API in `async/await` style and handle errors without `try/catch`, you can use `libertyHelpers.asyncCall`.

```js
import { libertyCore, libertyHelpers } from 'liberty-core';

const { asyncCall } = libertyHelpers;

const res = await asyncCall(
  libertyCore.message.decrypt,
  { message: cryptoMessage, key, noiseLength: 15 },
);

if (!res.success) {
  console.error('Failed to restore message:', res.message);
} else {
  console.log('Restored:', res.result);
}
```

`asyncCall`:
- on success returns `{ success: true, result }`;
- on failure returns `{ success: false, message }` without throwing.

---

## Working with objects

The `obj` module encrypts/decrypts JSON-compatible objects on top of the same primitives (AES + HMAC + noise).

```js
import { libertyCore } from 'liberty-core';

const secretObj = { foo: 1, bar: 'baz' };
const key = 'my-secret-key';

const encrypted = libertyCore.obj.encrypt({
  obj: secretObj,
  key,
  noiseLength: 10,
});

// `encrypted` is a string that you can store/transfer

const restoredObj = libertyCore.obj.decrypt({
  str: encrypted,
  key,
  noiseLength: 10,
});

console.log(restoredObj); // { foo: 1, bar: 'baz' }
```

If integrity fails or the key is wrong, `decrypt` throws `Error('HMAC verification failed')`.

---

## Low-level crypto API

Through `libertyCore.crypto` you get the low-level “building blocks” used by messages/objects:

```js
import { libertyCore } from 'liberty-core';

const { crypto } = libertyCore;

// SHA-512 with optional iterations
const hash = crypto.hash('password', 2);

// PBKDF2 (keySize 256 bits) — deriveKey(password, salt, iterations?)
const salt = crypto.generateSalt();
const key = crypto.deriveKey('password', salt, 10000);

// AES-CBC symmetric encryption with IV stored at the beginning of the string
const cipher = crypto.encrypt('secret text', key);
const plain = crypto.decrypt(cipher, key);

// HMAC-SHA512
const mac = crypto.hmac('some-payload', key);

// “Fingerprints” for visually verifying keys
const hashForFp = crypto.hash('some-key-material');
const emojiFingerprint = crypto.fingerprint.visual(hashForFp, 4);
const charFingerprint = crypto.fingerprint.char(hashForFp, 16);
```

---

## API Overview

- **`libertyCore.message`**
  - **`encrypt({ message, key, noiseLength?, clanPoint? })`**: encrypts a string into format  
    `"[<clanPoint>]:<noise><ciphertext>:<hmac>"`.
  - **`decrypt({ message, key, noiseLength? })`**: verifies HMAC and decrypts the string; throws `Error` on failure.

- **`libertyCore.obj`**
  - **`encrypt({ obj, key, noiseLength? })`**: encrypts an object (via JSON.stringify) into an opaque string with HMAC.
  - **`decrypt({ str, key, noiseLength? })`**: verifies HMAC and returns the restored object.

- **`libertyCore.crypto`**
  - **`hash(str, iterations?)`**: SHA-512 with optional iterations.
  - **`deriveKey(str, salt, iterations?)`**: PBKDF2 → hex string key.
  - **`encrypt(message, key)` / `decrypt(ciphertextWithIv, key)`**: AES-CBC (IV stored at the beginning of the string).
  - **`generateSalt()`**: random salt (hex).
  - **`generateNoise(length?, charset?)`**: “noise” to mask the beginning of payload.
  - **`hmac(message, key)`**: HMAC-SHA512.
  - **`fingerprint.visual(hashstr, count?)`**: emoji fingerprint based on hash.
  - **`fingerprint.char(hashstr, count?)`**: character fingerprint based on hash.

- **`libertyHelpers`**
  - **`asyncCall(func, ...args)`**: universal async wrapper around sync/async functions:
    - on success returns `{ success: true, result }`,
    - on failure returns `{ success: false, message }`.

---

## License

Published under the **MIT** license.
