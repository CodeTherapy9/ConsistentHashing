const { callAPI } = require('./externalAPIcall')
const { executeQuery } = require('./dbLayer')
const moment = require("moment")
const _ = require('lodash')
const cron = require('cron').CronJob

const listServers = async() => {
    const servers = await executeQuery(`select id, server_port, server_status from server_live`)
    const result = []
    servers.forEach(server => {
        result.push({
            id: server.id,
            port: server.server_port,
            serverStatus: server.server_status
        })
    } )
    return result
}



const updateDBforAnalytics = async (server, status, rid) => {
    const timeNow = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    return executeQuery(`INSERT INTO analytics(server, status, timestamp, rid)   
    VALUES ("${server}", "${status}", "${timeNow}", "${rid}")`)
}

const addServerToMasterSet = async (server) => {
    return executeQuery(`INSERT INTO server_live(server_port, server_status) VALUES ("${server}", 1) ON DUPLICATE KEY UPDATE server_status = 1;`)
}

const deleteServerFromMasterSet = async (server) => {
    return executeQuery(`UPDATE server_live SET server_status = '0' WHERE server_port = "${server}";
    `)
}

module.exports = {
    updateDBforAnalytics,
    addServerToMasterSet,
    deleteServerFromMasterSet,
    listServers
}