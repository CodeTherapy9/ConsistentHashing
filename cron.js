const {checkForHealthyServer} = require('./healthCheck')
const {getHashPositionsOfServers} = require('./applicationLayer')
const cron = require('cron').CronJob

const job = new cron(
	'*/30 * * * * *',
	async function() {
		console.log('running health check every 30 seconds to check active servers . . .');
        await checkForHealthyServer()
        await getHashPositionsOfServers()
	},
	null,
	true,
	'America/Los_Angeles'
);

module.exports = {

}