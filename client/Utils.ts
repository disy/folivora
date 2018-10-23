export default class Utils {
    static dec2hex(dec) {
        return ('0' + dec.toString(16)).substr(-2)
    }

    static generateId(len) {
        var arr = new Uint8Array((len || 40) / 2)

        window.crypto.getRandomValues(arr)

        return Array.from(arr, Utils.dec2hex).join('')
    }

    static hex(buffer) {
        let hexCodes = [];
        let view = new DataView(buffer);

        for (let i = 0; i < view.byteLength; i += 4) {
            let value = view.getUint32(i);
            let stringValue = value.toString(16);
            let padding = '00000000';
            let paddedValue = (padding + stringValue).slice(-padding.length);

            hexCodes.push(paddedValue);
        }

        return hexCodes.join('');
    }

    static async sha256(str) {
        let buffer = new TextEncoder().encode(str);

        return Utils.hex(await crypto.subtle.digest("SHA-256", buffer));
    }
}