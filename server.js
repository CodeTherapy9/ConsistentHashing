const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Status = require('http-status')
const { executeQuery } = require('./dbLayer')
const { getNumberFromUrl } = require('./hashGen')
const {checkForHealthyServer, registerNewServerOrMakeAliveDeadServer} = require('./healthCheck')
// db.connect().then(() => console.log("connected to psql via connection pool ..."))
app.use(bodyParser());
app.get('/data', async (req, res) => {
    const r = await executeQuery(`SELECT * FROM server_live`)
    const rr = await checkForHealthyServer()
    // console.log(r, rr)
    const url = req.url
    const firstPositionInHashRing  = getNumberFromUrl(url, 5, 10000)
    const secondPositionInHashRing = getNumberFromUrl(url, 7, 10000)
    res.send({
        firstPositionInHashRing, secondPositionInHashRing
    })
})

app.post('/addServer', async (req, res, next) => {
    try {
        const result = await registerNewServerOrMakeAliveDeadServer(req.body.port)
        res.status(Status.OK)
        res.send(result)
    } catch (err) {
        next(err)
    }
})

app.post('/', async (req, res) => {
    
})

app.listen(6969, () => console.log("listening to port 6969 ..."))