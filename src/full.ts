type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
type CryptParam = RsaOaepParams | AesCtrParams | AesCbcParams | AesCmacParams | AesGcmParams | AesCfbParams;

const arrayBufferToString = (arr: TypedArray): string => String.fromCharCode(...arr);
const stringToArrayBuffer = (str: string): Uint8Array => new Uint8Array(str.split('').map(x => x.charCodeAt(0)));

// Generate a new random (size * 8) bits key
const generayeRandomUint8Array = (size: number): any => window.crypto.getRandomValues(new Uint8Array(size));

function generateKey(keySize: number): PromiseLike<CryptoKey> {
    return window.crypto.subtle.generateKey({
            name: 'AES-GCM',
            length: keySize, // 128, 192, or 256.
        },
        true,
        ['encrypt', 'decrypt']
    );
}

function encrypt(params: CryptParam, key: CryptoKey, data: TypedArray): PromiseLike<ArrayBuffer> {
    return window.crypto.subtle.encrypt(params, key, data);
}

function decrypt(params: CryptParam, key: CryptoKey, data: TypedArray) {
    return window.crypto.subtle.decrypt(params, key, data);
}

function importKey(keyArr: TypedArray): PromiseLike<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        keyArr,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt',]
    );
}

async function send(msg: string) {
    let plainArr = new TextEncoder().encode(msg);

    let iv = generayeRandomUint8Array(96/8); // 96 bits/8 = 12

    let key = await generateKey(256);
    let keyArr = new Uint8Array(await crypto.subtle.exportKey('raw', key));
    let keyPlain64 = btoa(arrayBufferToString(keyArr));

    let params: AesGcmParams = {
        name: 'AES-GCM',
        iv, // 96 bits
        // additionalData: new Uint8Array(),
        tagLength: 128, // 96, 104, 112, 120 or 128
    }

    let cipherArr = new Uint8Array(await encrypt(params, key, plainArr));
    let cipherPlain = btoa(arrayBufferToString(cipherArr))

    return {cipherPlain, iv, keyPlain64};
}

async function get(params: CryptParam, key64: string, cipherPlain: string): Promise<string> {
    console.log(params, key64, cipherPlain);

    let cipherArr = stringToArrayBuffer(atob(cipherPlain));
    let keyArr =  stringToArrayBuffer(atob(key64));

    let key = await importKey(keyArr);

    let msgArr = new Uint8Array(await decrypt(params, key, cipherArr));
    let msgPlain = new TextDecoder().decode(msgArr);

    console.log(cipherPlain);
    console.log(key64);
    console.log(msgArr);
    console.log(msgPlain);

    return msgPlain;
}

const TEXT_A_CODE = 'Coucou 😊Coucou 😊Coucou 😊Coucou 😊';
//send(TEXT_A_CODE);
