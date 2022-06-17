const Pool = require("pg").Pool;

const pool = new Pool({
    user : "fablab_user",
    password : "root",
    database : "api_fablab",
    host : "localhost",
    port : 5432
});

module.exports = pool;