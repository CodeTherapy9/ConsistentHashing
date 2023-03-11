const hashGen = require('./hashGen')
const healthCheck = require('./healthCheck')
const crypto = require('crypto')
const _ = require("lodash")
const { callAPI } = require('./externalAPIcall')

let serverList = []

const getHashPositionsOfServers = async () => {
    const healthyServers = await healthCheck.listHealthyServers()
    await Promise.all(healthyServers.map(async serverInfo => {
        hashPwd = crypto.createHash('sha1').update(serverInfo.port).digest('hex');
        serverList.push({pos: hashGen.getNumberFromUrl(hashPwd, 5, 10000), url: serverInfo.port})
        serverList.push({pos: hashGen.getNumberFromUrl(hashPwd, 7, 10000), url: serverInfo.port})
      }))
    serverList = _.uniqBy(serverList, 'pos')
    serverList = _.sortBy(serverList, 'pos')
    console.log(serverList);
}
const getServerToServe = async (rid) => {
    if (serverList.length == 0) await getHashPositionsOfServers()
    const hashId = hashGen.getNumberFromUrl(rid, 5, 10000)
    let lo = 0, hi = serverList.length - 1
    let ans = -1
    while (lo < hi) {
        let mid = Math.floor((lo + hi) / 2)
        if (serverList[mid].pos > hashId) {
            ans = serverList[mid]
            hi = mid - 1
        } else {
            lo = mid + 1
        }
    }
    if (ans == -1) {
        ans = serverList[0]
    }
    return ans
}
const serveFromHashRing = async (rid) => {
    const server = await getServerToServe(rid)
    const hashId = hashGen.getNumberFromUrl(rid, 5, 10000)
    const resFromApiCall = await callAPI('GET', `${server.url}/api/${hashId}`)
    
    return resFromApiCall
}
module.exports = {
    getHashPositionsOfServers,
    getServerToServe,
    serveFromHashRing
}