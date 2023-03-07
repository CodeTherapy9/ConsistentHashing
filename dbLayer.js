const { Pool } = require("pg")

const client = new Pool({
    "host":"127.0.0.1",
    "port": "5435",
    "user":"user",
    "password":"password123",
    "database":"postgres"
})
async function  connect () {
    client.connect()
}

module.exports = {
    connect
}