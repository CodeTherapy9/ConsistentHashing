const dbConfig = require("../config/db.config.js");
const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit : 100, 
    host     : dbConfig.HOST,
    user     : dbConfig.USER,
    password : dbConfig.PASSWORD,
    database : dbConfig.DB,
    debug    :  false
});
console.log(`connected to mysql ...`)

const executeQuery = async (query) => {
    return new Promise((resolve, reject)=>{
        pool.query(query, (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
}

module.exports = {
    executeQuery
}