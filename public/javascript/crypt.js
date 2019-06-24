// Browser side functions for encoding / decoding

// String to Base64
const str2b64 = msg => btoa(unescape(encodeURIComponent(msg)));
// Base64 to String
const b642str = msg => decodeURIComponent(escape(atob(msg)));

// Generate a new random (size * 8) bits key
const generateKey = (size) => window.crypto.getRandomValues(new Uint8Array(size));
const getAesCtrCounter = () => new aesjs.Counter(5);

function encryptText(text, key) {
    // Converting text to B64 for unicode
    const textBytes = aesjs.utils.utf8.toBytes(str2b64(text));
    const counter = getAesCtrCounter();
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, counter);
    const encryptedBytes = aesCtr.encrypt(textBytes);

    return aesjs.utils.hex.fromBytes(encryptedBytes);
};

function decryptText(cipher, key) {
    const encryptedBytes = aesjs.utils.hex.toBytes(cipher);
    const counter = getAesCtrCounter();
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, counter);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return b642str(aesjs.utils.utf8.fromBytes(decryptedBytes));
}

(test = () => {
    const keySize = 16;

    // ---- Encrypt
    const key = generateKey(keySize);
    const text = 'Type as many 😋 as you want';

    // Put the key in the url as base64 text
    const url = str2b64([...key].map(x => String.fromCharCode(x)).join(''));
    const cipher = encryptText(text, key);

    // ---- Decrypt
    // Decode the url to get the url (b64 -> Uint8Array)
    const _key = new Uint8Array(b642str(url).split('').map(x => x.charCodeAt(0)));
    const decoded = decryptText(cipher, _key);
    console.log(decoded);
})();
