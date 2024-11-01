// db/database.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'GuiTN83.',
    database: 'clinica'
});

module.exports = pool.promise();
