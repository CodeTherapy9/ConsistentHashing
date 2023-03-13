require("dotenv").config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const applicationLayer = require('./app/applicationLayer')
const { addServerToMasterSet, deleteServerFromMasterSet } = require('./util/healthCheck')
const { health_check_job } = require('./util/cron')
app.use(bodyParser());

const db = require("./models");
db.sequelize.sync();
// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

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
    const list = (Array.isArray(req.body.urls)) ? req.body.urls : [req.body.urls]
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
health_check_job.start();
app.listen(6969, () => console.log("listening to port 6969 ..."))