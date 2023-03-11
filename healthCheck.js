const { callAPI } = require('./externalAPIcall')
const { executeQuery } = require('./dbLayer')
const moment = require("moment")
const _ = require('lodash')
const cron = require('cron').CronJob
const listHealthyServers = async() => {
    const servers = await executeQuery(`select id, server_port from server_live where server_status = 1`)
    const result = []
    servers.forEach(server => {
        result.push({
            id: server.id,
            port: server.server_port
        })
    } )
    return result
}

const unlistDeadServers = async (ids = []) => {
    if (ids.length == 0) return
    let query = "("
    ids.forEach(id => {
        query += `"${id}", `
    })
    query = query.substring(0,query.length-2);
    query += ")"
    await executeQuery(`UPDATE server_live SET server_status = '0' WHERE (server_port in ${query});
    `)
}
const registerNewServerOrMakeAliveDeadServer = async (port) => {
    return executeQuery(`INSERT INTO server_live(server_port, server_status)   
    VALUES ("${port}", 1)  
    ON DUPLICATE KEY UPDATE server_status = 1;`)
}
const serverList = async () => {
    const servers = await executeQuery(`select id, base_url from servers where record_status = 1`)
    const result = []
    servers.forEach(server => {
        result.push({
            id: server.id,
            baseUrl: server.base_url
        })
    } )
    return result
}
const checkForHealthyServer = async () => {
    const servers = await serverList()
    const idsWithDeadServer = []
    const activeServers = []
    await Promise.all(servers.map(async serverInfo => {
        const healthCheckRes = await callAPI(`GET`, `${serverInfo.baseUrl}/api/health/check`)
        if (!healthCheckRes || (healthCheckRes.status >= 400 && healthCheckRes.status < 600)) {
            idsWithDeadServer.push(serverInfo.baseUrl)
        } else {
            activeServers.push(serverInfo.baseUrl)
        }
      }))
      if(idsWithDeadServer?.length) await unlistDeadServers(idsWithDeadServer)
      if (activeServers?.length) {
        await Promise.all(activeServers.map(async serverInfo => {
            await registerNewServerOrMakeAliveDeadServer(serverInfo)
          }))
      }
}

const updateDBforAnalytics = async (server, status, rid) => {
    const timeNow = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    return executeQuery(`INSERT INTO analytics(server, status, timestamp, rid)   
    VALUES ("${server}", "${status}", "${timeNow}", "${rid}")`)
}

const addServerToMasterSet = async (server) => {
    return executeQuery(`INSERT INTO servers(base_url, record_status) VALUES ("${server}", 1) ON DUPLICATE KEY UPDATE record_status = 1;`)
}

const deleteServerFromMasterSet = async (server) => {
    return executeQuery(`UPDATE servers SET record_status = '0' WHERE base_url = "${server}");
    `)
}

module.exports = {
    checkForHealthyServer,
    registerNewServerOrMakeAliveDeadServer,
    listHealthyServers,
    updateDBforAnalytics,
    addServerToMasterSet,
    deleteServerFromMasterSet
}