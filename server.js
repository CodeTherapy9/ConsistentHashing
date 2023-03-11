const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Status = require('http-status')
const { executeQuery } = require('./dbLayer')
const { getNumberFromUrl } = require('./hashGen')
const applicationLayer = require('./applicationLayer')
const {checkForHealthyServer, registerNewServerOrMakeAliveDeadServer} = require('./healthCheck')
const cron = require('./cron')
app.use(bodyParser());
app.get('/consistent-hash/:rid', async (req, res) => {
    const url = req.params.rid
    const result = await applicationLayer.serveFromHashRing(url)
    const hashId = getNumberFromUrl(url, 5, 10000)
    res.send({
        result: result,
        reqHashId: hashId
    })
})


app.post('/', async (req, res) => {
    
})

app.listen(6969, () => console.log("listening to port 6969 ..."))