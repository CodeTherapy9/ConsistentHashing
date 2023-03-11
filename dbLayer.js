const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database: 'myDb',
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