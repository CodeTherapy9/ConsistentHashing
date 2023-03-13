const express = require('express')
const crypto = require("crypto")
const app = express()
const bodyParser = require('body-parser')
const Status = require('http-status')
const { executeQuery } = require('./dbLayer')
const { getNumberFromUrl } = require('./hashGen')
const applicationLayer = require('./applicationLayer')
const {checkForHealthyServer, registerNewServerOrMakeAliveDeadServer, addServerToMasterSet, deleteServerFromMasterSet} = require('./healthCheck')
const cron = require('./cron')
app.use(bodyParser());
app.get('/consistent-hash/:rid', async (req, res) => {
    const result = await applicationLayer.serveFromHashRing(req.params.rid)
    res.send({
        result: result.message,
        reqHashId: req.params.rid
    })
})


app.post('/edit-server-in-masterset', async (req, res) => {
    const body = req.body
    let addOrDel = "add"
    const list =  (Array.isArray(req.body.urls)) ? req.body.urls : [req.body.urls]
    if (body.delete) addOrDel = "del"
    if (addOrDel === "add") {
        await Promise.all(list.map(async data => {
            await addServerToMasterSet(data)
          }))
    } else {
        await Promise.all(list.map(async data => {
            await deleteServerFromMasterSet(data)
          }))
    }
    res.send({
        status: "OK"
    })
})

app.listen(6969, () => console.log("listening to port 6969 ..."))