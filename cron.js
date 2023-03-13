const {createOrUpdateHashRing} = require('./consistentHashRing')
const cron = require('cron').CronJob

const job = new cron(

	'*/2 * * * * *',
	async function() {
		console.log('running health check every 20 seconds to check active servers . . .');
        const hashRing = await createOrUpdateHashRing()
        const dataMap = {}
        if (hashRing.length > 0) {
            const s = (Number(hashRing[0].split("#")[0]) + 1e9 + 7).toString() + "#" + hashRing[0].split("#")[1]
            hashRing.push(s)
            for (let i = 0; i < hashRing.length - 1; ++i) {
                const scurr = hashRing[i].split("#")
                const snext = hashRing[i + 1].split("#")
                if (dataMap[snext[1]]) {
                    dataMap[snext[1]] = (Number(dataMap[snext[1]]) + Number(snext[0]) - Number(scurr[0]))
                    
                } else {
                    dataMap[snext[1]] = (Number(snext[0]) - Number(scurr[0]))
                    // console.log(dataMap[snext[1]]);
                }
            }
            console.log(dataMap);
        }
	},
	null,
	true,
	'America/Los_Angeles'
);

module.exports = {

}