const Pool = require("pg").Pool;

const pool = new Pool({
    user : "marcus",
    password : "boss",
    database : "api_fablab",
    host : "localhost",
    port : 5432
});

module.exports = pool;