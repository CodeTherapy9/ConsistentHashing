const app = require('express')()
const db = require('./dbLayer')
const { getNumberFromUrl } = require('./hashGen')
db.connect().then(() => console.log("connected to psql via connection pool ..."))

app.get('/data', async (req, res) => {
    const url = req.url
    const firstPositionInHashRing  = getNumberFromUrl(url, 5, 10000)
    const secondPositionInHashRing = getNumberFromUrl(url, 7, 10000)
    res.send({
        firstPositionInHashRing, secondPositionInHashRing
    })
})

app.post('/', async (req, res) => {
    
})

app.listen(3000, () => console.log("listening to port 3000 ..."))