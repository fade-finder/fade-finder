const MySQL = require('mysql2');
require('dotenv').config()

const pool = MySQL.createPool({
    host: 'localhost',
    user: 'root',
    database: 'fadefinder',
    password: 'ByV12@bx2'
});

module.exports = pool.promise();