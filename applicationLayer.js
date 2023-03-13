const healthCheck = require('./healthCheck')
const _ = require("lodash")
const { callAPI } = require('./externalAPIcall')
const { findServer } = require('./consistentHashRing')

const getServerToServe = async (rid) => {
    return findServer(rid)
}
const serveFromHashRing = async (rid) => {
    const server = await getServerToServe(rid)
    console.log("!!!!API CALL",server, rid)
    const resFromApiCall = await callAPI('GET', `${server}/api/${rid}`)
    await healthCheck.updateDBforAnalytics(server, resFromApiCall.status, rid)
    return resFromApiCall
}
module.exports = {
    getServerToServe,
    serveFromHashRing
}