const crypto = require('crypto')
const _hashFunction = (s, hashGen = 4, M = 1e9 + 7) => {
    let sum = 0, mul = 1
    for (let i = 0; i < s.length; ++i) {
        mul = (i % hashGen == 0) ? 1 : mul * 256
        sum += (s[i].charCodeAt()) * mul
    }
    return (sum % M)
} 

const _md5 = data => crypto.createHash('md5').update(data).digest("hex")

const getNumberFromUrl = (url, n = 4, m = 1e9 + 7) => {
    return _hashFunction(_md5(url), n, m)
}

module.exports = {
    getNumberFromUrl
}