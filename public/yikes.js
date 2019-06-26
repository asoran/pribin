/*
crypto.subtle.generateKey()
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto

*/


// hash | array buffer to string | new  TextEncoder()
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
s.digest('SHA-256', str2ab('COUCOU')).then(x => console.log(ab2str(x)));
// 16 bits


///////////////// b64 - unicode

((msg) => {
	a = btoa(unescape(encodeURIComponent(msg)));
	b = decodeURIComponent(escape(atob(a)));
	console.log(msg);
	console.log(a);
	console.log(b);
})('I 😃 myself')


///////////////// key gen
(() => {
    const keySize = 24;
    crypto.getRandomValues(new Uint8Array(keySize));

    const key = new Array(24).fill(null).map(x => Math.floor(Math.random() * 255));
    const keyUtf = aesjs.utils.utf8.fromBytes(key);
    const keyB64 = btoa(unescape(encodeURIComponent(keyUtf)));

    const a = decodeURIComponent(escape(atob(keyB64)));
    const b = aesjs.utils.utf8.toBytes(a);

    console.log(key);
    console.log(keyUtf);
    console.log(keyB64);

    console.log(a);
    console.log(b);
})();

////// random

function rand(min, max) {
    min = min || 0;
    max = (max || (2**31) - 1) - min;
    return Math.floor(Math.random() * max + min);
}

//////// final
(() => {
	str2b64 = msg => btoa(unescape(encodeURIComponent(msg)));
	b642str = msg => decodeURIComponent(escape(atob(msg)));
    // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
    const key = crypto.getRandomValues(new Uint8Array(16));
    const url = str2b64([...key].map(x => String.fromCharCode(x)).join(''));

    // Convert text to bytes
    var text = 'Text may be any 😋 you want';
    var textBytes = aesjs.utils.utf8.toBytes(str2b64(text));

    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log(encryptedHex);
    // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
    //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

    // ---------

    const _key = b642str(url).split('').map(x => x.charCodeAt(0));

    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(_key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    var decryptedText = b642str(aesjs.utils.utf8.fromBytes(decryptedBytes));
    console.log(decryptedText);
    // "Text may be any length you wish, no padding is required."

})();

function toRegional(str) {
    return str
        .toUpperCase()
        .split('')
        .map(x => 
            String.fromCodePoint(127462 + (x.charCodeAt(0) - 'A'.charCodeAt(0)))
        ).join(''); // > 🇦 <
}

from = (b) => {return {convert: (nb) => {return {to: (b2) => parseInt(nb, b).toString(b2) }}}};
from(2).convert('11111111').to(16); // FF

(() => {
	let arbre = ((mots) => {
		let a = mots.split(' ');
		let all = new Array();

		const appendArray = (arr, word) => {
			if(word === '')
				return;
			let c = word[0];
			if(arr[c] === undefined)
				arr[c] = new Array();
			appendArray(arr[c], word.substring(1));
		};

		a.forEach(x => appendArray(all, x));

		console.log(all);
		return all;
	})("Je ne sais pas si");

	print = (arr, s) => {
		if(Object.keys(arr).length == 0)
			console.log()//s);
		else {
			Object.keys(arr).forEach(c => {
				let ss = s + c;
				console.log('>'.repeat(ss.length) + ' ' + c);
				print(arr[c], ss);
			});
		}
	}

	print(arbre, '');

})();

/*
Zalando API guidelines
	https://opensource.zalando.com/restful-api-guidelines/#100
OpenAPI Swagger
    https://openapi-map.apihandyman.io/#objectchangelog
*/
