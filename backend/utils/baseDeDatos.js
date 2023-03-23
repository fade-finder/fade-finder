const MySQL = require('mysql2');

const pool = MySQL.createPool({
    host: 'localhost',
    user: 'root',
    database: 'fadefinder',
    password: '140503' //Aqui va tu password de MySQL workbench
});

module.exports = pool.promise();