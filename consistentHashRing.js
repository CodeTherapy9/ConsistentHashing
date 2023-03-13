const { createHash } = require('crypto')
const healthCheck = require("./healthCheck")

const {callAPI} = require("./externalAPIcall")
const ringSize = 1e9 + 7
const wt = 50

let hashRing = new Set()
let hashRingArray = []
const hashFn = (value) => {
    const ringPos = createHash('sha1').update(value).digest().readInt32BE();
    return ((ringPos % ringSize) + ringSize) % ringSize
}
const addNodesToRing = (value) => {
    for (let i = 1; i <= wt; ++i) {
        const pos = hashFn(Buffer.from(value + "\0" + i))
        hashRing.add(pos.toString() + "#" + value)
    }
}

const removeNodesFromRing = (value) => {
    for (let i = 1; i <= wt; ++i) {
        const pos = hashFn(Buffer.from(value + "\0" + i))
        hashRing.delete(pos.toString() + "#" + value)
    }
}


const createOrUpdateHashRing = async () => {
    const servers = await healthCheck.listServers()
    const idsWithDeadServer = []
    const idsToLive = []
    await Promise.all(servers.map(async serverInfo => {
        const healthCheckRes = await callAPI(`GET`, `${serverInfo.port}/api/health/check`)
        if (!healthCheckRes || (healthCheckRes.status >= 400 && healthCheckRes.status < 600)) {
            idsWithDeadServer.push(serverInfo.port)
        } else idsToLive.push(serverInfo.port)
      }))
    for (let i = 0; i < idsToLive.length; ++i) addNodesToRing(idsToLive[i].port)
    for (let i = 0; i < idsWithDeadServer.length; ++i) removeNodesFromRing(idsWithDeadServer[i].port)

    hashRingArray = Array.from(hashRing)
    hashRingArray.sort((a, b) => {
        return Number(a.split("#")[0]) - Number(b.split("#")[0])
    })
    return hashRingArray
}

const findServer = async (req) => {
    const rid = hashFn(Buffer.from(req))
    if (hashRingArray.length == 0) await createOrUpdateHashRing()
    let lo = 0, hi = hashRingArray.length - 1
    let ans = -1
    while (lo <= hi) {
        let mid = Math.floor((lo + hi) / 2)
        const midServer = Number(hashRingArray[mid].split("#")[0])
        if (midServer > rid) {
            ans = hashRingArray[mid]
            hi = mid - 1
        } else {
            lo = mid + 1
        }
    }
    if (ans == -1 && hashRingArray?.length) {
        ans = hashRingArray[0]
    }
    return ans.split("#")[1]
}

module.exports = {
    findServer,
    createOrUpdateHashRing
}