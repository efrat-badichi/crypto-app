const mysql = require('mysql2');
const config = require('config');
const util = require('util');

const pool = mysql.createPool({
    host: "localhost",// config.get('mysql.host'),
    user: "username",//config.get('mysql.user'),
    password:"password",// config.get('mysql.password'),
    database: "mydb",//config.get('mysql.database'),
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
});

pool.query = util.promisify(pool.query);
pool.execute = util.promisify(pool.execute);

module.exports = (req, res, next) => {
    req.pool = pool;
    next();
}