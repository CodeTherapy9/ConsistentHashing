const { callAPI } = require('./externalAPIcall')
const { executeQuery } = require('./dbLayer')
const _ = require('lodash')
const reel = require('node-reel')
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
    await executeQuery(`UPDATE server_live SET server_status = '0' WHERE (id in (${ids}));
    `)
}
const registerNewServerOrMakeAliveDeadServer = async (port) => {
    return executeQuery(`INSERT INTO server_live(server_port, server_status)   
    VALUES (${port}, 1)  
    ON DUPLICATE KEY UPDATE server_status = 1;`)
}
const checkForHealthyServer = async () => {
    const servers = await listHealthyServers()
    const idsWithDeadServer = []
    await Promise.all(servers.map(async serverInfo => {
        const healthCheckRes = await callAPI(`GET`, `http://localhost:${serverInfo.port}/api/health/check`)
        if (!healthCheckRes || (healthCheckRes.status >= 400 && healthCheckRes.status < 600)) {
            idsWithDeadServer.push(serverInfo.id)
        }
      }))
      if(idsWithDeadServer?.length) await unlistDeadServers(idsWithDeadServer)
}


const job = new cron(
	'*/10 * * * * *',
	async function() {
		console.log('running health check every 10 second, active servers . . .');
        await checkForHealthyServer()
	},
	null,
	true,
	'America/Los_Angeles'
);

module.exports = {
    checkForHealthyServer,
    registerNewServerOrMakeAliveDeadServer
}