// http://www.unicode.org/versions/Unicode9.0.0/UnicodeStandard-9.0.pdf
// 1000+ 
/*
async function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}
*/
/*
key = random Uint8Array

crypt:
    ut8 to bytes ( str2b64 (text) )
    return cipher.toHexa
*/
(() => {
const stringToUtf8 = (str) => unescape(encodeURIComponent(str));
const utf8ToString = (str) => decodeURIComponent(escape(str));

// String to Base64
const str2b64 = msg => btoa(stringToUtf8(msg));
// Base64 to String
const b642str = msg => utf8ToString(atob(msg));

const arrayBufferToString = (arr) => [...arr].map(x => String.fromCharCode(x)).join('');
const stringToArrayBuffer = (str) => new Uint8Array(str.split('').map(x => x.charCodeAt(0)));

// Generate a new random (size * 8) bits key
const generayeRandomUint8Array = (size) => window.crypto.getRandomValues(new Uint8Array(size));

async function generateKey(keySize) {
    return await window.crypto.subtle.generateKey({
        name: 'AES-GCM',
        length: keySize, // 128, 192, or 256.
    }, false, ['encrypt', 'decrypt', 'deriveKey']);
}

async function encrypt(params, key, data) {
    return await window.crypto.subtle.encrypt(params, key, data);
}

async function decrypt(params, key, data) {
    return await window.crypto.subtle.decrypt(params, key, data);
}


(async () => {

    key = await crypto.subtle.importKey(
        'raw',
        a,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt',],
    );

    console.log(new Uint8Array(await encrypt(key, 'Salut :D')));

})();


// EmPkHSvY4xZvuQV9expMYZP2VKNeiV8QSZbnQrAyZXEDvbQRSXVrXg==
const TEXT_A_CODE = 'Coucou 😮Coucou 😮Coucou 😮Coucou 😮';
async function send(msg) {
    let plainArr = stringToArrayBuffer(stringToUtf8(msg));

    let iv = generayeRandomUint8Array(96/8); // 96 bits/8 = 12

    let keyArr = await generateKey(256);

    let params = {
        name: 'AES-GCM',
        iv, // 96 bits
    
        tagLength: 128, // 96, 104, 112, 120 or 128
    }

    console.log('key', keyArr);
    let cipherArr = new Uint8Array(await encrypt(params, keyArr, plainArr));
    console.log('arr', cipherArr);
    let cipherPlain = str2b64(arrayBufferToString(cipherArr));
    console.log("-----");
    console.log(msg);
    console.log(plainArr);
    console.log(params);
    console.log(keyArr);
    console.log('iv', iv);
    console.log(cipherArr);
    console.log(cipherPlain);
    console.log(cipherPlain.length);
    console.log("-----");

    get(params, keyArr, cipherPlain);
}

async function get(params, key, cipherPlain) {
    console.log(cipherPlain);

    let cipherArr = stringToArrayBuffer(b642str(cipherPlain));

    let msgArr = new Uint8Array(await decrypt(params, key, cipherArr));
    let msgPlain = utf8ToString(arrayBufferToString(msgArr));

    console.log(cipherArr);
    console.log(msgArr);
    console.log(msgPlain);
}

send(TEXT_A_CODE);

})();
