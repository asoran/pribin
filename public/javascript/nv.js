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
const arrayBufferToString = (arr) => String.fromCharCode(...arr);
const stringToArrayBuffer = (str) => new Uint8Array(str.split('').map(x => x.charCodeAt(0)));

// Generate a new random (size * 8) bits key
const generayeRandomUint8Array = (size) => window.crypto.getRandomValues(new Uint8Array(size));

async function generateKey(keySize) {
    return await window.crypto.subtle.generateKey({
        name: 'AES-GCM',
        length: keySize, // 128, 192, or 256.
    }, true, ['encrypt', 'decrypt']);
}

async function encrypt(params, key, data) {
    return await window.crypto.subtle.encrypt(params, key, data);
}

async function decrypt(params, key, data) {
    return await window.crypto.subtle.decrypt(params, key, data);
}


// (async () => {
//     a = await generateKey(256);

//     exp = await crypto.subtle.exportKey('raw', a);
//     console.log(exp);
//     console.log(new Uint8Array(exp));
//     console.log(new Uint16Array(exp));

//     key = await crypto.subtle.importKey(
//         'raw',
//         exp,
//         'AES-GCM',
//         false,
//         ['encrypt', 'decrypt',],
//     );

//     console.log(key);

//     let iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits/8 = 12
//     let params = {
//         name: 'AES-GCM',
//         iv, // 96 bits
    
//         tagLength: 128, // 96, 104, 112, 120 or 128
//     }

//     let omg = 'Salut :D';
//     console.log(new Uint8Array(await encrypt(params, key, new Uint8Array(omg.split('').map(x => x.charCodeAt(0))))));

// })();


// EmPkHSvY4xZvuQV9expMYZP2VKNeiV8QSZbnQrAyZXEDvbQRSXVrXg==
const TEXT_A_CODE = 'Coucou 😊Coucou😊Coucou 😊Coucou😊';
async function send(msg) {
    let plainArr = new TextEncoder().encode(msg);

    let iv = generayeRandomUint8Array(96/8); // 96 bits/8 = 12

    let key = await generateKey(256);
    let keyArr = new Uint8Array(await crypto.subtle.exportKey('raw', key));
    let keyPlain64 = btoa(String.fromCharCode(...keyArr));

    let params = {
        name: 'AES-GCM',
        iv, // 96 bits
    
        tagLength: 128, // 96, 104, 112, 120 or 128
    }

    let cipherArr = new Uint8Array(await encrypt(params, key, plainArr));
    let cipherPlain = btoa(String.fromCharCode(...cipherArr))

    get(params, keyPlain64, cipherPlain);
}

async function get(params, key64, cipherPlain) {
    console.log(params, key64, cipherPlain);

    let cipherArr = new Uint8Array(atob(cipherPlain).split('').map(x => x.charCodeAt(0)));
    let keyArr = new Uint8Array(atob(key64).split('').map(x => x.charCodeAt(0)));

    let key = await crypto.subtle.importKey(
        'raw',
        keyArr,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt',]
    );

    let msgArr = new Uint8Array(await decrypt(params, key, cipherArr));
    let msgPlain = new TextDecoder().decode(msgArr);

    console.log(cipherPlain);
    console.log(key64);
    console.log(msgArr);
    console.log(msgPlain);

}

send(TEXT_A_CODE);

})();

// String.prototype.codePointAt.call('')
// https://github.com/github/gitignore
// http://justinhileman.info/article/git-pretty/full/

