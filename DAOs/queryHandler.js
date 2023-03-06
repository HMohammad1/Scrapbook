const {config} = require('dotenv');
const mysql = require('mysql');

// get environment
config({path: `.env.${process.env.NODE_ENV}`});
var env = process.env.NODE_ENV;
var testENV = env === 'test';

var pool = mysql.createPool({
    connectionLimit: 74,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    //port: 3306,
    database: process.env.DB_NAME,
    debug: process.env.DB_DEBUG
});

function executeQuery(query, params, callback) {
    // try and get an avaliable connection from the pool
    pool.getConnection(function(err, connection) {
        // connection refused -- error
        if (err){
            return callback(err, null);
        } 
        // connection established -- try query
        else if (connection) {
            // start the transation
            connection.query("START TRANSACTION");
            console.log(query);
            connection.query(query, params, function(err, rows, fields) {
                connection.release();
                if (err) {
                    return callback(err, null);
                }
                // if test environment roll back last query
                if(testENV){
                    connection.query("ROLLBACK");
                }
                // else commit the transaction
                else{
                    connection.query("COMMIT");
                }
                return callback(null, rows);
            });
        }
        //no connections avaliable -- DB at capacity
        else{
            return callback(true, "No Connection");
        }
    });
}

module.exports = {
    executeQuery
};