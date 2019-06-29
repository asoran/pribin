var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var arrayBufferToString = function (arr) { return String.fromCharCode.apply(String, __spread(arr)); };
var stringToArrayBuffer = function (str) { return new Uint8Array(str.split('').map(function (x) { return x.charCodeAt(0); })); };
// Generate a new random (size * 8) bits key
var generayeRandomUint8Array = function (size) { return window.crypto.getRandomValues(new Uint8Array(size)); };
function generateKey(keySize) {
    return window.crypto.subtle.generateKey({
        name: 'AES-GCM',
        length: keySize
    }, true, ['encrypt', 'decrypt']);
}
function encrypt(params, key, data) {
    return window.crypto.subtle.encrypt(params, key, data);
}
function decrypt(params, key, data) {
    return window.crypto.subtle.decrypt(params, key, data);
}
function importKey(keyArr) {
    return crypto.subtle.importKey('raw', keyArr, 'AES-GCM', false, ['encrypt', 'decrypt',]);
}
function send(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var plainArr, iv, key, keyArr, _a, keyPlain64, params, cipherArr, _b, cipherPlain;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    plainArr = new TextEncoder().encode(msg);
                    iv = generayeRandomUint8Array(96 / 8);
                    return [4 /*yield*/, generateKey(256)];
                case 1:
                    key = _c.sent();
                    _a = Uint8Array.bind;
                    return [4 /*yield*/, crypto.subtle.exportKey('raw', key)];
                case 2:
                    keyArr = new (_a.apply(Uint8Array, [void 0, _c.sent()]))();
                    keyPlain64 = btoa(arrayBufferToString(keyArr));
                    params = {
                        name: 'AES-GCM',
                        iv: iv,
                        // additionalData: new Uint8Array(),
                        tagLength: 128
                    };
                    _b = Uint8Array.bind;
                    return [4 /*yield*/, encrypt(params, key, plainArr)];
                case 3:
                    cipherArr = new (_b.apply(Uint8Array, [void 0, _c.sent()]))();
                    cipherPlain = btoa(arrayBufferToString(cipherArr));
                    return [2 /*return*/, { cipherPlain: cipherPlain, iv: iv, keyPlain64: keyPlain64 }];
            }
        });
    });
}
function get(params, key64, cipherPlain) {
    return __awaiter(this, void 0, void 0, function () {
        var cipherArr, keyArr, key, msgArr, _a, msgPlain;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log(params, key64, cipherPlain);
                    cipherArr = stringToArrayBuffer(atob(cipherPlain));
                    keyArr = stringToArrayBuffer(atob(key64));
                    return [4 /*yield*/, importKey(keyArr)];
                case 1:
                    key = _b.sent();
                    _a = Uint8Array.bind;
                    return [4 /*yield*/, decrypt(params, key, cipherArr)];
                case 2:
                    msgArr = new (_a.apply(Uint8Array, [void 0, _b.sent()]))();
                    msgPlain = new TextDecoder().decode(msgArr);
                    console.log(cipherPlain);
                    console.log(key64);
                    console.log(msgArr);
                    console.log(msgPlain);
                    return [2 /*return*/, msgPlain];
            }
        });
    });
}
var TEXT_A_CODE = 'Coucou 😊Coucou 😊Coucou 😊Coucou 😊';
//send(TEXT_A_CODE);
