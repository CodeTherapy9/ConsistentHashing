const crypto = require('crypto')
const _hashFunction = (s, hashGen = 4, M = 1e9 + 7) => {
    let sum = 0, mul = 1
    for (let i = 0; i < s.length; ++i) {
        mul = (i % hashGen == 0) ? 1 : mul * 67657
        mul = (i % (hashGen+1) == 0) ? 1 : mul * 3519
        mul = (i % (hashGen+3) == 0) ? 1 : mul * 38235
        sum += ((s[i].charCodeAt()) * mul * (i + 1)) % M
    }
    return (sum % M)
} 

const _md5 = data => crypto.createHash('md5').update(data).digest("hex")

const getNumberFromUrl = (url, n = 4, m = 101) => {
    return _hashFunction(_md5(url), n, m)
}

module.exports = {
    getNumberFromUrl
}