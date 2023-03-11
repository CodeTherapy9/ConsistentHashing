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
        serverList.push({pos: hashGen.getNumberFromUrl(hashPwd, 2), url: serverInfo.port})
        serverList.push({pos: hashGen.getNumberFromUrl(hashPwd, 3), url: serverInfo.port})
        serverList.push({pos: hashGen.getNumberFromUrl(hashPwd, 5), url: serverInfo.port})
        serverList.push({pos: hashGen.getNumberFromUrl(hashPwd, 7), url: serverInfo.port})
      }))
    let newServerList = []
    for (let i = 0; i < serverList.length; ++i) {
        for (let j = 0; j < healthyServers.length; ++j) {
            if (serverList[i].url == healthyServers[j].port) {
                newServerList.push(serverList[i])
            }
        }
    }
    serverList = newServerList
    serverList = _.uniqBy(serverList, 'pos')
    serverList = _.sortBy(serverList, 'pos')
    // console.log(serverList);
    return serverList
}
const getServerToServe = async (rid) => {
    if (serverList.length == 0) await getHashPositionsOfServers()
    const hashId = hashGen.getNumberFromUrl(rid, 5)
    let lo = 0, hi = serverList.length - 1
    let ans = -1
    while (lo <= hi) {
        let mid = Math.floor((lo + hi) / 2)
        if (serverList[mid].pos > hashId) {
            ans = serverList[mid]
            hi = mid - 1
        } else {
            lo = mid + 1
        }
    }
    if (ans == -1 && serverList?.length) {
        ans = serverList[0]
    }
    return ans
}
const serveFromHashRing = async (rid) => {
    const server = await getServerToServe(rid)
    const hashId = hashGen.getNumberFromUrl(rid, 5)
    console.log("!!!!API CALL",server, hashId)
    const resFromApiCall = await callAPI('GET', `${server.url}/api/${hashId}`)
    await healthCheck.updateDBforAnalytics(server.url, resFromApiCall.status, rid)
    return resFromApiCall
}
module.exports = {
    getHashPositionsOfServers,
    getServerToServe,
    serveFromHashRing
}