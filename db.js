const Pool = require("pg").Pool;

const pool = new Pool({
    user : "efbyvqlk",
    password : "Tqmrp5WpR_FuOtNFSWBCY4ykTJsgz9aC",
    database : "efbyvqlk",
    host : "surus.db.elephantsql.com",
    port : 5432
});

module.exports = pool;