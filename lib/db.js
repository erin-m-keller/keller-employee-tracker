// initialize variables
const mysql = require('mysql2');

/**
 * @databaseConnection
 * creates the connection object for 
 * use within the entire application
 */
const connection = mysql.createConnection({
    host: 'localhost', // server
    user: process.env.DB_USER, // set in .env
    password: process.env.DB_PASSWORD, // set in .env
    database: 'employees_db' // database name
});

// exports the connect
module.exports = connection;