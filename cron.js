const {checkForHealthyServer} = require('./healthCheck')
const {getHashPositionsOfServers} = require('./applicationLayer')
const cron = require('cron').CronJob

const job = new cron(
	'*/5 * * * * *',
	async function() {
		console.log('running health check every 30 seconds to check active servers . . .');
        await checkForHealthyServer()
        const data = await getHashPositionsOfServers()
        const dataMap = {}
        data.push({pos: data[0].pos + 100, url: data[0].url})
        for (let i = 0; i < data.length - 1; ++i) {
            if (dataMap[data[i + 1].url])
            dataMap[data[i + 1].url] += (data[i + 1].pos - data[i].pos)
            else dataMap[data[i + 1].url] = data[i + 1].pos - data[i].pos
        }
        console.log(dataMap);
	},
	null,
	true,
	'America/Los_Angeles'
);

module.exports = {

}